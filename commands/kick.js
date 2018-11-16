const Discord = require('discord.js');

exports.run = async (client, message, args, level) => {
  const bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if (!bUser) return message.channel.send("Can't find that user");
  const bReason = args.join(' ').slice(50);
  if (message.guild.ownerID !== message.author.id && bUser.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) {
    return message.channel.send("Can't kick that person!");
  }

  const kickEmbed = new Discord.MessageEmbed()
    .setColor('#4677F4')
    .addField('Kicked User', `${bUser}`)
    .addField('Kicked by', `<@${message.author.id}>`)
    .setThumbnail(`${bUser.user.displayAvatarURL()}`)
    .setTimestamp(new Date());

  if (bReason) kickEmbed.addField('Reason', bReason);

  message.guild.member(bUser).kick(bReason);
  message.channel.send(kickEmbed).catch((e) => { });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'Moderator',
  requiredPermissions: ['KICK_MEMBERS'],
};

exports.help = {
  name: 'kick',
  category: 'Moderation',
  description: 'Kick users',
  usage: 'kick @username reason',
};
