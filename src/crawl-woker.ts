import { client, sendMessageStart } from './lib/discord';
import fetch from './services/fetch';
client.on('ready', (bot) => {
    console.log(`Bot ${bot.user.tag} is ready!`);
    sendMessageStart();
    fetch();
});

process.on('uncaughtException', (error) => {
    console.log(error);
});
