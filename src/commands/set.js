const { inspect } = require('util');
const Discord = require('discord.js');

const db = require('../modules/Database');

exports.run = async (client, message, [action, key, ...value], level) => {
  const settings = message.settings;
  const overrides = await client.settings.get(message.guild.id);

  if (action === 'edit') {
    if (!key) return message.reply('Please specify a key to edit the value of');
    if (!settings[key]) return message.reply('This key does not exist in the settings!');
    if (value.length < 1) return message.reply('Please specify a new value');
    if (value.join(' ') === settings[key]) return message.reply('This setting already has that value!');

    // If the guild does not have any overrides, initialize it
    if (!client.settings.has(message.guild.id)) client.settings.set(message.guild.id, {});

    const saved = await db.saveSettings(message.guild.id, key, value);

    message.reply(`${key} successfully edited to ${value.join(' ')}`);
  } else if (action === 'get') {
    if (!key) return message.reply('Please specify a key to view');
    if (!settings[key]) return message.reply('This key does not exist in the settings');
    const isDefault = !overrides[key] ? '\nThis is the default global default value.' : '';
    message.reply(`The value of ${key} is currently ${settings[key]}${isDefault}`);
  } else {
    const embed = new Discord.MessageEmbed()
      .setColor('#DD8D0C')
      .setTitle('Settings')
      .addField('Prefix', inspect(settings.prefix), true)
      .addField('Admin Role', inspect(settings.adminRole), true)
      .addField('Moderator Role', inspect(settings.modRole), true)
      .addField('System Replies', inspect(settings.systemNotice), true)
      .addField('Welcome Channel', inspect(settings.welcomeChannel), true)
      .addField('Welcome Enabled', inspect(settings.welcomeEnabled), true)
      .addField('Command Whitelist', inspect(settings.whitelistEnabled), true)
      .addField('Welcome Message', inspect(settings.welcomeMessage))
      .addField('Whitelisted Commands', inspect(settings.whitelistedCommands))
      .setFooter("Use 'set edit' to edit the settings");

    message.channel.send({ embed });
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['setting', 'settings', 'conf'],
  permLevel: 'Administrator',
  requiredPermissions: ['EMBED_LINKS'],
};

exports.help = {
  name: 'set',
  category: 'System',
  description: 'View and edit settings',
  usage: 'set <view/get/edit> <key> <value>',
};
