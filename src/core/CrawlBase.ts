import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { RequireAtLeastOne } from '../utils/types';
import { SourceAnime, SourceManga } from '../types/data';
import { isHTML, isValidUrl, isVietnamese } from '../utils';
import { match, Path } from 'node-match-path';
import Monitor from './Monitor';
import { errorLogger } from 'axios-logger';
import logger from '../logger';
import axiosRetry from 'axios-retry';
import supabase from '../lib/supabase';

export default class CrawlBase {
  client: AxiosInstance;
  id: string;
  name: string;
  baseURL: string;
  blacklistTitles: string[];
  blacklistCountry: string[];
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
    };
    this.id = id;
    this.name = name;
    this.blacklistTitles = ['live action'];
    this.blacklistCountry = ['china', 'Trung Quốc'];
    this.scrapingPages = 2;
    this.client = axios.create(config);
    this.baseURL = axiosConfig.baseURL;

    const defaultMonitor = async () => {
      const data = await this.client.get('/');

      return data;
    };

    // axios retry try to retrieve data again if it fails
    axiosRetry(this.client, { retries: 3 });

    this.monitor = new Monitor(
      defaultMonitor,
      this.shouldMonitorChange.bind(this),
    );

    const axiosErrorLogger = (error: AxiosError) => {
      return errorLogger(error, {
        logger: logger.error.bind(logger),
        data: !isHTML(error?.response?.data),
      });
    };

    this.client.interceptors.request.use((config) => config, axiosErrorLogger);
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
      if (result?.length === 0) {
        break;
      }

      list.push(result);
    }

    return this.removeBlacklistSources(list.flat());
  }

  /**
   * Run this method to push scraper's info to Supabase
   */
  async init() {
    return supabase.from('sources').upsert(
      [
        {
          id: this.id,
          name: this.name,
          locales: this.locales,
        },
      ],
      { ignoreDuplicates: true },
    );
  }

  protected async scrapeAllPages(scrapeFn: (page: number) => Promise<any>) {
    const list = [];
    let isEnd = false;
    let page = 1;

    while (!isEnd) {
      try {
        const result = await scrapeFn(page).catch((err) =>
          logger.error('error', err),
        );

        if (page === 165) {
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

  protected async removeBlacklistSources<T extends SourceAnime | SourceManga>(
    sources: T[],
  ) {
    return sources.filter(
      (source) =>
        source?.titles.some((title) => !this.blacklistTitles.includes(title)),
    );
  }

  async removeBlacklistCountrySources<T extends SourceAnime>(sources: T[]) {
    return sources.filter(
      (source) =>
        source?.titles.some((title) => !this.blacklistCountry.includes(title)),
    );
  }
  /**
   *
   * @param titles an array of titles
   * @returns titles that are not Vietnamese and a Vietnamese title
   */
  protected filterTitles(titles: string[]) {
    const totalTitles = [...new Set(titles)].filter(
      (title) => !this.blacklistTitles.includes(title.toLowerCase()),
    );

    const vietnameseTitle = totalTitles.filter(isVietnamese)[0] || null;
    const nonVietnameseTitles = totalTitles.filter(
      (title) => !isVietnamese(title),
    );

    return {
      titles: nonVietnameseTitles,
      vietnameseTitle,
    };
  }

  /**
   * Separate the title in case the title has multiple titles (e.g. "One Piece | Vua Hải Tặc")
   * @param title string
   * @param separators an array of separators
   * @returns an array of titles
   */
  parseTitle(title: string, separators = ['|', ',', ';', '-', '/']) {
    const separator = separators.find((separator) => title.includes(separator));

    const regex = new RegExp(`\\${separator}\\s+`);

    return title
      .split(regex)
      .map((title) => title.trim())
      .filter((title) => title);
  }

  /**
   *
   * @param path pattern of the parser (e.g. /anime/:id)
   * @param url the url or path (e.g. /anime/23)
   * @returns object with the matched params (e.g. { id: 23 })
   */
  protected parseString(path: Path, url: string) {
    if (isValidUrl(url)) {
      url = new URL(url).pathname;
    }

    return match(path, url).params;
  }
}
