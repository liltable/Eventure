  const { MessageEmbed, MessageActionRow, MessageButton, CommandInteraction } = require("discord.js");
  /**
  * @param {CommandInteraction} interaction
  */
  module.exports = {
    name: "mailpanel",
    description: "Send the panel for users to click a button to create a new and improved ModMail link!",
    permission: "MANAGE_GUILD",
    options: [
      {
        name: "channel",
        description: "Input the ID of the channel that the panel should be posted in.",
        type: "STRING",
        required: true
      }
    ],
  
    async execute(interaction) {
      const channel = await interaction.guild.channels.cache.get(`${interaction.options.getString("channel")}`);
  
      channel.send({embeds: [
        new MessageEmbed()
        .setColor("GREEN")
        .setAuthor("Eventure | ModMail v2", interaction.guild.iconURL({dynamic: true}))
        .setDescription("Click one of the buttons below to create a ModMail link! Ask any question that falls under any of the categories below!")
      ], components: [
        new MessageActionRow()
        .addComponents(
          new MessageButton()
          .setCustomId("game")
          .setLabel("🎮 Games")
          .setStyle("PRIMARY"),
          new MessageButton()
          .setCustomId("player")
          .setLabel("⛔ Player Report")
          .setStyle("SECONDARY"),
          new MessageButton()
          .setCustomId("event")
          .setLabel("📅 Events")
          .setStyle("SUCCESS"),
          new MessageButton()
          .setCustomId("other")
          .setLabel("👀 Other")
          .setStyle("DANGER")
        )
        ]}).catch((error) => { return interaction.reply({embeds: [
        new MessageEmbed()
        .setColor("RED")
        .setDescription("The channel ID that you have provided is invalid. Please try again.")
        ], ephemeral: true})});
  
      return interaction.reply({embeds: [
        new MessageEmbed()
        .setColor("GREEN")
        .setDescription(":white_check_mark: Successful!")
      ], ephemeral: true});
    }
  }
