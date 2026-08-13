//  This file contains constants related to file types that will be uploaded in the project.
export const FILE_TYPE = {
  IMAGE: 'image',
  DOCUMENT: 'document',
  AUDIO: 'audio',
  VIDEO: 'video',
} as const;

export type FileType = (typeof FILE_TYPE)[keyof typeof FILE_TYPE];
