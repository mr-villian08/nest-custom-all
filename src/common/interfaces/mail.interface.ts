import { SentMessageInfo } from 'nodemailer';
import { Attachment } from 'nodemailer/lib/mailer';

export interface SendEmailParams {
  to: string | string[];

  subject: string;

  template: string;

  textTemplate?: string;

  context?: Record<string, unknown>;

  attachments?: Attachment[];

  cc?: string | string[];

  bcc?: string | string[];

  includeDefaultCc?: boolean;

  includeDefaultBcc?: boolean;
}

export type SendEmailResult = SentMessageInfo;
