export interface UploadedFile {
  originalName: string;

  fileName: string;

  mimeType: string;

  size: number;

  path: string;

  url: string;

  duration?: number;
}
