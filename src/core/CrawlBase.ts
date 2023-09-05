import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { RequireAtLeastOne } from '../utils/types';
import Monitor from './Monitor';

export default class CrawlBase {
    client: AxiosInstance;
    id: string;
    name: string;
    baseURL: string;
    blacklistTitles: string[];
    monitor: Monitor;
    locales: string[];
    scrapingPages: number;

    constructor(
        id: string,
        name: string,
        axiosConfig: RequireAtLeastOne<AxiosRequestConfig, 'baseURL'>,
    ) {

        const config = {
            headers: {
                referer: axiosConfig.baseURL,
                origin: axiosConfig.baseURL,
            },
            timeout: 20000,
            ...axiosConfig,
        }

        this.client = axios.create(config);
        this.baseURL = axiosConfig.baseURL;

        const defaultMonitor = async () => {
            const data = await this.client.get('/');

            return data;
        }


        this.monitor = new Monitor(
            defaultMonitor,
            this.shouldMonitorChange.bind(this),

        );


    }

    shouldMonitorChange(_oldPage: any, _newPage: any): boolean {
        return false;
    }

    protected async scrapePages(
        scrapeFn: (page: number) => Promise<any>,
        numOfPages: number,
    ) {
        const list = [];

        for (let page = 1; page <= numOfPages; page++) {
            const result = await scrapeFn(page);
            console.log(`Scraped page ${page} [${this.id}]`);

            // @ts-ignore
            if (result?.length === 0) {
                break;
            }

            list.push(result);
        }

        return this.removeBlacklistSources(list.flat());
    }

    protected async scrapeAllPages(scrapeFn: (page: number) => Promise<any>) {
        const list = [];
        let isEnd = false;
        let page = 1;

        while (!isEnd) {
            try {
                const result = await scrapeFn(page).catch((err) =>
                    console.log(err),
                );

                if (page === 5) {
                    isEnd = true;

                    break;
                }

                console.log(`Scraped page ${page} - ${this.id}`);

                if (result.length === 0) {
                    isEnd = true;

                    break;
                }

                page++;

                list.push(result);
            } catch (err) {
                isEnd = true;
            }
        }

        return this.removeBlacklistSources(list.flat());
    }

    protected async removeBlacklistSources<T extends any | any>(
        sources: T[],
    ) {
        return sources.filter((source: any) =>
            source?.titles.some((title) => !this.blacklistTitles.includes(title)),
        );
    }


}