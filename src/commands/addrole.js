exports.run = async (client, message, args, level) => {
  const bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if (!bUser) return message.channel.send("Can't find that user");

  const role = message.guild.roles.find(r => r.name === args.slice(1).join(' '));
  if (!role) return message.reply('Unable to find that role');

  message.guild.member(bUser).roles.add(role);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['ar'],
  permLevel: 'Server Owner',
  hidden: false,
  requiredPermissions: ['MANAGE_ROLES'],
};

exports.help = {
  name: 'addrole',
  category: 'Moderation',
  description: 'Add role',
  usage: 'addrole @username role',
};
