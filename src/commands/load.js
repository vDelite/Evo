exports.run = async (client, message, args, level) => {
  if (!args || args.length < 1) {
    return message.reply('Must provide a command to reload. Derp.');
  }

  const response = client.loadCommand(args[0]);
  if (response) {
    return message.reply(`Error Loading: ${response}`);
  }

  message.reply(`The command \`${args[0]}\` has been loaded`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 'Bot Admin',
};

exports.help = {
  name: 'load',
  category: 'System',
  description: 'Loads a command.',
  usage: 'load [command]',
};
