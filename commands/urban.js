const urban = require('relevant-urban');
const Disc = require('discord.js');
const embeds = require('../modules/embeds.js');

exports.run = async (client, message, args, level) => {
  if (!args[0]) return message.channel.send(embeds.warn.setDescription('Please specify some text!'))

  let res = await urban(args.join(' ')).catch(e => message.channel.send(embeds.warn.setDescription('Sorry, I wasn\'t able to find that word!')));

  embeds.success
    .setTitle(res.word)
    .setDescription(`**Definition:**\n${res.definition}\n\n**Example:**\n*${res.example}*`);

  if (res.definition) return message.channel.send(embeds.success);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['ud'],
  permLevel: 'User',
};

exports.help = {
  name: 'urban',
  category: 'Miscelaneous',
  description: 'Search Urban Dictionary',
  usage: 'urban [term]',
};
