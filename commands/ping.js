exports.run = async (client, message, args, level) => {
  const msg = await message.channel.send('Ping?');
  msg.edit(`Pong! ${Math.round(client.ping)}ms.`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 'User',
  hidden: false,
};

exports.help = {
  name: 'ping',
  category: 'Miscelaneous',
  description: 'Ping!',
  usage: 'ping',
};
