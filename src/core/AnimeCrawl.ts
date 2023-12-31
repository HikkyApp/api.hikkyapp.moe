import CrawlBase from './CrawlBase';
import { MediaType } from '../types/anilist';
import { RequireAtLeastOne } from '../utils/types';
import { Anime, SourceAnime } from '../types/data';
import { writeFile } from '../utils/index';
import { getRetriesId } from '../utils/anilist';
import { AxiosRequestConfig } from 'axios';
import { readfile } from '../utils/index';
import { mergeAnimeInfo } from '../utils/data';

export type Subtitle = {
  language: string;
  lang: string;
  file: string;
};

export type Font = {
  file: string;
};

export type VideoSource = {
  file: string;
  label?: string;
  useProxy?: boolean;
  proxy?: any;
};

export type AnimeSource = {
  sources: VideoSource[];
  subtitles?: Subtitle[];
  fonts?: Font[];
  thumbnail?: string;
};

export type GetSourcesQuery = {
  source_id: string;
  source_media_id: string;
  episode_id: string;
  request: Request;
};

export default class AnimeCrawl extends CrawlBase {
  type: MediaType.Anime;
  monitorURL: string;

  constructor(
    id: string,
    name: string,
    axiosConfig: RequireAtLeastOne<AxiosRequestConfig, 'baseURL'>,
  ) {
    super(id, name, axiosConfig);

    this.monitorURL = axiosConfig.baseURL;
    this.blacklistTitles = ['one piece'];
    this.type = MediaType.Anime;
  }

  async scrapeAllAnimePages(): Promise<SourceAnime[]> {
    const data = await this.scrapeAllPages(this.scrapeAnimePage.bind(this));

    writeFile(`./data/${this.id}.json`, JSON.stringify(data, null, 2));

    return data;
  }

  /**
   * Scrape data from anilist then merge it with data from source
   * @param sources sources of anime
   * @returns merged sources of anime
   */
  async scrapeAnilist(sources?: SourceAnime[]): Promise<Anime[]> {
    const fullSources = [];

    if (!sources) {
      sources = JSON.parse(readfile(`./data/${this.id}.json`));
    }

    if (!sources?.length) {
      throw new Error('No sources');
    }

    for (const source of sources) {
      if (!source?.titles?.length) continue;

      let anilistId: number;

      if (source.anilistId) {
        anilistId = source.anilistId;
      } else {
        anilistId = await getRetriesId(
          source.titles,
          MediaType.Anime,
          source.metadata,
        );
      }

      if (!anilistId) continue;

      fullSources.push(mergeAnimeInfo(source, anilistId));
    }

    writeFile(
      `./data/${this.id}-full.json`,
      JSON.stringify(fullSources, null, 2),
    );

    return fullSources;
  }

  async scrapeAnimePages(numOfPages: number): Promise<SourceAnime[]> {
    const sourceAnime: SourceAnime[] = await this.scrapePages(
      this.scrapeAnimePage.bind(this),
      numOfPages,
    );

    return sourceAnime.filter((anime) => anime?.episodes?.length);
  }

  async scrapeAnimePage(_page: number): Promise<any[]> {
    throw new Error('scrapeAnimePage not implemented');
  }

  async scrapeAnime(_animeId: string): Promise<SourceAnime> {
    throw new Error('scrapeAnime not implemented');
  }

  async getSources(_ids: GetSourcesQuery): Promise<AnimeSource> {
    throw new Error('getSources not implemented');
  }
}
