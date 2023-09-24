import { Client, GatewayIntentBits } from 'discord.js';
import { TextChannel } from 'discord.js';
import 'dotenv/config';

export const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.DISCORD_TOKEN);

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'start') {
    await interaction.reply('Server crawling started!');
  }
});

// discord bot send message to channel
export const sendMessageStart = async (
  channelId: string = process.env.DISCORD_UPDATE_CHANNEL_ID,
) => {
  const channel = getChannel(channelId) as TextChannel;

  if (!channel) return;

  await channel.send('Server crawling started!');
};

export const getChannel = (id: string) => {
  const guild = client.guilds.cache.get(process.env.DISCORD_GUILD_ID);

  return guild.channels.cache.get(id);
};
