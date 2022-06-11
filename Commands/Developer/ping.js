const { CommandInteraction, MessageEmbed, Client } = require("discord.js");

module.exports = {
    name: "ping", 
    description: "Ping the client.",
  /**
  * {CommandInteraction} interaction
  */
    async execute(interaction, client) {
      const Response = new MessageEmbed()
      .setColor("GREEN")
      .setTitle("Imaging Pinging L")
      .setDescription(`The clients ping is ${client.ws.ping}ms.`)
      
      interaction.reply({embeds: [Response]});
    }

}