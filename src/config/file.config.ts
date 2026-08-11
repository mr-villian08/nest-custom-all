import { registerAs } from '@nestjs/config';

const parseNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseList = (value: string | undefined): string[] => {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
};

export default registerAs('files', () => ({
  root: process.env.NODE_APP_FILES_ROOT ?? 'public',

  serveUrl: process.env.NODE_APP_FILES_SERVE_URL ?? '',

  maxSize: parseNumber(process.env.NODE_APP_FILES_MAX_SIZE, 100 * 1024 * 1024),

  maxFiles: parseNumber(process.env.NODE_APP_FILES_MAX_FILES, 20),

  allowedMimeTypes: parseList(process.env.NODE_APP_FILES_ALLOWED_MIME_TYPES),
}));
