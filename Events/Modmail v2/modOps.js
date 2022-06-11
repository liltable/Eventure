const { ButtonInteraction, MessageEmbed } = require("discord.js")
const { createTranscript } = require("discord-html-transcripts");
const { ARCHIVESID } = require("../../Structures/config.json");
const DB = require("../../Structures/Schemas/modmail.js");

module.exports = {
  name: "interactionCreate",
 /**
  * @param {ButtonInteraction} interaction
*/

async execute(interaction) {                                                                
    if(!interaction.isButton()) return;
    
  const { guild, customId, channel } = interaction;

    const archives = guild.channels.cache.get(`${ARCHIVESID}`);
    
    if(!["lock", "unlock", "close", "info"].includes(customId)) return;
    

await DB.findOne({ChannelID: interaction.channel.id}, async (err, data) => {
  if(err) throw err;
  if(!data) return interaction.reply({embeds: [
    new MessageEmbed()
    .setColor("RED")
    .setDescription("There is no info relating this channel to said user. Please manually delete this channel.")
  ]});

  if(interaction.channel.id !== data.ChannelID) return;
  const member = guild.members.cache.get(`${data.UserID}`);
  
  
  switch(customId) {
      case "lock": 
        if(data.Locked == true) return interaction.reply({embeds: [
          new MessageEmbed()
          .setColor("RED")
          .setDescription("This Modmail link is already locked.")
        ], ephemeral: true});
        
        if(data.Closed == true) return interaction.reply({embeds: [
          new MessageEmbed()
          .setColor("RED")
          .setDescription("This Modmail link is closed. This ticket should be deleted in a few seconds. Please be patient.")
        ], ephemeral: true
        });

        await DB.updateOne({ChannelID: channel.id}, {Locked: true});
        
        member.send({embeds: [
          new MessageEmbed()
          .setColor("ORANGE")
          .setDescription("Your Modmail link has been locked for reviewing.")
        ]}).catch((error) => {
          return interaction.reply({embeds: [
          new MessageEmbed()  
          .setColor("RED")
          .setDescription("The target's DM's were closed. They were NOT notified that their Modmail link has been locked.")
        ]})});
        
          return interaction.reply({embeds: [
            new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`:white_check_mark: Successfully locked the Modmail link of <@${data.UserID}> for reviewing.`)
         ]});
        break;
        case "unlock":
        if(data.Closed == true) return interaction.reply({embeds: [
          new MessageEmbed()
          .setColor("RED")
          .setDescription("This Modmail link is closed. This channel should be deleted in a few seconds. Please be patient.")
        ], ephemeral: true});

          if(data.Locked == false) return interaction.reply({embeds: [
            new MessageEmbed()
            .setColor("RED")
            .setDescription("This Modmail link was not locked in the first place. What are you doing?")
          ], ephemeral: true});

          if(data.Locked == true) {
            await DB.updateOne({ChannelID: channel.id}, {Locked: false});

        member.send({embeds: [
          new MessageEmbed()
          .setColor("ORANGE")
          .setDescription("Your Modmail link has been unlocked for further discussion.")
        ]}).catch((error) => {
           return interaction.reply({embeds: [
          new MessageEmbed()
          .setColor("RED")
          .setDescription("The target's DM's were closed. They were NOT notified that their Modmail link has been unlocked.")
        ]})});
            
           return interaction.reply({embeds: [
              new MessageEmbed()
              .setColor("GREEN")
              .setDescription(`:white_check_mark: Successfully unlocked the Modmail link of <@${data.UserID}>`)
            ]});
          }
          break;
          case "close":
          if(data.Closed == true) return interaction.reply({embeds: [
            new MessageEmbed()
            .setColor("RED")
            .setDescription("This Modmail link has already been schedruled for archiving. This channel will be deleted in a few seconds. Please be patient.")
          ], ephemeral: true});

        member.send({embeds: [
          new MessageEmbed()
          .setColor("ORANGE")
          .setDescription("Your Modmail link has been closed and archived by staff.")
        ]}).catch((error) => {
          return interaction.reply({embeds: [
          new MessageEmbed()
          .setColor("RED")
          .setDescription("The target's DM's were closed. They were NOT notified that their Modmail link has been closed.")
        ]})});
      
          
            await DB.updateOne({ChannelID: channel.id}, {Closed: true});
            const attachment = await createTranscript(channel, {
               limit: -1,
               returnBuffer: false,
               fileName: `${data.Reason} - ${data.ID}.html`
             });

          const MEMBER = guild.members.cache.get(data.UserID);
          const Message = archives.send({embeds: [
              new MessageEmbed()
            .setAuthor(MEMBER.user.tag,MEMBER.user.displayAvatarURL({dynamic: true}))
            .setTitle(`Transcript Type: ${data.Reason}\n ID: ${data.ID}`)
            .addFields(
              {name: "Closed By:", value: `<@${interaction.user.id}>`},
              {name: "Date Closed", value: `<t:${parseInt(interaction.createdTimestamp / 1000 )}:R>`})], files: [attachment]
          });

          interaction.reply({embeds: [
            new MessageEmbed()
            .setColor("RED")
            .setDescription(`The Modmail link history has been saved in the <#${ARCHIVESID}> channel. You can view it there. \nAlternatively, click [here](${Message.url})`)
          ]});

      data.deleteOne();

          setTimeout(() => {
      return channel.delete().catch((error) => {
        console.log("(discord:err50035) TicketDeletionWarning: Looks like a staff member deleted the channel before I could close it. GG's I guess.")
      });
    }, 10 * 1000);
          break;
        case "info":
      
      if(!data) return interaction.reply({content: "There is no info to display.", ephemeral: true});
          
          return interaction.reply({embeds: [
            new MessageEmbed()
            .setColor("BLURPLE")
            .setTitle(`${data.Username}'s Link`)
            .setTimestamp()
            .addFields(
              {name: "Reason Created", value: data.Reason},
              {name: "Date Created", value: `<t:${parseInt(data.Time)}:R>`, inline: true},
              {name: "Locked?", value: `${data.Locked}`},
               {name: "Closed?", value: `${data.Closed}`, inline: true},
              {name: "User ID", value: `${data.UserID}`},
              {name: "Channel ID", value: `${data.ChannelID}`, inline: true},
              {name: "Guild", value: `${data.GuildName}`},
              {name: "Guild ID", value: `${data.GuildID}`}
            )
        ]});
      }
    });
  }
}