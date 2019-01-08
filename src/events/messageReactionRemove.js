const { MessageEmbed } = require('discord.js');
const db = require('../modules/Database');

module.exports = async (client, reaction, user) => {

  const settings = await db.fetchReactsToRoles(reaction.message.guild.id, reaction.message.id);
  if (settings.hasOwnProperty(reaction.message.id)) {
    const role = reaction.message.guild.roles.get(settings[reaction.message.id][reaction.emoji.id]);

    reaction.message.guild.members.fetch(user).then((member) => {
      if (member.roles.has(role)) {
        member.roles.remove(role).then(member => member.send(new MessageEmbed()
          .setColor('GREEN')
          .setTitle(`Removed your role ${role.name} in ${role.guild.name}`),
        )).catch(e => member.send(new MessageEmbed()
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
