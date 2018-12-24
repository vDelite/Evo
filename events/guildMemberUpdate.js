var Discord = require('discord.js')

module.exports = (client, oldMember, newMember) => {
  // dehoist nicknames
  if (oldMember.nickname !== newMember.nickname) {
    if (newMember.nickname && ['!', '.', ',', '-', '_', '*', '\\', '^', '+', '<', '>'].some(n => newMember.nickname.startsWith(n))) { newMember.setNickname(newMember.nickname.replace(/^([!.,*_\-^+\\<> ])+/, '')) }
  }
}
