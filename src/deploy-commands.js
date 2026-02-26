require('dotenv').config();
const { REST, Routes } = require('discord.js');
const commands = require('./commands/index');

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('🔄 Déploiement des commandes slash...');

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands },
    );

    console.log('✅ Commandes déployées avec succès !');
    console.log('📋 Commandes enregistrées :');
    commands.forEach(cmd => console.log(`   /${cmd.name} — ${cmd.description}`));
  } catch (error) {
    console.error('❌ Erreur lors du déploiement :', error);
  }
})();