const Discord = require('discord.js');
const request = require('snekfetch');

exports.run = async (client, message, args, level) => {
  try {
    request.get('https://aws.random.cat/meow').then((res) => {
      const embed = new Discord.MessageEmbed()
        .setImage(res.body.file)
        .setColor('#4374f4');
      return message.channel.send({ embed });
    });
  } catch (err) {
    return console.log(err.stack);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 'User',
};

exports.help = {
  name: 'cat',
  category: 'Miscelaneous',
  description: 'cat',
  usage: 'cat',
};
