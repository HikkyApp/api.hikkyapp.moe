import CrawlBase from './CrawlBase';
import { MediaType } from '../types/anilist';
import { RequireAtLeastOne } from '../utils/types';
import { Anime, SourceAnime } from '../types/data';
import { writeFile } from '../utils/index';
import { getRetriesId } from '../utils/anilist';
import { AxiosRequestConfig } from 'axios';
import { readfile } from '../utils/index';
import { mergeAnimeInfo } from '../utils/data';
export default class AnimeCrawl extends CrawlBase {
  monitorURl: string;
  type: MediaType.Anime;

  constructor(
    id: string,
    name: string,
    axiosConfig: RequireAtLeastOne<AxiosRequestConfig, 'baseURL'>,
  ) {
    super(id, name, axiosConfig);

    this.monitorURl = axiosConfig.baseURL;

    this.type = MediaType.Anime;
  }
  // crawl all page default: 1 -> end
  async scrapeAllAnimePages(): Promise<SourceAnime[]> {
    const data = await this.scrapeAllPages(this.scrapeAnimePage.bind(this));

    writeFile(`./data/${this.id}.json`, JSON.stringify(data, null, 2));

    return data;
  }

  // scrape anime by page 
  async scrapeAnimePages(numOfPages: number): Promise<SourceAnime[]> {
    const sourceAnime: SourceAnime[] = await this.scrapePages(
      this.scrapeAnimePage.bind(this),
      numOfPages,
    );

    return sourceAnime.filter((anime) => anime?.episodes?.length);
  }

  /**
 *Mapping source raw data to anilist id
 * @param sources sources of anime
 * @returns merged sources of anime
 */
  async mapSourceToAnilistId(sources?: SourceAnime[]): Promise<Anime[]> {
    const fullSources: Anime[] = []

    if (!sources) {
      sources = JSON.parse(readfile(`./data/${this.id}.json`));
    }
    if (!sources) throw new Error(`Source ${this.id} is not found in folder data`);

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async scrapeAnimePage(_page: number): Promise<SourceAnime[]> {
    throw new Error(`Method scrapeAnimePage not implemented`);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async scrapeAnime(_animeId: string): Promise<SourceAnime> {
    throw new Error('Method scrapeAnime not implemented');
  }
}
