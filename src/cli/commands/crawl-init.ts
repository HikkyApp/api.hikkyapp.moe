import { Command } from 'commander';
export default function (program: Command) {
    return program
        .command('crawl:init')
        .description('Crawl Anime/Manga init')
        .action(() => {
            try {
                console.log('Crawl init');



            }
            catch (error) {
                console.log(error);
                program.error(error);
            }
        });
}
