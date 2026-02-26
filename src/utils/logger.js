const { EmbedBuilder } = require('discord.js');
const config = require('../config');

/**
 * Envoie un log dans le salon #logs
 * @param {Client} client
 * @param {Object} options
 */
async function sendLog(client, options) {
  const {
    type,       
    ticket,     
    user,      
    category,   
    extra,      
  } = options;

  const logsChannel = client.channels.cache.get(config.channels.logs);
  if (!logsChannel) return;

  const colors = {
    open: 0x57F287,
    close: 0xED4245,
    reopen: 0xFEE75C,
    delete: 0x99AAB5,
    save_candid: 0x5865F2,
    later: 0xFEE75C,
  };

  const titles = {
    open: '🎫 Ticket Ouvert',
    close: '🔒 Ticket Fermé',
    reopen: '🔓 Ticket Réouvert',
    delete: '🗑️ Ticket Supprimé',
    save_candid: '💾 Candidature Retenue',
    later: '⏳ Ticket Mis en Attente',
  };

  const embed = new EmbedBuilder()
    .setTitle(titles[type] || '📋 Log Ticket')
    .setColor(colors[type] || 0x2B2D31)
    .addFields(
      { name: '👤 Utilisateur', value: `${user} (${user.tag ?? user.username})`, inline: true },
      { name: '📂 Catégorie', value: category || 'Inconnue', inline: true },
      { name: '🎫 Salon', value: ticket ? `<#${ticket.id}> (\`${ticket.name}\`)` : 'Supprimé', inline: false },
    )
    .setTimestamp()
    .setFooter({ text: `ID utilisateur: ${user.id}` });

  if (extra) {
    embed.addFields({ name: '📝 Détails', value: extra, inline: false });
  }

  await logsChannel.send({ embeds: [embed] }).catch(console.error);
}

module.exports = { sendLog };
