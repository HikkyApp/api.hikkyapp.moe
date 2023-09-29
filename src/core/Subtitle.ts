import { FileUrlType } from './FileUrl';

enum Format {
  VTT = 'vtt',
  ASS = 'ass',
  SRT = 'srt',
}

export interface SubtitleType {
  language: string;
  type: Format;
  file: FileUrlType;
}

export default function Subtitle(data: SubtitleType) {
  return data;
}
