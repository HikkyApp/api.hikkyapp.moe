import fs from 'fs';
import { handlePath } from '../utils';
import AnimeCrawl from '../core/AnimeCrawl';

export type ScraperId = string;

const readScrapers = (path: string) => {
  const scraperFiles = fs
    .readdirSync(handlePath(path))
    .filter((file) => file.endsWith('.js'))
    .map((file) => file.replace('.js', ''));

  const scrapers = {};

  for (const file of scraperFiles) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { default: Scraper } = require(handlePath(`${path}/${file}`));
    console.log(`Loading ${file} : ${handlePath(`${path}/${file}`)}`);
    scrapers[file] = new Scraper();
  }
  return scrapers;
};

const readClassScrapers = (path: string) => {
  const scraperFiles = fs
    .readdirSync(handlePath(path))
    .filter((file) => file.endsWith('.js'))
    .map((file) => file.replace('.js', ''));

  const scrapers = {};

  for (const file of scraperFiles) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { default: Scraper } = require(handlePath(`${path}/${file}`));

    scrapers[file] = Scraper;
  }

  return scrapers;
};

const animeScrapers: Record<ScraperId, AnimeCrawl> =
  readScrapers('./sources/anime');

const animeClassScrapers: Record<ScraperId, typeof AnimeCrawl> =
  readClassScrapers('./sources/anime');

export const getAnimeScraper = (id: ScraperId) => {
  if (!(id in animeScrapers)) {
    throw new Error(`Unknown scraper id: ${id}`);
  }

  return animeScrapers[id];
};

export const getScraper = (id: ScraperId) => {
  if (id in animeScrapers) {
    return getAnimeScraper(id);
  }
  throw new Error(`Unknown scraper id: ${id}`);
};

export default {
  anime: animeScrapers,
  animeClass: animeClassScrapers,
};
