const Discord = require("discord.js");

exports.run = async (client, message, args, level) => {
  let bUser = message.guild.member(
    message.mentions.users.first() || message.guild.members.get(args[0])
  );
  if (!bUser)
    return message.channel.send(
      "**Usage** - ban [snowflake/mention]\nBan a server member. Use forceban to ban users not in the server."
    );
  if (bUser.id === message.guild.me.id) return message.channel.send("No...");
  let bReason = args.join(" ").slice(22);

  let banEmbed = new Discord.MessageEmbed()
    .setColor("#bc0000")
    .addField("Banned User", `${bUser}`)
    .addField("Banned by", `<@${message.author.id}>`)
    .setThumbnail(`${bUser.user.displayAvatarURL()}`)
    .setTimestamp(new Date());

  if (bReason) banEmbed.addField("Reason", bReason);

  message.channel.send(banEmbed);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator",
  hidden: true
};

exports.help = {
  name: "fakeban",
  category: "Moderation",
  description: "Ban users",
  usage: "fakeban @username reason"
};
