const Disc = require('discord.js');

exports.run = async (client, message, args, level) => {
  if (!args[0] || (parseInt(args[0]) && parseInt(args[0], 10) >= 1 && parseInt(args[0], 10) <= 50)) {
    if (args[1] === 'u') {
      level = 1;
    }

    const settings = await client.getGuildSettings(message.guild);
    let page = Math.ceil(parseInt(args[0], 10));

    if (!page) page = 1;

    let myCommands;
    if (!message.guild) {
      myCommands = client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level && cmd.conf.guildOnly !== true && cmd.conf.hidden !== true);
    } else if (settings.whitelistEnabled === 'true') {
      myCommands = client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level && cmd.conf.hidden !== true && settings.whitelistedCommands.split(',').includes(cmd.help.name));
    } else {
      myCommands = client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level && cmd.conf.hidden !== true);
    }

    if (myCommands.size === 0) return message.reply("You don't seem to be able to use any commands. ");
    if (Math.ceil(myCommands.array().length / 24) < page) {
      return;
    }

    // const commandNames = myCommands.keyArray()
    const emb = new Disc.MessageEmbed().setColor('#4677F4');

    myCommands.array().slice((page - 1) * 24, (page) * 24).forEach((c) => {
      emb.addField(`${c.help.name}`, `${c.help.description}\n`, true);
    });

    emb.setFooter(`Page ${page} of ${Math.ceil(myCommands.array().length / 24)} | Use ${settings.prefix}help [page] to view the next page`);

    message.channel.send(emb);
  } else {
    // individual command's help.
    let command = args[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      if (level < client.levelCache[command.conf.permLevel]) {
        return;
      }
      message.channel.send(`= ${command.help.name} = \n${command.help.description}\nusage:: ${command.help.usage}\naliases:: ${command.conf.aliases.join(', ')}\n= ${command.help.name} =`, { code: 'asciidoc' });
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['h'],
  permLevel: 'User',
};

exports.help = {
  name: 'help',
  category: 'System',
  description: 'Display command list',
  usage: 'help [command]',
};
