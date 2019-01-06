const Discord = require('discord.js')
const request = require('snekfetch')

exports.run = async (client, message, args, level) => {
  try {
    request.get('https://dog.ceo/api/breeds/image/random').then(res => {
      const embed = new Discord.MessageEmbed()
        .setImage(res.body.message)
      return message.channel.send({ embed })
    })
  } catch (err) {
    return false
  }
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 'User',
  requiredPermissions: ['EMBED_LINKS']
}

exports.help = {
  name: 'dog',
  category: 'Miscelaneous',
  description: 'dog',
  usage: 'dog'
}
