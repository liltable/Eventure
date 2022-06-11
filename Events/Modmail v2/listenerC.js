const DB = require("../../Structures/Schemas/modmail.js")
const { MessageEmbed }  = require("discord.js");
const { MMPARENTID, ARCHIVESID } = require("../../Structures/config.json")

module.exports = {
  name: "messageCreate",
  description: "Channel message listener for Avesoft's Modmail v2 system.",

  async execute(message) {
    if(!message.guild) return;
    const { guild, channel }  = message;
     
    if(message.author.bot) return;
    DB.findOne({GuildName: guild.name, GuildID: guild.id, ChannelID: channel.id}, async(err, data) => {
      if(err) throw err;
      if(message.channel.parentId !== MMPARENTID) return;
      if(message.channel.id === ARCHIVESID) return;
      
      if(!data) return message.channel.send({embeds: [
        new MessageEmbed()
        .setColor("RED")
        .setDescription("There is no data linking this channel to any members. This ticket will be **automatically closed within 10 seconds.** Beware.")
      ]}).then(
         setTimeout(() => {
      channel.delete().catch((error) => {
        console.log("(discord:err50035) TicketDeletionWarning: Looks like a staff member deleted the channel before I could close it. GG's I guess.")
      });
    }, 10 * 1000)
      );

      if(data.ChannelID !== channel.id) return;
      
        const member = await guild.members.cache.get(`${data.UserID}`);
        member.send({embeds: [
          new MessageEmbed()
          .setColor("BLUE")
          .setTitle("Modmail Message Recieved")
          .setTimestamp()
          .addFields(
            {name: "Message Author", value: `<@${message.author.id}>`},
            {name: "Your Message", value: `${message.content}`}
          )
        ]}).catch((error) => { return message.channel.send({embeds: [
          new MessageEmbed()
          .setColor("RED")
          .setDescription(`The message to ${member} has not been sent because they have their DM's off. Ensure that the target's DM's are enabled in order to prevent further issues.`)
        ]})
        });

      message.react("✅");
    })
  }
}
