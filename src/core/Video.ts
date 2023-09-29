import { FileUrlType } from './FileUrl';

export enum VideoFormat {
  HLS = 'hls',
  DASH = 'dash',
  CONTAINER = 'container',
}

export interface VideoType {
  quality?: string;
  format?: VideoFormat;
  file: FileUrlType;
}

export default function Video(data: VideoType) {
  return data;
}
