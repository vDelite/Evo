const ColorThief = require('color-thief');

const colorThief = new ColorThief();
const onecolor = require('onecolor');

const request = require('request').defaults({ encoding: null });

const Discord = require('discord.js');

exports.run = async (client, message, args, level) => {
  const verification = ['0 - None', '1 - Low', '2 - Medium', '3 - High', '4 - Extreme'];
  const emotes = {
    online: client.emojis.get('479388565542010884'),
    offline: client.emojis.get('479388565516582912'),
    dnd: client.emojis.get('479388565449605120'),
    idle: client.emojis.get('479388565277638657'),
    bot: client.emojis.get('479376334133657601'),
    user: client.emojis.get('490296742022086676'),
  };

  const online = message.guild.members.filter(m => m.user.presence.status == 'dnd').size;
  const idle = message.guild.members.filter(m => m.user.presence.status == 'idle').size;
  const dnd = message.guild.members.filter(m => m.user.presence.status == 'dnd').size;
  const offline = message.guild.members.filter(m => m.user.presence.status == 'offline').size;

  try {
    const nonAnimatedEmojis = message.guild.emojis.filter(emoji => !emoji.animated)
    const guildEmojis = nonAnimatedEmojis.size > 0 ? nonAnimatedEmojis.size > 6 ? `${nonAnimatedEmojis.map(e => `<:${e.name}:${e.id}>`).splice(0, 6).join(' ')}\nand ${nonAnimatedEmojis.size - 6} more.` : nonAnimatedEmojis.map(e => `<:${e.name}:${e.id}>`).join(' ') : '-'

    request.get(message.guild.iconURL({ format: 'png' }), (error, response, body) => {
      if (!error && response.statusCode == 200) {
        var rgb = colorThief.getColor(body);
        var rgbCode = 'rgb( ' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
        var hex = onecolor(rgbCode).hex();
      } else {
        var hex = '#4677F4';
      }

      const guildEmbed = new Discord.MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setColor(hex)
        .addField('**ID**', message.guild.id, true)
        .addField('**Owner**', message.guild.owner.user.tag, true)
        .addField('**Region**', message.guild.region.toUpperCase(), true)
        .addField('**Members**', `${emotes.user} ${message.guild.members.filter(m => !m.user.bot).size}\n${emotes.bot} ${message.guild.members.filter(m => m.user.bot).size}`, true)
        .addField('**Roles**', message.guild.roles.size - 1, true)
        .addField('**Channels**', `${message.guild.channels.filter(channel => channel.type === 'text').size} text\n ${message.guild.channels.filter(channel => channel.type === 'voice').size} voice`, true)
        .addField('**2FA**', message.guild.mfaLevel ? 'Enabled' : 'Disabled', true)
        .addField('**Verification**', verification[message.guild.verificationLevel], true)
        .addField('**Notifications**', message.guild.defaultMessageNotifications.toProperCase(), true)
        .addField('**Created at**', message.guild.createdAt.toUTCString(), true)
        .addField('**Bot added at**', message.guild.me.joinedAt.toUTCString(), true)
      // .addField('**Server Features**', '', true)
      // .addField('**Statuses**', `${emotes.online} ${online}\n${emotes.idle} ${idle}\n${emotes.dnd} ${dnd}\n${emotes.offline} ${offline}`, true)
      // .addField('**Emoji**', guildEmojis, true)

      message.channel.send(guildEmbed);
    });
  } catch (e) {
    console.log(e);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 'User',
};

exports.help = {
  name: 'server',
  category: 'Miscelaneous',
  description: 'Display server info',
  usage: 'server',
};
