import path from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): MailerOptions => ({
        transport: {
          host: configService.getOrThrow<string>('mail.smtp.host'),
          port: configService.getOrThrow<number>('mail.smtp.port'),
          secure: configService.getOrThrow<boolean>('mail.smtp.secure'),
          auth: {
            user: configService.getOrThrow<string>('mail.smtp.user'),
            pass: configService.getOrThrow<string>('mail.smtp.password'),
          },
          tls: {
            rejectUnauthorized: configService.getOrThrow<boolean>(
              'mail.smtp.rejectUnauthorized',
            ),
          },
        },
        defaults: {
          from: {
            name: configService.getOrThrow<string>('mail.from.name'),
            address: configService.getOrThrow<string>('mail.from.address'),
          },
          cc: configService.get<string[]>('mail.defaults.cc'),
          bcc: configService.get<string[]>('mail.defaults.bcc'),
        },
        template: {
          dir: path.join(process.cwd(), 'templates', 'emails'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        options: {
          partials: {
            dir: path.join(process.cwd(), 'templates', 'emails'),
            options: {
              strict: true,
            },
          },
          defaultLayout: 'main',
          viewsDir: path.join(process.cwd(), 'templates', 'emails'),
        },
      }),
    }),
  ],
})
export class MailModule {}
