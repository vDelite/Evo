const fetch = require('node-fetch');
const { onlyEmoji } = require('emoji-aware');

const slowmode = new Map();

module.exports = (message) => {
  if (message.mentions.users.first() && !message.author.bot) {
    let entry = slowmode.get(message.author.id);
    if (!entry) {
      entry = 0;
      slowmode.set(message.author.id, entry);
    }

    entry += message.mentions.users.size + message.mentions.roles.size;
    slowmode.set(message.author.id, entry);

    if (entry > 9) {
      message.member.ban(1);
      slowmode.delete(message.author.id);
    } else {
      setTimeout(() => {
        entry = slowmode.get(message.author.id);
        entry -= (message.mentions.users.size + message.mentions.roles.size);
        slowmode.set(message.author.id, entry);
        if (entry <= 0) slowmode.delete(message.author.id);
      }, 7500);
    }
  }

  if (message.content.includes('discord.gg/') || message.content.includes('discordapp.com/invite/')) message.delete();

  if (onlyEmoji(message.content).length + (message.content.match(/<:[a-zA-Z0-9_-]+:[0-9]{18}>/g) ? message.content.match(/<:[a-zA-Z0-9_-]+:[0-9]{18}>/g).length : 0) >= 6) message.delete();
};
