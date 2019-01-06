var ColorThief = require('color-thief')
var colorThief = new ColorThief()
var onecolor = require('onecolor')
var request = require('request').defaults({ encoding: null })
var Discord = require('discord.js')

exports.run = async (client, message, args, level) => {
  const emotes = { 'online': client.emojis.get('479388565542010884'), 'offline': client.emojis.get('479388565516582912'), 'dnd': client.emojis.get('479388565449605120'), 'idle': client.emojis.get('479388565277638657') }

  var online = message.guild.members.filter(m => m.user.presence.status == 'online').size
  var idle = message.guild.members.filter(m => m.user.presence.status == 'idle').size
  var dnd = message.guild.members.filter(m => m.user.presence.status == 'dnd').size
  var offline = message.guild.members.filter(m => m.user.presence.status == 'offline').size

  try {
    request.get(message.guild.iconURL({ format: 'png' }), function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var rgb = colorThief.getColor(body)
        var rgbCode = 'rgb( ' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')'
        var hex = onecolor(rgbCode).hex()
      } else var hex = '#4677F4'

      let guildEmbed = new Discord.MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setColor(hex)
        .setDescription(`${emotes.online} ${online}\n${emotes.idle} ${idle}\n${emotes.dnd} ${dnd}\n${emotes.offline} ${offline}`)

      message.channel.send(guildEmbed)
    })
  } catch (e) {
    console.log(e)
  }
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 'User'
}

exports.help = {
  name: 'status',
  category: 'Miscelaneous',
  description: 'Display server info',
  usage: 'server'
}
