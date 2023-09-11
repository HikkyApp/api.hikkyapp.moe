import CrawlBase from "./CrawlBase";
import { MediaType } from '../types/anilist';
import { RequireAtLeastOne } from "../utils/types";
import { SourceAnime } from "../types/data"
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

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


        return data

    }

    async scrapeAnimePage(_page: number): Promise<SourceAnime[]> {

        throw new Error(`Method scrapeAnimePage not implemented`);

    }





}