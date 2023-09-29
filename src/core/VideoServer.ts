export type VideoServerType = {
  name: string;
  embed: string;
  extraData?: Record<string, string>;
};

export default function VideoServer(data: VideoServerType) {
  return data;
}
