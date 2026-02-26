require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Events, ActivityType } = require('discord.js');
const config = require('./config');
const { handleInteraction } = require('./events/interactionCreate');
const handleCommand = require('./commands/handler');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
  ],
  partials: [Partials.Channel, Partials.Message],
});

client.once(Events.ClientReady, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log(`║  ✅  Bot connecté : ${client.user.tag.padEnd(21)}║`);
  console.log('║  🎫  Système de tickets Minecraft        ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('');

  client.user.setPresence({
    activities: [{ name: '🎫 Tickets ', type: ActivityType.Watching }],
    status: 'online',
  });
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      return await handleCommand(interaction, client);
    }
    return await handleInteraction(interaction, client);
  } catch (error) {
    console.error('❌ Erreur interaction :', error);
    const errorMsg = { content: '❌ Une erreur est survenue. Contacte un administrateur.', ephemeral: true };
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp(errorMsg).catch(() => {});
    } else {
      await interaction.reply(errorMsg).catch(() => {});
    }
  }
});

process.on('unhandledRejection', (error) => console.error('❌ Unhandled rejection :', error));
process.on('uncaughtException', (error) => console.error('❌ Uncaught exception :', error));

client.login(config.token).catch(err => {
  console.error('❌ Impossible de se connecter :', err.message);
  process.exit(1);
});