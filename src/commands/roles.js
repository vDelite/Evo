exports.run = async (client, message, args, level) => {
  let roles = message.guild.roles.sort((a, b) => b.position - a.position).map(r => `${r.id} - ${r.name}`)
  message.channel.send("```dns\n" + roles.join("\n") + "```")
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 'Moderator',
  hidden: false,
  cooldown: 1
}

exports.help = {
  name: 'roles',
  category: 'Miscelaneous',
  description: 'List roles',
  usage: 'roles'
}
