const discord = require('discord.js');

const db = require('../modules/Database');

exports.run = async (client, message, args) => {
  const s = {};

  for (let i = 1; i < args.length; i += 2) {
    const emote = discord.Util.parseEmoji(args[i + 1]);
    if (emote.id === null) message.reply('Default emotes are not supported.');
    s[emote.id] = args[i];
  }

  db.saveReactToRole(message.guild.id, args[0], s);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['rtr'],
  permLevel: 'Moderator',
  hidden: false,
  cooldown: 1,
};

exports.help = {
  name: 'registerreacttorole',
  category: 'Miscelaneous',
  description: '',
  usage: 'registerReactToRole messageId ...params[roleName, reactId]',
};
