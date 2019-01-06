exports.run = async (client, message, args) => {
  await message.channel.send(message.content.substr(4));
  message.delete();
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 'Bot owner',
  hidden: false,
  cooldown: 1,
};

exports.help = {
  name: 'say',
  category: 'Miscelaneous',
  description: 'Bot performs action of saying to chat',
  usage: 'say',
};
