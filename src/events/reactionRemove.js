const { MessageEmbed } = require('discord.js');
const db = require('../modules/Database');

module.exports = async (client, message, reaction, user) => {
  const settings = await db.fetchReactsToRoles(message.guild.id, message.id);

  if (!settings) return;
  if (settings.hasOwnProperty(reaction)) {
    const role = message.guild.roles.find(role => role.name === settings[reaction]);

    if (role === undefined) return;

    message.guild.members.fetch(user).then((member) => {
      if (member.roles.find(r => r.id === role.id)) {
        member.roles.remove(role).then(member => member.send(new MessageEmbed()
          .setColor('GREEN')
          .setTitle(`Removed your role ${role.name} in ${role.guild.name}`)))
          .catch(e => member.send(new MessageEmbed()
            .setColor('RED')
            .setTitle(`Could not remove role ${role.name} in ${role.guild.name}. Please contact the moderators`),
          ));
      } else {
        return member.send(new MessageEmbed()
          .setColor('RED')
          .setTitle(`You already do not have the ${role.name} role in ${role.guild.name}`),
        );
      }
    });
  }
};
