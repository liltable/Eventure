const { MessageEmbed, CommandInteraction } = require("discord.js");

module.exports = {
  name: "gonk",
  description: "gonk",
  permission: "ADMINISTRATOR",

  execute(interaction) {
    const Response = new MessageEmbed()
    .setColor("ORANGE")
    .setTitle("GONK!")
    .setDescription("Gonk. Gonk gonk gonk.\n GONK!")

    interaction.reply({embeds: [Response]});
  }
}