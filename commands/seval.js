const Discord = require('discord.js')

exports.run = (client, message, args, level) => {
  const code = args.join(' ');
  try {
    eval(code);
  } catch (err) {
  }
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 'Bot Owner',
};

exports.help = {
  name: 'seval',
  category: 'System',
  description: 'Silently evaluates javascript',
  usage: 'seval [...code]',
};
