const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "amongus",
  description: "amongus",
  /**
  *
  * @param {CommandInteraction} interaction
  */
  execute(interaction){
    
    interaction.reply({embeds: [
      new MessageEmbed()
      .setColor("GREEN")
      .setTitle("AMONGUS")
      .setDescription("among us")
    ]});
  }
}