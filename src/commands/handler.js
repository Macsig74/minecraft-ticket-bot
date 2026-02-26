const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config');
const { sendLog } = require('../utils/logger');
const { sendTicketPanel } = require('../events/interactionCreate');
const {
  closeTicket,
  saveCandidature,
  laterTicket,
  getTicketData,
} = require('../utils/ticketManager');
const { hasTargetStatus, giveSoutien } = require('../utils/soutienManager');

function isStaff(member) {
  if (!config.roles.staff) return member.permissions.has('ManageChannels');
  return member.roles.cache.has(config.roles.staff) || member.permissions.has('Administrator');
}

module.exports = async function handleCommand(interaction, client) {
  const { commandName, channel, member, user, guild } = interaction;

  //  /close 
  if (commandName === 'close') {
    if (!isStaff(member)) {
      return interaction.reply({ content: '❌ Tu n\'as pas la permission de fermer ce ticket.', ephemeral: true });
    }

    const data = getTicketData(channel.id);
    if (!data) {
      return interaction.reply({ content: '❌ Ce salon n\'est pas un ticket géré par ce bot.', ephemeral: true });
    }

    await interaction.deferReply();

    try {
      await closeTicket(channel);
    } catch (err) {
      console.error(err);
      return interaction.editReply('❌ Erreur lors de la fermeture.');
    }

    const embed = new EmbedBuilder()
      .setTitle('🔒 Ticket Fermé')
      .setDescription(`Ce ticket a été fermé par ${user}.\n\nTu peux le **réouvrir** ou le **supprimer** ci-dessous.`)
      .setColor(0xED4245)
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('ticket_reopen').setLabel('Réouvrir').setEmoji('🔓').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('ticket_delete').setLabel('Supprimer').setEmoji('🗑️').setStyle(ButtonStyle.Danger),
    );

    await interaction.editReply({ embeds: [embed], components: [row] });

    await sendLog(client, {
      type: 'close',
      ticket: channel,
      user,
      category: data?.category || 'Inconnue',
    });
  }

  //  /save-candid 
  if (commandName === 'save-candid') {
    if (!isStaff(member)) {
      return interaction.reply({ content: '❌ Tu n\'as pas la permission d\'utiliser cette commande.', ephemeral: true });
    }

    const data = getTicketData(channel.id);
    if (!data || !data.category.toLowerCase().includes('recrutement')) {
      return interaction.reply({ content: '❌ Ce salon n\'est pas un ticket de recrutement.', ephemeral: true });
    }

    await interaction.deferReply();

    try {
      await saveCandidature(channel);
    } catch (err) {
      console.error(err);
      return interaction.editReply('❌ Erreur lors du déplacement de la candidature.');
    }

    const embed = new EmbedBuilder()
      .setTitle('💾 Candidature Retenue')
      .setDescription(`Cette candidature a été marquée comme **retenue** par ${user}.`)
      .setColor(0x5865F2)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });

    await sendLog(client, { type: 'save_candid', ticket: channel, user, category: data.category });
  }

  //  /later 
  if (commandName === 'later') {
    if (!isStaff(member)) {
      return interaction.reply({ content: '❌ Tu n\'as pas la permission d\'utiliser cette commande.', ephemeral: true });
    }

    const data = getTicketData(channel.id);
    if (!data) {
      return interaction.reply({ content: '❌ Ce salon n\'est pas un ticket géré par ce bot.', ephemeral: true });
    }

    await interaction.deferReply();

    try {
      await laterTicket(channel);
    } catch (err) {
      console.error(err);
      return interaction.editReply('❌ Erreur lors de la mise en attente.');
    }

    const onARetenуChannel = client.channels.cache.get(config.channels.onARetenu);
    if (onARetenуChannel) {
      const reminderEmbed = new EmbedBuilder()
        .setTitle('⏳ Ticket mis en attente')
        .setDescription(`Un ticket a été mis en attente par ${user}.`)
        .setColor(0xFEE75C)
        .addFields(
          { name: '📂 Catégorie', value: data.category, inline: true },
          { name: '🎫 Lien', value: `<#${channel.id}>`, inline: true },
          { name: '📋 Salon', value: `\`${channel.name}\``, inline: true },
        )
        .setTimestamp()
        .setFooter({ text: 'Pense à traiter ce ticket dès que possible !' });

      await onARetenуChannel.send({ embeds: [reminderEmbed] });
    }

    const confirmEmbed = new EmbedBuilder()
      .setTitle('⏳ Ticket en Attente')
      .setDescription(`Ce ticket a été mis en attente par ${user}.\nUn rappel a été posté dans <#${config.channels.onARetenu}>.`)
      .setColor(0xFEE75C)
      .setTimestamp();

    await interaction.editReply({ embeds: [confirmEmbed] });

    await sendLog(client, { type: 'later', ticket: channel, user, category: data.category });
  }

  //  /setup-tickets 
  if (commandName === 'setup-tickets') {
    if (!member.permissions.has('Administrator')) {
      return interaction.reply({ content: '❌ Seuls les administrateurs peuvent utiliser cette commande.', ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });

    try {
      await sendTicketPanel(channel);
      await interaction.editReply('✅ Panneau de tickets envoyé !');
    } catch (err) {
      console.error(err);
      await interaction.editReply('❌ Erreur lors de l\'envoi du panneau.');
    }
  }

  //  /givesoutien 
  if (commandName === 'givesoutien') {
    await interaction.deferReply({ ephemeral: true });

    const pseudo = interaction.options.getString('pseudo');

    if (!hasTargetStatus(member)) {
      const target = process.env.SOUTIEN_STATUS_TEXT || 'discord.gg/aotsmp';
      const embed = new EmbedBuilder()
        .setTitle('❌ Statut introuvable')
        .setDescription(
          `Pour obtenir le rôle Soutien, tu dois mettre **\`${target}\`** dans ton statut personnalisé Discord.\n\n` +
          '**Comment faire ?**\n' +
          '1. Clique sur ton avatar en bas à gauche\n' +
          '2. Clique sur **"Définir un statut personnalisé"**\n' +
          `3. Écris \`${target}\`\n` +
          '4. Reviens utiliser `/givesoutien`\n\n' +
          '*Le statut doit être **actif** au moment de la commande.*'
        )
        .setColor(0xED4245)
        .setTimestamp();

      return interaction.editReply({ embeds: [embed] });
    }

    try {
      await giveSoutien(member, pseudo);
    } catch (err) {
      console.error('Erreur giveSoutien:', err);
      return interaction.editReply(`❌ Erreur : ${err.message}`);
    }

    const embed = new EmbedBuilder()
      .setTitle('✅ Rôle Soutien attribué !')
      .setDescription(`Merci pour ton soutien ! 🎉\nLe rôle **Soutien** t'a été donné sur Discord et in-game pour **\`${pseudo}\`**.`)
      .setColor(0x57F287)
      .addFields(
        { name: '🎮 Pseudo Minecraft', value: `\`${pseudo}\``, inline: true },
        { name: '📢 Statut vérifié', value: '✅ Présent', inline: true },
      )
      .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
  }
};