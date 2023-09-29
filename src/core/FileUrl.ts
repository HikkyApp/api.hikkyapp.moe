export interface FileUrlType {
  url: string;
  headers?: Record<string, string>;
}

export default function FileUrl(data: FileUrlType) {
  return data;
}
