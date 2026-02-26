const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
} = require('discord.js');

const config = require('../config');
const forms = require('../utils/forms');
const { sendLog } = require('../utils/logger');
const {
  createTicketChannel,
  closeTicket,
  reopenTicket,
  getTicketData,
  getTypeLabel,
} = require('../utils/ticketManager');

// ─── PANNEAU D'OUVERTURE DE TICKET ───────────────────────────────────────────

async function sendTicketPanel(channel) {
  const embed = new EmbedBuilder()
    .setTitle('AotSMP | Support')
    .setDescription(
      'Les tickets vous permettent de contacter l\'équipe AotSMP.\n' +
      '**N\'ouvrez un ticket que si vous en avez besoin, et évitez d\'en ouvrir plusieurs pour le même problème.**'
    )
    .setImage('https://i.postimg.cc/RV4SH3gW/Capture-d-ecran-2026-02-26-221204.png')
    .setColor(0x5865F2);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('open_ticket_recrutement').setLabel('Recrutement').setEmoji('📋').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('open_ticket_bug').setLabel('Bug').setEmoji('🐛').setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId('open_ticket_soutien').setLabel('Soutien').setEmoji('🆘').setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId('open_ticket_questions').setLabel('Questions').setEmoji('❓').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('open_ticket_autres').setLabel('Autres').setEmoji('📬').setStyle(ButtonStyle.Secondary),
  );

  await channel.send({ embeds: [embed], components: [row] });
}

// ─── HANDLER PRINCIPAL ───────────────────────────────────────────────────────

module.exports = {
  sendTicketPanel,

  async handleInteraction(interaction, client) {

    // ── BOUTON RECRUTEMENT → sous-menu ────────────────────────────────────────
    if (interaction.isButton() && interaction.customId === 'open_ticket_recrutement') {
      const embed = new EmbedBuilder()
        .setTitle('📋 Recrutement — Quel poste ?')
        .setDescription('Choisis le type de poste pour lequel tu souhaites postuler.')
        .setColor(0x5865F2);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('open_ticket_recrutement_dev').setLabel('Développeur').setEmoji('💻').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('open_ticket_recrutement_staff').setLabel('Staff').setEmoji('🛡️').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId('open_ticket_recrutement_autre').setLabel('Autre poste').setEmoji('📝').setStyle(ButtonStyle.Secondary),
      );

      return interaction.reply({ embeds: [embed], components: [row], ephemeral: 64 });
    }

    // ── TOUS LES AUTRES BOUTONS D'OUVERTURE → modal ───────────────────────────
    if (interaction.isButton() && interaction.customId.startsWith('open_ticket_')) {
      const type = interaction.customId.replace('open_ticket_', '');
      return openModal(interaction, type);
    }

    // ── SOUMISSION MODAL ──────────────────────────────────────────────────────
    if (interaction.isModalSubmit() && interaction.customId.startsWith('ticket_form_')) {
      const type = interaction.customId.replace('ticket_form_', '');
      return handleModalSubmit(interaction, type, client);
    }

    // ── BOUTON FERMER TICKET ──────────────────────────────────────────────────
    if (interaction.isButton() && interaction.customId === 'ticket_close') {
      return handleClose(interaction, client);
    }

    // ── BOUTON RÉOUVRIR ───────────────────────────────────────────────────────
    if (interaction.isButton() && interaction.customId === 'ticket_reopen') {
      return handleReopen(interaction, client);
    }

    // ── BOUTON SUPPRIMER ──────────────────────────────────────────────────────
    if (interaction.isButton() && interaction.customId === 'ticket_delete') {
      return handleDelete(interaction, client);
    }
  },
};

// ─── OUVRIR UN MODAL ─────────────────────────────────────────────────────────

async function openModal(interaction, type) {
  const formDef = forms[type];
  if (!formDef) return interaction.reply({ content: '❌ Type de ticket inconnu.', ephemeral: true });

  const modal = new ModalBuilder()
    .setCustomId(`ticket_form_${type}`)
    .setTitle(formDef.label.slice(0, 45));

  const rows = formDef.fields.slice(0, 5).map(field => {
    const input = new TextInputBuilder()
      .setCustomId(field.customId)
      .setLabel(field.label.slice(0, 45))
      .setStyle(field.style)
      .setRequired(field.required)
      .setMaxLength(field.maxLength || 1000);

    if (field.placeholder) input.setPlaceholder(field.placeholder.slice(0, 100));

    return new ActionRowBuilder().addComponents(input);
  });

  modal.addComponents(...rows);
  await interaction.showModal(modal);
}

// ─── TRAITEMENT SOUMISSION MODAL ─────────────────────────────────────────────

async function handleModalSubmit(interaction, type, client) {
  await interaction.deferReply({ ephemeral: true });

  const formDef = forms[type];
  const guild = interaction.guild;
  const user = interaction.user;

  let channel;
  try {
    channel = await createTicketChannel(guild, user, type);
  } catch (err) {
    console.error('Erreur création ticket:', err);
    return interaction.editReply({ content: '❌ Impossible de créer le ticket. Vérifie la config (.env) et les permissions du bot.' });
  }

  const embed = new EmbedBuilder()
    .setTitle(`${formDef.emoji} ${formDef.label}`)
    .setDescription(`Ticket ouvert par ${user}\nUtilise les boutons ci-dessous pour gérer ce ticket.`)
    .setColor(formDef.color)
    .setThumbnail(user.displayAvatarURL())
    .setTimestamp()
    .setFooter({ text: `ID: ${user.id} • Ticket créé le` });

  for (const field of formDef.fields) {
    const value = interaction.fields.getTextInputValue(field.customId) || '*Non renseigné*';
    embed.addFields({ name: field.label, value: value.slice(0, 1024), inline: false });
  }

  const closeRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('ticket_close')
      .setLabel('Fermer le ticket')
      .setEmoji('🔒')
      .setStyle(ButtonStyle.Danger),
  );

  const staffRole = guild.roles.cache.get(config.roles.staff);
  const mention = staffRole ? `<@&${config.roles.staff}>` : '@Staff';

  await channel.send({
    content: `${user} ${mention}\n> 🎫 Nouveau ticket — réponds dans ce salon !`,
    embeds: [embed],
    components: [closeRow],
  });

  await sendLog(client, { type: 'open', ticket: channel, user, category: getTypeLabel(type) });
  await interaction.editReply({ content: `✅ Ton ticket a été créé : <#${channel.id}>` });
}

// ─── FERMER UN TICKET ────────────────────────────────────────────────────────

async function handleClose(interaction, client) {
  const channel = interaction.channel;
  const user = interaction.user;
  const data = getTicketData(channel.id);

  if (!data && !channel.name.includes('-')) {
    return interaction.reply({ content: '❌ Ce salon n\'est pas un ticket géré par ce bot.', ephemeral: true });
  }

  await interaction.deferReply();

  try {
    await closeTicket(channel);
  } catch (err) {
    console.error(err);
    return interaction.editReply('❌ Erreur lors de la fermeture du ticket.');
  }

  const closedEmbed = new EmbedBuilder()
    .setTitle('🔒 Ticket Fermé')
    .setDescription(`Ce ticket a été fermé par ${user}.\n\nTu peux le **réouvrir** ou le **supprimer** ci-dessous.`)
    .setColor(0xED4245)
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('ticket_reopen').setLabel('Réouvrir').setEmoji('🔓').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('ticket_delete').setLabel('Supprimer').setEmoji('🗑️').setStyle(ButtonStyle.Danger),
  );

  await interaction.editReply({ embeds: [closedEmbed], components: [row] });
  await sendLog(client, { type: 'close', ticket: channel, user, category: data?.category || 'Inconnue' });
}

// ─── RÉOUVRIR UN TICKET ──────────────────────────────────────────────────────

async function handleReopen(interaction, client) {
  const channel = interaction.channel;
  const user = interaction.user;
  const data = getTicketData(channel.id);

  if (!isStaff(interaction.member)) {
    return interaction.reply({ content: '❌ Seul le staff peut réouvrir un ticket.', ephemeral: true });
  }

  await interaction.deferReply();

  try {
    await reopenTicket(channel);
  } catch (err) {
    console.error(err);
    return interaction.editReply('❌ Erreur lors de la réouverture.');
  }

  const embed = new EmbedBuilder()
    .setTitle('🔓 Ticket Réouvert')
    .setDescription(`Ce ticket a été réouvert par ${user}.`)
    .setColor(0x57F287)
    .setTimestamp();

  await interaction.editReply({ embeds: [embed] });
  await sendLog(client, { type: 'reopen', ticket: channel, user, category: data?.category || 'Inconnue' });
}

// ─── SUPPRIMER UN TICKET ─────────────────────────────────────────────────────

async function handleDelete(interaction, client) {
  const channel = interaction.channel;
  const user = interaction.user;
  const data = getTicketData(channel.id);

  if (!isStaff(interaction.member)) {
    return interaction.reply({ content: '❌ Seul le staff peut supprimer un ticket.', ephemeral: true });
  }

  await sendLog(client, { type: 'delete', ticket: channel, user, category: data?.category || 'Inconnue' });
  await interaction.reply({ content: '🗑️ Suppression dans 3 secondes...' });
  setTimeout(() => channel.delete().catch(console.error), 3000);
}

// ─── HELPER STAFF ────────────────────────────────────────────────────────────

function isStaff(member) {
  if (!config.roles.staff) return member.permissions.has('ManageChannels');
  return member.roles.cache.has(config.roles.staff) || member.permissions.has('Administrator');
}