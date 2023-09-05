import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { RequireAtLeastOne } from '../utils/types';
import Monitor from './Monitor';

export default class CrawlBase {
    client: AxiosInstance;
    id: string;
    name: string;
    baseURL: string;
    blacklist: string[];
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




}