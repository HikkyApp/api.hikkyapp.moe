import AnimeCrawl from '../core/AnimeCrawl';
import logger from '../logger';
import scrapers, { ScraperId } from '../sources';
import { scrapeNewAnime } from '../tasks/scrapeNewAnime';
// import { scrapeNewManga } from '../tasks/scrapeNewManga';
import { MediaType } from '../types/anilist';

type Scraper<T> = T extends MediaType.Anime ? AnimeCrawl : null;

const handleFetch = async<T extends MediaType>(
    type: T,
    scraper: Scraper<T>,
) => {
    console.log(`test`, scraper.id);
    if (type === MediaType.Anime) {
        await scrapeNewAnime(scraper.id as ScraperId);

    }
};

const handleRegisterMonitor = <T extends MediaType>(
    type: T,
    scraper: Scraper<T>,
) => {
    console.log('Registering monitor for scraper', scraper.id);
    scraper.monitor.run();
    scraper.monitor.onMonitorChange = () =>
        handleFetch(type, scraper).catch(logger.error);

};

export const handleFetchData = async <T extends MediaType>(type: T) => {
    const animeScrapers = scrapers.anime;
    // const mangaScrapers = scrapers.manga;

    let chosenScrapers;

    if (type === MediaType.Anime) {
        chosenScrapers = animeScrapers;
    }
    //  else {
    //     chosenScrapers = mangaScrapers;
    // }

    for (const scraperId in chosenScrapers) {
        const scraper = chosenScrapers[scraperId];

        await handleFetch(type, scraper as Scraper<T>);
    }
};

export default async () => {
    const animeScrapers = scrapers.anime;

    for (const scraperId in animeScrapers) {
        const scraper = animeScrapers[scraperId];

        handleRegisterMonitor(MediaType.Anime, scraper);
    }

};
