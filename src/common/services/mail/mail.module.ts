import path from 'node:path';
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.NODE_APP_MAIL_HOST,
        port: Number(process.env.NODE_APP_MAIL_PORT),
        secure: process.env.NODE_APP_MAIL_SECURE === 'true',
        auth: {
          user: process.env.NODE_APP_MAIL_USER,
          pass: process.env.NODE_APP_MAIL_PASS,
        },
        tls: {
          rejectUnauthorized:
            process.env.NODE_APP_MAIL_TLS_REJECT_UNAUTHORIZED === 'true',
        },
      },
      defaults: {
        from: {
          name: process.env.NODE_APP_MAIL_FROM_NAME!,
          address: process.env.NODE_APP_MAIL_FROM_ADDRESS!,
        },
      },
      template: {
        dir: path.join(process.cwd(), 'templates'),
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
          defaultLayout: 'main',
          viewsDir: path.join(process.cwd(), 'templates', 'emails'),
        },
      },
    }),
  ],
})
export class MailModule {}
