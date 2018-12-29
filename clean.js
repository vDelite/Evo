exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  let embed = {
    'title': 'Usage',
    'description': 'Purge messages from the channel.\n\n',
    'color': 6658247,
    'fields': [{
      'name': 'purge [n]',
      'value': 'Clean the last n messages '
    }, {
      'name': 'purge @user {n}',
      'value': 'Clean the last n messages sent by the user, or 100 if not specified'
    }, {
      'name': 'purge bots {n}',
      'value': 'Clean the last n messages sent by bots, or 100 if not specified'
    }, {
      'name': 'purge match hey',
      'value': "Clean messages that contain 'hey'"
    }, {
      'name': 'purge mentions {n}',
      'value': 'Clean messages containing mentions'
    }, {
      'name': 'purge reactions {n}',
      'value': 'Clean all reactions from messages'
    }]
  }

  var deleteCount, fetched
  var user = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]))

  if (user) {
    fetched = await message.channel.messages.fetch({ limit: 100 })
    deleteCount = 99
    if ((args[1] && !isNaN(args[1]))) deleteCount = parseInt(args[1], 10)

    fetched = fetched.array().filter(m => m.author.id === user.id).slice(0, deleteCount)
  } else if (!isNaN(args[0])) {
    deleteCount = parseInt(args[0], 10) + 1
    if (deleteCount > 100) return message.channel.send('You can only delete a maximum of 99 messages at a time.')
    fetched = await message.channel.messages.fetch({ limit: deleteCount })
    fetched = fetched.array().filter(m => m.pinned === false)

  } else if (args[0] === 'bots') {
    fetched = await message.channel.messages.fetch({ limit: 100 })
    if (args[1] && !isNaN(args[1])) deleteCount = parseInt(args[1], 10) + 1
    else deleteCount = 99

    if (deleteCount > 99) return message.channel.send('You can only delete a maximum of 99 messages at a time.')

    fetched = await message.channel.messages.fetch({ limit: 100 })
    fetched = fetched.array().filter(m => m.author.bot === true).slice(0, deleteCount)
  } else if (args[0] === 'match') {
    fetched = await message.channel.messages.fetch({ limit: 100 })
    deleteCount = 99
    if (!args[1]) return message.channel.send('You must specify a string to match!')

    fetched = fetched.array().filter(m => m.content.toLowerCase().includes(args.slice(1).join(' ').toLowerCase())).slice(1, 100)
  } else if (args[0] === 'mentions') {
    fetched = await message.channel.messages.fetch({ limit: 99 })
    deleteCount = 99
    if (args[1] && !isNaN(args[1])) deleteCount = parseInt(args[1], 10)
    if (deleteCount > 100) return message.channel.send('You can only delete a maximum of 99 messages at a time.')

    fetched = fetched.array().filter(m => (m.mentions.users.size + m.mentions.roles.size) > 0).slice(0, deleteCount)
  } else if (args[0] === 'reactions') {
    fetched = await message.channel.messages.fetch({ limit: 50 })
    deleteCount = 50
    if (args[1] && !isNaN(args[1])) deleteCount = parseInt(args[1], 10)
    if (deleteCount > 50) return message.channel.send('Invalid amount of messages to clean reactions from (must be 50X or less).')

    fetched = fetched.array().filter(m => m.reactions.size > 0).slice(0, deleteCount)
    message.channel.send(`✅ Cleaning reactions from ${fetched.length} messages`)
    return fetched.forEach(m => m.reactions.removeAll().catch(e => { }))
  } else {
    return message.channel.send({ embed })
  }

  if (deleteCount < 2 || deleteCount > 100) return message.channel.send('You can only delete a maximum of 99 messages at a time.')
  if (fetched.length === 0) return

  if (!fetched.includes(message)) fetched.push(message)
  message.channel.bulkDelete(fetched, { filterOld: true })
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['purge', 'clear', 'prune'],
  permLevel: 'Moderator',
  requiredPermissions: ['MANAGE_MESSAGES']
}

exports.help = {
  name: 'clean',
  category: 'Moderation',
  description: 'Delete messages.',
  usage: 'clean <count>'
}
