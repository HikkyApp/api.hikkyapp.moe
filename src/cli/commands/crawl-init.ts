import { Command } from 'commander';
import { select } from '@inquirer/prompts';
import sources from '../../sources';
import { getScraper } from '../../sources';
import AnimeCrawl from '../../core/AnimeCrawl';
import { readfile } from '../../utils';
import { SourceAnime } from '../../types/data';
import { insertData } from '../../core/Action';
import { animeActions } from '../../actions/anime';
export default function (program: Command) {
  return program
    .command('crawl:init')
    .description('Crawl Anime/Manga init')
    .action(async () => {
      try {
        const type = await select({
          message: 'What do you want to crawl?',
          choices: [
            { name: 'Anime', value: 'anime' },
            { name: 'Manga', value: 'manga' },
            { name: 'Comming Soon', value: 'cs' },
          ],
        });

        const allScrapers = type === 'anime' ? sources.anime : sources.anime;

        const id = await select({
          message: "What 's the ID you want to crawl",
          choices: Object.values(allScrapers).map((value) => ({
            name: value.name,
            value: value.id,
          })),
        });

        const scraper = getScraper(id);

        console.log('Pushing scraper info to database');

        await scraper.init();

        console.log(
          `Starting scraper source: ${id} - This action may take a few hour to complete`,
        );

        if (type === 'anime') {
          const scraperAnime = scraper as AnimeCrawl;

          const source = await readFileAndFallBack(`./data/${id}.json`, () =>
            scraperAnime.scrapeAllAnimePages(),
          );

          const sourceMapping = await readFileAndFallBack(
            `./data/${id}-full.json`,
            () => scraperAnime.mapSourceToAnilistId(source as SourceAnime[]),
          );

          await insertData(sourceMapping, animeActions, 'anilistId');
        }
      } catch (error) {
        program.error(error);
      }
    });
}

const readFileAndFallBack = <T>(
  path: string,
  FallBackFn?: () => Promise<T>,
) => {
  const fileData: T = JSON.parse(readfile(path));

  console.log(path, !!fileData);

  if (!fileData) return FallBackFn();

  return fileData;
};
