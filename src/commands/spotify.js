
const Discord = require('discord.js')

exports.run = (client, message, args) => {
  let user = message.mentions.users.first() || message.author

  if (user.presence.activity !== null && user.presence.activity.type === 'LISTENING' && user.presence.activity.name === 'Spotify' && user.presence.activity.assets !== null) { // This checks all of these if statements, and if they are all true, it runs the following.
    let trackIMG = `https://i.scdn.co/image/${user.presence.activity.assets.largeImage.slice(8)}`
    let trackURL = `https://open.spotify.com/track/${user.presence.activity.syncID}`
    let trackName = user.presence.activity.details
    let trackAuthor = user.presence.activity.state
    let trackAlbum = user.presence.activity.assets.largeText

    const embed = new Discord.MessageEmbed()
      .setAuthor('Spotify Track Info', 'https://cdn.discordapp.com/emojis/408668371039682560.png')
      .setColor(0x1ED760)
      .setThumbnail(trackIMG)
      .addField('Song Name', trackName, true)
      .addField('Album', trackAlbum, true)
      .addField('Artist', trackAuthor, false)
      .addField('Listen to Track:', `[${trackURL}](trackURL)`, false)

    message.channel.send(embed)
  } else {
    message.channel.send('**This user isn\'t currently listening to Spotify!**')
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
  name: 'spotify',
  category: 'Misc',
  description: 'Spotify track info',
  usage: 'spotify <user>'
}
