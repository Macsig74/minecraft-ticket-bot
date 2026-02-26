const { PermissionFlagsBits, ChannelType } = require('discord.js');
const config = require('../config');


const ticketData = new Map();


function getCategoryId(type) {
  const map = {
    recrutement_dev: config.categories.recrutement,
    recrutement_staff: config.categories.recrutement,
    recrutement_autre: config.categories.recrutement,
    bug: config.categories.bug,
    soutien: config.categories.soutien,
    questions: config.categories.questions,
    autres: config.categories.autres,
  };
  return map[type] || config.categories.autres;
}


function getTypeLabel(type) {
  const labels = {
    recrutement_dev: 'Recrutement — Dev',
    recrutement_staff: 'Recrutement — Staff',
    recrutement_autre: 'Recrutement — Autre',
    bug: 'Bug',
    soutien: 'Soutien',
    questions: 'Questions',
    autres: 'Autres',
  };
  return labels[type] || type;
}


async function createTicketChannel(guild, user, type) {
  const categoryId = getCategoryId(type);
  const ticketNumber = Date.now().toString().slice(-5);
  const prefix = type.replace('recrutement_', 'rc-').replace('_', '-');
  const channelName = `${prefix}-${user.username.toLowerCase().replace(/[^a-z0-9]/g, '')}-${ticketNumber}`;

  const staffRole = guild.roles.cache.get(config.roles.staff);

  const permissionOverwrites = [
    {
      id: guild.id, // @everyone
      deny: [PermissionFlagsBits.ViewChannel],
    },
    {
      id: user.id,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.AttachFiles,
      ],
    },
  ];

  if (staffRole) {
    permissionOverwrites.push({
      id: staffRole.id,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.ManageMessages,
        PermissionFlagsBits.AttachFiles,
      ],
    });
  }

  const channel = await guild.channels.create({
    name: channelName,
    type: ChannelType.GuildText,
    parent: categoryId,
    permissionOverwrites,
    topic: `Ticket de ${user.tag ?? user.username} | Type: ${getTypeLabel(type)} | ID: ${user.id}`,
  });

 
  ticketData.set(channel.id, {
    type,
    userId: user.id,
    category: getTypeLabel(type),
    createdAt: new Date(),
    status: 'open',
  });

  return channel;
}


async function closeTicket(channel) {
  await channel.setParent(config.categories.fermes, { lockPermissions: false });
  // Retirer les perms du créateur
  const data = ticketData.get(channel.id);
  if (data) {
    data.status = 'closed';
    await channel.permissionOverwrites.edit(data.userId, {
      ViewChannel: false,
    }).catch(() => {});
  }
}


async function reopenTicket(channel) {
  const data = ticketData.get(channel.id);
  const targetCategory = data ? getCategoryId(data.type) : config.categories.autres;

  await channel.setParent(targetCategory, { lockPermissions: false });

  if (data) {
    data.status = 'open';
    await channel.permissionOverwrites.edit(data.userId, {
      ViewChannel: true,
      SendMessages: true,
      ReadMessageHistory: true,
      AttachFiles: true,
    }).catch(() => {});
  }
}


async function saveCandidature(channel) {
  await channel.setParent(config.categories.candidatures, { lockPermissions: false });
  const data = ticketData.get(channel.id);
  if (data) data.status = 'saved';
}


async function laterTicket(channel) {
  await channel.setParent(config.categories.attente, { lockPermissions: false });
  const data = ticketData.get(channel.id);
  if (data) data.status = 'waiting';
}


function getTicketData(channelId) {
  return ticketData.get(channelId);
}


function isTicket(channelId) {
  return ticketData.has(channelId);
}

module.exports = {
  createTicketChannel,
  closeTicket,
  reopenTicket,
  saveCandidature,
  laterTicket,
  getTicketData,
  getTypeLabel,
  isTicket,
};
