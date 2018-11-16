const Disco = require('discord.js');
const moment = require('moment');
require('moment-duration-format');
const status = {
  online: '<:online:479388565542010884> Online',
  idle: '<:idle:479388565277638657> Idle',
  dnd: '<:dnd:479388565449605120> Do Not Disturb',
  offline: '<:offline:479388565516582912> Offline/Invisible',
};

const ColorThief = require('color-thief');

const colorThief = new ColorThief()
const onecolor = require('onecolor');
const request = require('request').defaults({ encoding: null });

exports.run = async (client, message, args, level) => {
  const member = message.mentions.members.first()
    || message.guild.members.get(args[0])
    || (args[0] && message.guild.members.filter(m => m.nickname === args[0]).first())
    || (args[0] && message.guild.members.filter(m => m.user.username === args[0]).first())
    || (args[0] && message.guild.members.filter(m => m.user.tag === args[0]).first())
    || message.member;

  let bot;
  if (member.user.bot === true) {
    bot = 'Yes';
  } else {
    bot = 'No';
  }

  request.get(member.user.displayAvatarURL({ format: 'png' }), (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const rgb = colorThief.getColor(body);
      const rgbCode = `rgb( ${rgb[0]},${rgb[1]},${rgb[2]})`;
      var hex = onecolor(rgbCode).hex();
    } else {
      var hex = '#4677F4';
    };

    const embed = new Disco.MessageEmbed()
      .setColor(hex)
      .setThumbnail(`${member.user.displayAvatarURL()}`)
      .setAuthor(`${member.user.tag}`, `${member.user.displayAvatarURL()}`)
      .addField('Nickname', `${member.nickname !== null ? `${member.nickname}` : 'No nickname'}`, true)
      .addField('Bot?', `${bot}`, true)
      .addField('ID', `${member.id}`, true)
      .addField('Status', `${status[member.user.presence.status]}`, true)
      .addField('Playing', `${member.user.presence.game ? `${member.user.presence.game.name}` : 'not playing anything.'}`, true)
      .addField('Roles', `${member.roles.filter(r => r.id !== message.guild.id).map(roles => `\`${roles.name}\``).join(' **|** ') || 'No Roles'}`, true)
      .addField('Joined At', `${moment.utc(member.joinedAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true)
      .addField('Created At', `${moment.utc(member.user.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true);

    message.channel.send({
      embed,
    });
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['prof', 'userinfo'],
  permLevel: 'User',
};

exports.help = {
  name: 'profile',
  category: 'System',
  description: 'Get user info',
  usage: 'profile [user]',
};
