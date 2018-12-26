exports.run = async (client, message) => {
  const time = (new Date()).getTime();
  const msg = await message.channel.send('Ping?');
  msg.edit(`Pong! ${(new Date()).getTime() - time}ms.`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 'User',
  hidden: false,
  cooldown: 3,
};

exports.help = {
  name: 'ping',
  category: 'Miscelaneous',
  description: 'Ping!',
  usage: 'ping',
};
