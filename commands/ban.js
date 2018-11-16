const Discord = require('discord.js');

exports.run = async (client, message, args, level) => {
  const bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if (!bUser) return message.channel.send('**Usage** - ban [snowflake/mention]\nBan a server member. Use forceban to ban users not in the server.');
  if (bUser.id === message.guild.me.id) return message.channel.send('No...');
  if (message.guild.ownerID !== message.author.id && bUser.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) return message.channel.send("You can't ban that person.");
  if (!bUser.bannable) return message.channel.send('Unable to ban this member. Do they have a higher role than mine?');

  const bReason = args.join(' ').slice(35);

  const banEmbed = new Discord.MessageEmbed()
    .setColor('#bc0000')
    .addField('Banned User', `${bUser}`)
    .addField('Banned by', `<@${message.author.id}>`)
    .setThumbnail(`${bUser.user.displayAvatarURL()}`)
    .setTimestamp(new Date());

  if (bReason) {
    banEmbed.addField('Reason', bReason);
  }

  message.guild.member(bUser).ban(bReason);
  message.channel.send(banEmbed).catch((e) => { });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'Moderator',
  requiredPermissions: ['BAN_MEMBERS'],
};

exports.help = {
  name: 'ban',
  category: 'Moderation',
  description: 'Ban users',
  usage: 'ban @username reason',
};
