const { SlashCommandBuilder } = require('discord.js');

module.exports = [
  new SlashCommandBuilder()
    .setName('close')
    .setDescription(' Ferme ce ticket et le déplace dans la catégorie "Fermés"')
    .toJSON(),

  new SlashCommandBuilder()
    .setName('save-candid')
    .setDescription(' Déplace la candidature dans la catégorie "Candidatures retenues"')
    .toJSON(),

  new SlashCommandBuilder()
    .setName('later')
    .setDescription(' Met ce ticket en attente et poste un rappel dans #on-a-retenu')
    .toJSON(),

  new SlashCommandBuilder()
    .setName('setup-tickets')
    .setDescription(' [ADMIN] Envoie le panneau d\'ouverture de ticket dans ce salon')
    .toJSON(),

  new SlashCommandBuilder()
    .setName('givesoutien')
    .setDescription('Réclame le rôle Soutien si discord.gg/aotsmp est dans ton statut Discord')
    .addStringOption(opt =>
      opt
        .setName('pseudo')
        .setDescription('Ton pseudo Minecraft exact (respecte les majuscules)')
        .setRequired(true)
        .setMaxLength(16)
    )
    .toJSON(),
];