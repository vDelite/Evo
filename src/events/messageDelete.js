const moment = require('moment');

module.exports = (client, message) => {
  if (message.author.bot || !message.guild) return

  const settings = message.settings = client.getGuildSettings(message.guild)
  if (message.content.startsWith(settings.prefix)) return

  let log = message.guild.channels.find(c => c.name === settings.modLogChannel)
  if (log) log.send(`\`[${moment().format('HH:mm:ss')}]\` 🗑 ${message.author.tag} (\`${message.author.id}\`) message deleted in **#${message.channel.name}**:\n${message.cleanContent.substring(0, 1800)}`)

}
