exports.run = async (client, message, args, level) => {
  if (!args || args.length < 1) return message.reply('Please provide a command to unload.');

  let response = await client.unloadCommand(args[0]);
  if (response) return message.reply(`Error Unloading: ${response}`);

  message.reply(`The command \`${args[0]}\` has been unloaded`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 'Bot Admin',
};

exports.help = {
  name: 'unload',
  category: 'System',
  description: 'Loads a command.',
  usage: 'load [command]',
};
