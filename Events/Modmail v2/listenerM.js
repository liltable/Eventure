const DB = require("../../Structures/Schemas/modmail.js");
const { MessageEmbed, Client } = require("discord.js");

module.exports = {
  name: "messageCreate",
  description: "Message Listener for the Modmail v2 System by Avesoft",
  /**
  * @param {Client} client
*/
  async execute(message, client) {
    if(message.guild) return;
    if(message.author.bot) return;
    
    

    DB.findOne({UserID: message.author.id}, async(err, data) => {
      
      if(err) throw err;
      
      if(!data) return message.channel.send({embeds: [
        new MessageEmbed()
        .setColor("RED")
        .setDescription(`You don't have a Modmail link open. Head to <#975870884919259157> to open one.`)
      ]});
      const channel = client.channels.cache.get(data.ChannelID);
      
      if(data.Locked == true) return message.channel.send({embeds: [
        new MessageEmbed()
        .setColor("ORANGE")
        .setDescription("Your link has been locked for reviewing.")
      ]});
      
      channel.send({embeds: [
          new MessageEmbed()
          .setTitle("Modmail Message Recieved")
          .addFields(
            {name: "Content", value: `${message.content}`},
            {name: "User ID", value: `${message.author.id}`}
          )
          .setTimestamp()
          ]}).catch((error) => {
        message.channel.send({embeds: [
          new MessageEmbed()
          .setColor("RED")
          .setDescription("An error has occured. Your message was not sent. Please contact staff if this persists.")
        ]})
          })
        
          message.react('✅');
    });  
  }
}