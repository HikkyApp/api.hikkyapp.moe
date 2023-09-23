import { client } from './lib/discord';

client.on('ready', (bot) => {
    console.log(`Bot ${bot.user.tag} is ready!`);

});
process.on('uncaughtException', (error) => {
    console.log(error);
});
