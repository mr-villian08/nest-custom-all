import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

import type { ConfigType } from '@nestjs/config';

import nodemailer from 'nodemailer';

import type { SendMailOptions, SentMessageInfo, Transporter } from 'nodemailer';

import hbs from 'nodemailer-express-handlebars';

import path from 'node:path';

import mailConfig from '../../../config/mail.config';

import { SendEmailParams } from '../../interfaces/mail.interface';

type TemplateMailOptions = SendMailOptions & {
  template: string;
  context?: Record<string, unknown>;
};

@Injectable()
export class MailService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MailService.name);

  private readonly transporter: Transporter<SentMessageInfo>;

  constructor(
    @Inject(mailConfig.KEY)
    private readonly config: ConfigType<typeof mailConfig>,
  ) {
    this.transporter = this.createTransporter();
  }

  private createTransporter(): Transporter<SentMessageInfo> {
    const transporter = nodemailer.createTransport({
      host: this.config.smtp.host,
      port: this.config.smtp.port,
      secure: this.config.smtp.secure,

      auth: {
        user: this.config.smtp.user,
        pass: this.config.smtp.password,
      },

      tls: {
        rejectUnauthorized: this.config.smtp.rejectUnauthorized,
      },

      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      disableUrlAccess: true,
    });

    const templateDirectory = path.join(process.cwd(), 'templates');

    transporter.use(
      'compile',
      hbs({
        viewEngine: {
          extname: '.hbs',
          layoutsDir: path.join(templateDirectory, 'layouts'),
          defaultLayout: 'main',
          partialsDir: path.join(templateDirectory, 'emails'),
        },
        viewPath: path.join(templateDirectory, 'emails'),
        extName: '.hbs',
      }),
    );

    return transporter;
  }

  async onModuleInit(): Promise<void> {
    await this.verify();
  }

  onModuleDestroy(): void {
    this.transporter.close();
  }

  async sendEmail(params: SendEmailParams): Promise<SentMessageInfo> {
    try {
      const {
        to,
        subject,
        template,
        context = {},
        attachments = [],
        cc,
        bcc,
        includeDefaultCc = false,
        includeDefaultBcc = false,
      } = params;

      const finalCc = this.mergeRecipients(
        includeDefaultCc ? this.config.defaults.cc : [],
        cc,
      );

      const finalBcc = this.mergeRecipients(
        includeDefaultBcc ? this.config.defaults.bcc : [],
        bcc,
      );

      const mailOptions: TemplateMailOptions = {
        from: {
          address: this.config.from.address,
          name: this.config.from.name,
        },
        to,
        subject,
        template,
        context,

        ...(finalCc.length > 0 && {
          cc: finalCc,
        }),

        ...(finalBcc.length > 0 && {
          bcc: finalBcc,
        }),

        ...(attachments.length > 0 && {
          attachments,
        }),
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const info: SentMessageInfo = await this.sendMail(mailOptions);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.log(`Email sent successfully: ${info.messageId}`);

      return info;
    } catch (error) {
      this.logger.error(
        'Failed to send email',
        error instanceof Error ? error.stack : String(error),
      );

      throw new InternalServerErrorException('Unable to send email');
    }
  }

  private async sendMail(
    options: TemplateMailOptions,
  ): Promise<SentMessageInfo> {
    return this.transporter.sendMail(options);
  }

  async verify(): Promise<boolean> {
    try {
      await this.transporter.verify();

      this.logger.log('SMTP connection verified successfully');

      return true;
    } catch (error) {
      this.logger.error(
        'SMTP connection verification failed',
        error instanceof Error ? error.stack : String(error),
      );

      return false;
    }
  }

  private mergeRecipients(
    defaults: string[],
    recipients?: string | string[],
  ): string[] {
    const values = [
      ...defaults,
      ...(recipients
        ? Array.isArray(recipients)
          ? recipients
          : [recipients]
        : []),
    ];

    return [...new Set(values.map((email) => email.trim()).filter(Boolean))];
  }
}
