import { Command } from "commander";


export default function (program: Command) {

    return program
        .command('crawl:init')
        .description('Crawl Anime/Manga init')
        .action(() => {
            console.log("Crawl init");
        });
};