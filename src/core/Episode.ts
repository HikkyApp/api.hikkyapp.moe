export interface EpisodeType {
  number: string;
  id: string;
  title?: string;
  isFiller?: boolean;
  description?: string;
  thumbnail?: string;
  extra?: Record<string, string>;
  section?: string;
}

export default function Episode(data: EpisodeType) {
  return data;
}
