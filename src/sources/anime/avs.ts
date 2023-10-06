import { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';
import AnimeCrawl from '../../core/AnimeCrawl';
import { SourceAnime } from '../../types/data';
import { VideoServerType } from '../../core/VideoServer';
import { fulfilledPromises } from '../../utils';
import VideoContainer, { VideoContainerType } from '../../core/VideoContainer';
import Video from '../../core/Video';
import FileUrl from '../../core/FileUrl';
export default class AnimeVietsubScraper extends AnimeCrawl {
  baseUrl: string;
  client: AxiosInstance;

  constructor() {
    super('avs', 'AVS', { baseURL: 'https://animevietsub.fan' });

    this.locales = ['vi'];

    this.monitor.onRequest = async () => {
      const data = await fetch(
        `https://animevietsub.fan/anime-moi/trang-1.html`,
      );

      return data.text();
    };
  }

  shouldMonitorChange(oldPage: string, newPage: string): boolean {
    if (!oldPage || !newPage) return false;

    const selector = 'main .MovieList .TPostMv:first-child';

    const $old = cheerio.load(oldPage);
    const $new = cheerio.load(newPage);

    const oldTitle = $old(selector).find('h2.Title').text().trim();
    const newTitle = $new(selector).find('h2.Title').text().trim();

    return oldTitle !== newTitle;
  }
  async scrapeAnimePage(page: number) {
    const dataRaw = await fetch(`https://animevietsub.fan/anime-moi/trang-${page}.html`)

    const data = await dataRaw.text();

    const $ = cheerio.load(data);

    const list = await fulfilledPromises(
      $('.TPostMv')
        .toArray()
        .map(async (el) => {
          const source_id = urlToId($(el).find('a').attr('href'));
          console.log(`source_id : `, source_id);
          return await this.checkAnimeCountry(source_id);
        }),
    );

    return list.filter((a) => a);
  }
  async checkAnimeCountry(animeId: string) {
    const dataRaw = await fetch(
      `https://animevietsub.fan/phim/a-a${animeId}`,

    );
    const data = await dataRaw.text();

    const $ = cheerio.load(data);

    let country = '';
    // @ts-ignore
    $('ul.InfoList li').each(function () {
      if ($(this).text().startsWith('Quốc gia:')) {
        country = $(this).text().split(':')[1].trim();
      }
    });

    if (country.toLowerCase() === 'trung quốc') {
      console.log(`Skip anime ${animeId} because it's from China`);
      return;
    }

    return await this.scrapeAnime(animeId);
  }

  async scrapeAnime(animeId: string): Promise<SourceAnime> {
    const dataRaw = await fetch(
      `https://animevietsub.fan/phim/a-a${animeId}/xem-phim.html`,

    );
    const data = await dataRaw.text();

    const $ = cheerio.load(data);

    const title = $('header .Title').text().trim();

    const altTitles = this.parseTitle($('header .SubTitle').text().trim());

    const { titles } = this.filterTitles([title, ...altTitles]);

    const episodes = $('.episode a')
      .toArray()
      .map((episodeEl) => {
        const $el = $(episodeEl);
        const name = $el.attr('title');

        const sourceEpisodeId = $el.data('id').toString();

        if (!name || !sourceEpisodeId) return;

        return { name, sourceEpisodeId, sourceMediaId: animeId };
      })
      .filter((a) => a);
    return {
      titles,
      episodes,
      sourceId: this.id,
      sourceMediaId: animeId,
    };
  }

  async loadVideoServers(episodeId: string): Promise<VideoServerType[]> {
    const response = await fetch(
      `https://animevietsub.fan/ajax/player?v=2019a`,
      {
        body: `episodeId=${episodeId}&backup=1`,
        redirect: 'manual',
        method: 'post',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
      },
    );
    const data = await response.json();

    const $ = cheerio.load(data?.html);

    const servers: VideoServerType[] = $('a')
      .toArray()
      .filter((el) => $(el).data('play') === 'api')
      .map((el) => {
        const $el = $(el);

        const id = $el.data('id') as string;
        const hash = $el.data('href') as string;
        const name = $el.text().trim();

        return { name, extraData: { id, hash }, embed: '' };
      });

    return servers;
  }
  async loadVideoContainer(
    _: VideoServerType,
    extraData?: Record<string, string>,
  ): Promise<VideoContainerType> {
    const { id, hash } = extraData;

    const response = await fetch(
      `https://animevietsub.fan/ajax/player?v=2019a`,
      {
        body: `link=${hash}&id=${id}`,
        redirect: 'manual',
        method: 'post',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
      },
    );
    const data = await response.json();

    const sources: { file: string; label?: string; type: string }[] = data.link;

    return VideoContainer({
      videos: sources.map((source) =>
        Video({
          file: FileUrl({
            url: !source.file.includes('https')
              ? `https://${source.file}`
              : source.file,
          }),
          quality: source.label,
        }),
      ),
    });
  }

  async getServers(episodeId: number) {
    const { data } = await this.client.post(
      '/ajax/player?v=2019a',
      `episodeId=${episodeId}&backup=1`,
      { validateStatus: () => true, maxRedirects: 0 },
    );

    const $ = cheerio.load(data.html);

    const servers = $('a')
      .toArray()
      .filter((el) => $(el).data('play') === 'api')
      .map((el) => {
        const $el = $(el);

        const id = $el.data('id') as string;
        const hash = $el.data('href') as string;
        const name = $el.text().trim();

        return {
          id,
          hash,
          name,
        };
      });

    return servers;
  }
}

const urlToId = (url: string) => {
  const splitted = url.split('/').filter((a) => a);
  const lastSplit = splitted[splitted.length - 1];

  return lastSplit.split('-').slice(-1)[0].split('a')[1];
};
