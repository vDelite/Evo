module.exports.run = async (client, message, args) => {
  const member = message.mentions.members.first()
    || message.guild.members.get(args[0])
    || message.guild.members.filter(m => m.nickname === args.join(' ')).first()
    || message.guild.members.filter(m => m.user.username === args.join(' ')).first()
    || message.guild.members.filter(m => m.user.tag === args.join(' ')).first()
    || message.member;

  await message.channel.send({
    files: [
      {
        attachment: member.user.displayAvatarURL({ size: 512 }),
        name: member.user.displayAvatarURL().endsWith('.gif')
          ? 'avatar.gif'
          : 'avatar.png',
      },
    ],
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 'User',
  hidden: false,
  cooldown: 15,
};

exports.help = {
  name: 'avatar',
  category: 'Miscelaneous',
  description: 'Get user avatar',
  usage: 'avatar',
};
