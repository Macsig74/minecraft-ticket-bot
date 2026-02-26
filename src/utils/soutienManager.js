const { sendRconCommand } = require('./rcon');

const TARGET_STATUS = process.env.SOUTIEN_STATUS_TEXT || 'discord.gg/aotsmp';

function hasTargetStatus(member) {
  const activities = member.presence?.activities || [];
  return activities.some(activity =>
    activity.type === 4 &&
    activity.state?.toLowerCase().includes(TARGET_STATUS.toLowerCase())
  );
}

async function giveSoutien(member, pseudo) {
  if (process.env.ROLE_SOUTIEN) {
    await member.roles.add(process.env.ROLE_SOUTIEN);
  }
  if (pseudo) {
    const cmd = (process.env.RCON_GIVE_CMD || 'lp user {pseudo} parent add soutien').replace('{pseudo}', pseudo);
    await sendRconCommand(cmd);
  }
}

module.exports = { hasTargetStatus, giveSoutien };