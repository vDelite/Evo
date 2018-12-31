const Discord = require('discord.js')

exports.run = async (client, message, args, level) => {
  let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]))
  if (!bUser) return message.channel.send("Can't find that user")
  let bReason = args.join(' ').slice(22)
  if (bUser.roles.highest.comparePositionTo(message.member.roles.highest) >= 0 && message.member !== message.guild.owner && level < 7) return message.channel.send("Can't mute that person!")

  let muteEmbed = new Discord.MessageEmbed()
    .setColor('#bc0000')
    .addField('Muted User', `${bUser}`)
    .addField('Muted by', `<@${message.author.id}>`)
    .setThumbnail(`${bUser.user.displayAvatarURL()}`)
    .setTimestamp(new Date())

  if (bReason) muteEmbed.addField('Reason', bReason)

  let muterole = message.guild.roles.find(r => r.name === 'Muted')
  if (!muterole) {
    try {
      muterole = await message.guild.roles.create()
      await muterole.edit({ name: 'Muted', color: '#333333' })
      message.guild.channels.forEach(async channel => {
        await channel.createOverwrite(
          muterole.id, {
            'SEND_MESSAGES': false,
            'ADD_REACTIONS': false
          }
        )
      })
    } catch (e) {
      console.log(e.stack)
    }
  }

  if (muterole && message.guild.me.hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) {
    bUser.roles.add(muterole)
    message.channel.send(muteEmbed)
  }
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'Moderator',
  hidden: false,
  requiredPermissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES']
}

exports.help = {
  name: 'mute',
  category: 'Moderation',
  description: 'Mute a user',
  usage: 'mute <@username|snowflake> [reason]'
}
