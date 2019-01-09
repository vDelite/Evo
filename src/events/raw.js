const events = {
  MESSAGE_REACTION_ADD: 'reactionAdd',
  MESSAGE_REACTION_REMOVE: 'reactionRemove',
};

module.exports = async (client, event) => {
  if (!events.hasOwnProperty(event.t)) return;

  const { d: data } = event;
  const user = client.users.get(data.user_id);
  const channel = client.channels.get(data.channel_id) || await user.createDM();
  const message = await channel.messages.fetch(data.message_id);
  const emojiKey = data.emoji.id ? data.emoji.id : data.emoji.name;

  client.emit(events[event.t], message, emojiKey, user);
};
