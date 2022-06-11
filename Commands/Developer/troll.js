const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "trollmessage",
  description: "Message anyone on the server!",
  permission: "ADMINISTRATOR",
  options: [
    {
      name: "user",
      type: "USER",
      description: "choose your target",
      required: true
    },
    {
      name: "message",
      type: "STRING",
      description: "choose your words wisely",
      required: true
    }
  ],
  /**
  * @param {CommandInteraction} interaction
  */
  async execute(interaction) {
    const Target = interaction.options.getUser("user");

    const Message = interaction.options.getString("message");

    Target.send({embeds: [
      new MessageEmbed()
      .setColor("GREYPLE")
      .setDescription(`${Message}`).catch((error) => {
        return interaction.reply({embeds: [
          new MessageEmbed()
          .setColor("RED")
          .setDescription(":no_entry_sign: Troll incomplete. Target had DM's disabled.")
        ], ephemeral: true});
      })
    ]});
    interaction.reply({embeds: [
      new MessageEmbed()
      .setColor("GREEN")
      .setDescription(`:white_check_mark: Troll success. You've trolled ${Target} with the message: ${Message}. Congrats gamer, report back to HQ.`)
    ], ephemeral: true});
  }
}