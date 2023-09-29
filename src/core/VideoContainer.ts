import { SubtitleType } from './Subtitle';
import { VideoType } from './Video';

export interface VideoContainerType {
  videos: VideoType[];
  subtitles?: SubtitleType[];
}

export default function VideoContainer(data: VideoContainerType) {
  return data;
}
