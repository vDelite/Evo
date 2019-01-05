const moment = require('moment');

module.exports = async (client, member) => {
  const settings = await client.getGuildSettings(member.guild);
  const log = member.guild.channels.find(c => c.name === settings.modLogChannel);
  if (log) log.send(`\`[${moment().format('HH:mm:ss')}]\` 📥 ${member.user.tag} (\`${member.id}\`) joined`).catch(e => console.log(e.message));

  if (settings.welcomeEnabled !== 'true') return;

  const welcomeMessage = settings.welcomeMessage.replace(`{{user}}', '<@'${member.user.id}'>`);
  member.guild.channels.find(c => c.name === settings.welcomeChannel)
    .send(welcomeMessage).catch(console.error);
};
