const { Client, MessageEmbed, WebhookClient } = require("discord.js");
const mongoose = require("mongoose");
const { database, readyid, readytoken } = require("../../Structures/config.json");

module.exports = {
    name: "ready",
    once: true,
    /**
     * 
     * @param {Client} client 
     */
    async execute(client) {
        console.log(`Successfully logged into the Eventure account at ${client.user.tag}. Bot is ready! :)`)

      const Embed = new MessageEmbed()
      .setColor("GREEN")
      .setTitle("Eventure Restarted!")
      .setDescription(`Everture has restarted!\n Timestamp: <t:${parseInt(client.readyTimestamp / 1000)}:R>`)
      .setTimestamp();

      const Logger = new WebhookClient({
        id: readyid, 
        token: readytoken,
      });

      Logger.send({embeds: [Embed]});
      
        client.user.setActivity("Pride Month", {
          type: "STREAMING",
          url: "https://www.twitch.tv/monstercat"
        });

        if(!database) return;
        mongoose.connect(database, {
            useNewUrlParser: true,
            useUnifiedTopology: true
          
        }).then(() => {
            console.log("Eventure has established a link to the database.")
          
        }).catch((err) => {
            console.log(err)
        });
    }
}
