const db = require('./Database');

module.exports = async (client) => {
  /*
  Permissions
  */
  client.permlevel = (message) => {
    let permlvl = 0;

    const permOrder = client.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.guild && currentLevel.guildOnly) {
        continue;
      }
      if (currentLevel.check(message)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  };

  client.getGuildSettings = async (guild) => {
    const def = await db.fetchSettings('default');
    if (!guild) {
      return def;
    }
    const returns = {};
    const overrides = await db.fetchSettings(guild.id);
    for (const key in def) {
      returns[key] = overrides[key] || def[key]
    }
    return returns;
  }

  /*
  Await Reply
  let response = await client.awaitReply(msg, "Username?");
  */
  client.awaitReply = async (msg, question, limit = 120000) => {
    const filter = m => m.author.id === msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ['time'] });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  };

  client.clean = async (client, text) => {
    if (text && text.constructor.name == 'Promise') {
      text = await text;
    }
    if (typeof evaled !== 'string') {
      text = require('util').inspect(text, { depth: 1 });
    }

    text = text
      .replace(/`/g, `\`${String.fromCharCode(8203)}`)
      .replace(/@/g, `@${String.fromCharCode(8203)}`)
      .replace(client.token, 'mfa.VkO_2G4Qv3T--NO--lWvtW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0');

    return text;
  };

  client.loadCommand = (commandName) => {
    try {
      const props = require(`../commands/${commandName}`);
      client.logger.log(`Loading Command ${props.help.name}`);
      if (props.init) {
        props.init(client);
      }
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach((alias) => {
        client.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return `Failed to load command ${commandName}: ${e}`;
    }
  };

  client.unloadCommand = async (commandName) => {
    let command;
    if (client.commands.has(commandName)) {
      command = client.commands.get(commandName);
    } else if (client.aliases.has(commandName)) {
      command = client.commands.get(client.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn't seem to exist.`;

    if (command.shutdown) {
      await command.shutdown(client);
    }
    delete require.cache[require.resolve(`../commands/${commandName}.js`)];
    return false;
  };

  /* Misc functions */

  String.prototype.toProperCase = function () {
    this.replace(
      /([^\W_]+[^\s-]*) */g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
    );
  }

  Array.prototype.random = () => this[Math.floor(Math.random() * this.length)];

  client.wait = require('util').promisify(setTimeout);

  process.on('uncaughtException', (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
    client.logger.error(`Uncaught Exception: ${errorMsg}`);
    process.exit(1);
  });

  process.on('unhandledRejection', (err) => {
    client.logger.error(`Unhandled rejection: ${err}`);
  });
};
