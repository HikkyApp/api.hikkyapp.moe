import { Command } from 'commander';
import { select } from '@inquirer/prompts';
import sources from '../../sources';
import { getScraper } from '../../sources';
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

        console.log(type, id);
      } catch (error) {
        console.log(error);
        program.error(error);
      }
    });
}
