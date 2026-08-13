import { registerAs } from '@nestjs/config';
import { parseNumber } from '../common/helpers/number.helper';
import { parseList } from '../common/helpers/string.helper';

export default registerAs('files', () => ({
  root: process.env.NODE_APP_FILES_ROOT ?? 'public',

  serveUrl: process.env.NODE_APP_FILES_SERVE_URL ?? '',

  maxSize: parseNumber(process.env.NODE_APP_FILES_MAX_SIZE, 100 * 1024 * 1024),

  maxFiles: parseNumber(process.env.NODE_APP_FILES_MAX_FILES, 20),

  allowedMimeTypes: parseList(process.env.NODE_APP_FILES_ALLOWED_MIME_TYPES),
}));
