import { registerAs } from '@nestjs/config';

const parseNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseBoolean = (
  value: string | undefined,
  fallback: boolean,
): boolean => {
  if (value === undefined) {
    return fallback;
  }

  return value.toLowerCase() === 'true';
};

const parseList = (value: string | undefined): string[] => {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

export default registerAs('mail', () => ({
  smtp: {
    host: process.env.NODE_APP_SMTP_HOST ?? '',

    port: parseNumber(process.env.NODE_APP_SMTP_PORT, 587),

    secure: parseBoolean(process.env.NODE_APP_SMTP_SECURE, false),

    user: process.env.NODE_APP_SMTP_USER ?? '',

    password: process.env.NODE_APP_SMTP_PASS ?? '',

    rejectUnauthorized: parseBoolean(
      process.env.NODE_APP_SMTP_REJECT_UNAUTHORIZED,
      true,
    ),
  },

  from: {
    address: process.env.NODE_APP_SMTP_MAIL_FROM ?? '',

    name: process.env.NODE_APP_SMTP_MAIL_FROM_NAME ?? 'Cappuccino Argus',
  },

  defaults: {
    bcc: parseList(process.env.NODE_APP_MAIL_BCC),

    cc: parseList(process.env.NODE_APP_MAIL_CC),
  },
}));
