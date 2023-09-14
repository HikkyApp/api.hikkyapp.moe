import fs from "fs";
import { handlePath } from "../utils";
import AnimeCrawl from "../core/AnimeCrawl";

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

        scrapers[file] = new Scraper();

    }
    return scrapers;
}

const animeScrapers: Record<ScraperId, AnimeCrawl> =
    readScrapers('./sources/anime');
// const mangaScrapers: Record<ScraperId, AnimeCrawl> =
//     readScrapers('./scrapers/manga');


export default {
    anime: animeScrapers,
    // manga: mangaScrapers,
};
