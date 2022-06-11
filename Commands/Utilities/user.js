const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "user",
  description: "Returns the targets info about their membership.",
  options: [
    {
      name: "target",
      description: "The user.",
      type: "USER",
      required: true
    }
  ],
  /**
  * @param {CommandInteraction} interaction
*/

  async execute(interaction) {
    const target = interaction.options.getMember("target");

    const Embed = new MessageEmbed()
    .setColor(`${target.hexAccentColor}`)
    .setAuthor(target.user.tag, target.user.avatarURL({dynamic: true, size: 512}))
.setThumbnail(target.user.avatarURL({dynamic: true, size: 512}))
    .addField("ID", `${target.user.id}`)
    .addField("Roles", `${target.roles.cache.map(r => r).join("\n ").replace("@everyone", " ") || "None"}`)
    .addField("Member Since", `<t:${parseInt(target.joinedTimestamp / 1000 )}:R>`, true)
        .addField("Discord User Since", `<t:${parseInt(target.user.createdTimestamp / 1000 )}:R>`, true)

    return interaction.reply({embeds: [Embed]});
  }
}