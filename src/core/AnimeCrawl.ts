import CrawlBase from "./CrawlBase";
import { MediaType } from '../types/anilist';
import { RequireAtLeastOne } from "../utils/types";
import { SourceAnime } from "../types/data";
import { writeFile } from '../utils/index';
import { AxiosRequestConfig } from 'axios';

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async scrapeAnimePage(_page: number): Promise<SourceAnime[]> {
        throw new Error(`Method scrapeAnimePage not implemented`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async scrapeAnime(_animeId: string): Promise<SourceAnime> {
        throw new Error('Method scrapeAnime not implemented');
    }

}