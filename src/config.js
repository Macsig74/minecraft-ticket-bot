require('dotenv').config();

module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,

  categories: {
    recrutement: process.env.CATEGORY_RECRUTEMENT,
    bug: process.env.CATEGORY_BUG,
    soutien: process.env.CATEGORY_SOUTIEN,
    questions: process.env.CATEGORY_QUESTIONS,
    autres: process.env.CATEGORY_AUTRES,
    fermes: process.env.CATEGORY_FERMES,
    candidatures: process.env.CATEGORY_CANDIDATURES,
    attente: process.env.CATEGORY_ATTENTE,
  },

  channels: {
    logs: process.env.CHANNEL_LOGS,
    onARetenu: process.env.CHANNEL_ON_A_RETENU,
    openTicket: process.env.CHANNEL_OPEN_TICKET,
  },

  roles: {
    staff: process.env.ROLE_STAFF,
  },

 
  colors: {
    recrutementDev: 0x5865F2,   // Bleu Discord
    recrutementStaff: 0x57F287,  // Vert
    recrutementAutre: 0xFEE75C,  // Jaune
    bug: 0xED4245,               // Rouge
    soutien: 0xEB459E,           // Rose
    questions: 0x00B0F4,         // Bleu clair
    autres: 0x99AAB5,            // Gris
    log: 0x2B2D31,               // Sombre
    success: 0x57F287,
    danger: 0xED4245,
    warning: 0xFEE75C,
    later: 0xFEE75C,
    candid: 0x57F287,
  },

  
  emojis: {
    recrutement: '📋',
    bug: '🐛',
    soutien: '🆘',
    questions: '❓',
    autres: '📬',
    close: '🔒',
    reopen: '🔓',
    delete: '🗑️',
    save: '💾',
    later: '⏳',
    log: '📋',
  },
};
