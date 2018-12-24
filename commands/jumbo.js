const discord = require('discord.js')
const twemoji = require('twemoji')

exports.run = async (client, message, args) => {
  try {
    const emote = discord.Util.parseEmoji(args[0])
    if (emote.animated === true) {
      const URL = `https://cdn.discordapp.com/emojis/${emote.id}.gif`
      await message.channel.send({ files: [{ attachment: URL, name: 'emote.gif' }] })
    } else if (emote.id === null) {
      const twemote = twemoji.parse(args[0])
      const regex = /src="(.+)"/g
      const regTwemote = regex.exec(twemote)[1]
      await message.channel.send({ files: [{ attachment: regTwemote, name: 'emote.png' }] })
    } else {
      const URL = `https://cdn.discordapp.com/emojis/${emote.id}.png`
      await message.channel.send({ files: [{ attachment: URL, name: 'emote.png' }] })
    }
  } catch (error) {
    if (error.message.includes('Cannot read property') {
      message.channel.send('Provide an emote to jumbo.')
    }
  }
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'User'
}

exports.help = {
  name: 'jumbo',
  category: 'Fun',
  description: 'Jumbo emoji',
  usage: 'jumbo [emoji]'
}
