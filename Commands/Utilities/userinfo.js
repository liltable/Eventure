const { ContextMenuInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "userinfo",
  type: "USER",
  permissions: "ADMINISTRATOR",
  /**
   *
   * @param {ContextMenueInteraction} interaction
   */
  async execute(interaction) {
    const target = await interaction.guild.members.fetch(interaction.targetId);

    const Response = new MessageEmbed()
    .setColor("AQUA")
    .setAuthor(target.user.tag, target.user.avatarURL({dynamic: true, size: 512}))
.setThumbnail(target.user.avatarURL({dynamic: true, size: 512}))
    .addField("ID", `${target.user.id}`)
    .addField("Roles", `${target.roles.cache.map(r => r).join(" ").replace("@everyone", " ") || "None"}`)
    .addField("Member Since", `<t:${parseInt(target.joinedTimestamp / 1000 )}:R>`, true)
        .addField("Discord User Since", `<t:${parseInt(target.user.createdTimestamp / 1000 )}:R>`, true)

    return interaction.reply({embeds: [Response], ephemeral: true});
  }
}