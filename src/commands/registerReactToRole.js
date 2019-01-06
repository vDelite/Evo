var db = require('../modules/Database');

exports.run = async (client, message, args) => {
  var s = {};
  for (let i = 1; i < args.length; i += 2) {
    s[args[i]] = args[i + 1];
  }
  message.channel.send("Success");
  db.saveReactToRole(message.guild.id, args[0], JSON.stringify(s));
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
  name: 'registerReactToRole',
  category: 'Miscelaneous',
  description: '',
  usage: 'registerReactToRole messageId ...params[roleName, reactId]',
};
