import { registerAs } from '@nestjs/config';
import { parseNumber } from '../common/helpers/number.helper';
import { parseBoolean, parseList } from '../common/helpers/string.helper';

export default registerAs('mail', () => ({
  smtp: {
    host: process.env.NODE_APP_MAIL_HOST ?? '',

    port: parseNumber(process.env.NODE_APP_MAIL_PORT, 587),

    secure: parseBoolean(process.env.NODE_APP_MAIL_SECURE, false),

    user: process.env.NODE_APP_MAIL_USER ?? '',

    password: process.env.NODE_APP_MAIL_PASS ?? '',

    rejectUnauthorized: parseBoolean(
      process.env.NODE_APP_MAIL_TLS_REJECT_UNAUTHORIZED,
      true,
    ),
  },

  from: {
    address: process.env.NODE_APP_MAIL_FROM_ADDRESS ?? '',

    name: process.env.NODE_APP_MAIL_FROM_NAME ?? 'Cappuccino Argus',
  },

  defaults: {
    bcc: parseList(process.env.NODE_APP_MAIL_BCC),
    cc: parseList(process.env.NODE_APP_MAIL_CC),
  },
}));
