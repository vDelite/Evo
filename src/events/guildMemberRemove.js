const moment = require('moment');

module.exports = async (client, member) => {
  const settings = await client.getGuildSettings(member.guild);
  const log = member.guild.channels.find(c => c.name === settings.modLogChannel);
  if (log) log.send(`\`[${moment().format('HH:mm:ss')}]\` 📤 ${member.user.tag} (\`${member.id}\`) left`);
};
