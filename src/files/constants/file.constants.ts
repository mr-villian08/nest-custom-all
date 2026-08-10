export const FILE_TYPE = {
  IMAGE: 'image',
  DOCUMENT: 'document',
  AUDIO: 'audio',
  VIDEO: 'video',
} as const;

export type FileType = (typeof FILE_TYPE)[keyof typeof FILE_TYPE];

export const FILE_MIME_TYPES: Record<FileType, readonly string[]> = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],

  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
  ],

  audio: ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/webm', 'audio/ogg'],

  video: ['video/mp4', 'video/webm', 'video/quicktime'],
};

export const FILE_LIMITS = {
  MAX_FILES_PER_REQUEST: 20,

  MAX_FILE_SIZE: 100 * 1024 * 1024,

  IMAGE_MAX_SIZE: 10 * 1024 * 1024,

  DOCUMENT_MAX_SIZE: 20 * 1024 * 1024,

  AUDIO_MAX_SIZE: 60 * 1024 * 1024,

  VIDEO_MAX_SIZE: 100 * 1024 * 1024,
} as const;
