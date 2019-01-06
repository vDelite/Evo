exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (!args[0]) return
  let channel = client.channels.get(args[0])
  if (!channel) return message.reply("Invalid channel ID")
  channel.send(args.slice(1).join(' '))
  message.react('✅')
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 'Bot Owner',
  hidden: true
}

exports.help = {
  name: 'send',
  category: 'Miscelaneous',
  description: 'Send a message to a channel',
  usage: 'send <channel id> <message>'
}
