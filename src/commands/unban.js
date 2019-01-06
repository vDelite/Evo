exports.run = async (client, message, args, level) => {
  var bUser = args[0]
  if (!bUser) return message.channel.send('Please specify a user ID to unban')
  try {
    var bProf = await client.users.fetch(bUser)
  } catch (e) {
    console.log(e)
    return message.channel.send("Can't find that user")
  }

  var bans = await message.guild.fetchBans()
  if (!bans.keyArray().includes(args[0])) return message.channel.send("This user isn't banned")

  message.guild.members.unban(bUser)
  message.channel.send(':white_check_mark: Unbanned ' + bProf.username + '.')
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'Moderator'
}

exports.help = {
  name: 'unban',
  category: 'Moderation',
  description: 'Unban a user',
  usage: 'unban <id>'
}
