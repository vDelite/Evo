var Discord = require('discord.js')

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const id = args[0]
  message.channel.messages.fetch({ limit: 1, around: id })
    .then(messages => {
      const msg = messages.first()
      if (!msg) return message.channel.send("Unknown message!")

      let quote = new Discord.MessageEmbed()
        .setAuthor(msg.author.username, msg.author.avatarURL())
        .setDescription(`[Jump to message](${msg.url})\n\nmsg.content`)
        .setTimestamp(msg.createdAt)
        .setFooter(`#${msg.channel.name}`)
      message.channel.send(quote)
    })

}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['q'],
  permLevel: 'User',
  requiredPermissions: ['EMBED_LINKS']
}

exports.help = {
  name: 'quote',
  category: 'Misc',
  description: 'Quote a message',
  usage: 'quote [message id]'
}

function clean(text) {
  if (typeof (text) === 'string') {
    return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
  } else {
    return text
  }
}
