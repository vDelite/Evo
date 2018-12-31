const moment = require('moment');

module.exports = (client, oldMessage, newMessage) => {
  if (oldMessage.author.bot || !oldMessage.guild) return
  if (oldMessage.content === newMessage.content) return

  const settings = oldMessage.settings = client.getGuildSettings(oldMessage.guild)
  let log = oldMessage.guild.channels.find(c => c.name === settings.modLogChannel)
  if (log) log.send(`\`[${moment().format('HH:mm:ss')}]\` 📝 ${oldMessage.author.tag} (\`${oldMessage.author.id}\`) message edited in **#${oldMessage.channel.name}**:\n**1**: ${oldMessage.cleanContent.substring(0, 900)}\n**2**: ${newMessage.cleanContent.substring(0, 900)}`)
}
