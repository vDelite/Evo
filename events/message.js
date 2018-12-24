var automod = require('../modules/filter.js')

let cooldown = {}

module.exports = (client, message) => {

  if (message.author.bot) return
  if (message.guild && !message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return

  ////////// Guild settings and automod checks //////////
  const settings = message.settings = client.getGuildSettings(message.guild)
  if (settings.enableAutomod === 'true') automod(message)

  //////////////// String/Mention prefix ////////////////
  const mentionPrefix = new RegExp(`^<@!?${client.user.id}> `)
  const mention = new RegExp(`^<@!?${client.user.id}>`)
  if (message.content.match(mentionPrefix) && message.content.match(mentionPrefix)[0]) {
    var args = message.content.replace(mentionPrefix, '').split(/ +/g);
    if (!message.content.match(mention)[1]) message.mentions.users.delete(client.user.id)
  }
  else if (message.content.indexOf(settings.prefix) === 0) var args = message.content.substring(settings.prefix.length).split(/ +/g);
  else return

  ////////////////// Command handling ////////////////// 
  const command = args.shift().toLowerCase();
  const level = client.permlevel(message)

  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
  if (!cmd) return

  if (cmd && !message.guild && cmd.conf.guildOnly) { return message.channel.send('This command is not available via PMs.') }

  if (level < client.levelCache[cmd.conf.permLevel]) {
    if (settings.systemNotice === 'true') message.channel.send(`You don't have permission to use this.`)
    return
  }

  if (command !== 'set' && settings.whitelistEnabled === 'true' && !settings.whitelistedCommands.split(',').includes(command)) {
    if (settings.systemNotice === 'true') message.channel.send('This command is not enabled in this guild.')
    return
  }

  if (cmd.conf.requiredPermissions && !cmd.conf.requiredPermissions.every(r => message.guild.me.hasPermission(r))) return message.channel.send(`I need the following permissions to run this command:\n${cmd.conf.requiredPermissions.map(p => ' - ' + p.replace('_', ' ').toProperCase()).join('\n')}`)

  //////////////// Cooldowns ////////////////
  let delay = cmd.conf.cooldown ? cmd.conf.cooldown * 1000 : 300

  if (cooldown[message.author.id] && cooldown[message.author.id][command]) {
    if (cooldown[message.author.id][command] && !cooldown[message.author.id][command]['prompted']) {
      cooldown[message.author.id][command]['prompted'] = true;
      let remaining = (delay - (new Date() - cooldown[message.author.id][command]['timestamp'])) / 1000;
      message.channel.send(`This command is currently on cooldown! Please try again in ${remaining.toFixed(1)}s.`);
    }
    return false;
  }

  if (!cooldown[message.author.id]) cooldown[message.author.id] = {};
  cooldown[message.author.id][command] = {};
  cooldown[message.author.id][command]['timestamp'] = new Date();
  cooldown[message.author.id][command]['prompted'] = false;

  setTimeout(function () {
    delete cooldown[message.author.id][command];
    if (Object.keys(cooldown[message.author.id]).length === 0)
      delete cooldown[message.author.id]
  }, delay);

  ///////////////// Utils /////////////////
  message.author.permLevel = level

  message.flags = []
  while (args[0] && args[0][0] === '-') {
    message.flags.push(args.shift().slice(1))
  }

  client.logger.cmd(message.guild ? `\x1b[0m[\x1b[36m${message.guild.id}\x1b[0m][\x1b[33m#${message.channel.id}\x1b[0m][\x1b[35m@${message.author.id}\x1b[0m] ` + `${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} ran command ${cmd.help.name}` : `[@${message.author.id}] ` + `${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} ran command ${cmd.help.name}`)
  cmd.run(client, message, args, level)
}
