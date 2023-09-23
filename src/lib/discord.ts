import { Client, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';

export const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.DISCORD_TOKEN);

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    }
});

export const getChannel = (id: string) => {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);

    return guild.channels.cache.get(id);
};
