import { client, sendMessageStart } from './lib/discord';

client.on('ready', (bot) => {
    console.log(`Bot ${bot.user.tag} is ready!`);
    sendMessageStart();

});

process.on('uncaughtException', (error) => {
    console.log(error);
});
