const moment = require('moment');

module.exports = (client, member) => {
  const settings = client.getGuildSettings(member.guild)
  let log = member.guild.channels.find(c => c.name === settings.modLogChannel)
  if (log) log.send(`\`[${moment().format('HH:mm:ss')}]\` 📤 ${member.user.tag} (\`${member.id}\`) left`)
}
