const { ButtonInteraction, MessageButton, MessageActionRow, MessageEmbed } = require("discord.js");
const DB = require("../../Structures/Schemas/modmail.js");
const { MMPARENTID, MMEVERYONE } = require("../../Structures/config.json");

module.exports = {
  name: "interactionCreate",
  /**
    * @param {ButtonInteraction} interaction
*/
  async execute(interaction) {
    if(!interaction.isButton()) return;
    const { guild, customId } = interaction;
    if(!["player", "event", "game", "other"].includes(customId)) return;

    const Author = interaction.user;
    const ID = Math.floor(Math.random() * 1000 ) + 10000;
    const timestamp = interaction.createdTimestamp / 1000;

      await guild.channels.create(`${Author.username}-${ID}`, {
      type: "GUILD_TEXT",
      parent: MMPARENTID,
      permissionOverwrites: [
        {
          id: MMEVERYONE,
          deny: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
        }
      ]
    }).then(async (channel) => {

    await channel.send({embeds: [
      new MessageEmbed()
      .setColor("GREEN")
      .setAuthor(`${guild.name} | Modmail Controls`, guild.iconURL({dynamic: true}))
      .setDescription(`This panel help you control the Modmail link that ${Author} created. Use it  wisely.`)
    ], components: [
      new MessageActionRow()
      .addComponents(
        new MessageButton()
        .setCustomId("lock")
        .setLabel("🔒 Lock")
        .setStyle("PRIMARY"),
        new MessageButton()
        .setCustomId("unlock")
        .setLabel("🔓 Unlock")
        .setStyle("SUCCESS"),
        new MessageButton()
        .setCustomId("close")
        .setLabel("📁 Save & Close")
        .setStyle("DANGER"),
        new MessageButton()
        .setCustomId("info")
        .setLabel("📎 Info")
        .setStyle("SECONDARY")
      )
    ]}); 
        
      await DB.create({
        GuildName: guild.name,
        GuildID: guild.id,
        Username: Author.username,
        UserID: Author.id,
        ChannelID: channel.id,
        ID: ID,
        Time: timestamp,
        Reason: customId,
        Locked: false,
        Closed: false
      });
    
       

    if(customId === "player") {
          Author.send({embeds: [
            new MessageEmbed()
            .setTitle("Player Report")
            .setColor("RED")
            .setDescription("Please provide all information about a player or member that is breakig one of our rules on either a game or the Discord server.")
          ]}).catch((error) => channel.send({embeds: [
            new MessageEmbed()
            .setColor("RED")
            .setDescription(`:no_entry_sign: ${Author}'s DM's were closed. I couldn't send them an introduction embed with instructions. Please ensure that their DM's are open for the system to work effectively.`)
          ]}));
    }

    if(customId === "game") {
      Author.send({embeds: [
        new MessageEmbed()
        .setTitle("Game Questions")
        .setColor("RED")
        .setDescription("Have any questions about a game that Eventure recently promoted? Ask them here.")
      ]}).catch((error) => channel.send({embeds: [
            new MessageEmbed()
            .setColor("RED")
            .setDescription(`:no_entry_sign: ${Author}'s DM's were closed. I couldn't send them an introduction embed with instructions. Please ensure that their DM's are open for the system to work effectively.`)
          ]}));
    }

    if(customId === "event") {
      Author.send({embeds: [
        new MessageEmbed()
        .setTitle("Event Questions")
        .setColor("GREEN")
        .setDescription("Have any questions about an upcoming event, or want to pitch ideas in for a new one? Do so here!")
      ]}).catch((error) => channel.send({embeds: [
            new MessageEmbed()
            .setColor("RED")
            .setDescription(`:no_entry_sign: ${Author}'s DM's were closed. I couldn't send them an introduction embed with instructions. Please ensure that their DM's are open for the system to work effectively.`)
          ]}));
    }

    if(customId === "other") {
      Author.send({embeds: [
        new MessageEmbed()
        .setTitle("Other Questions")
        .setColor("RED")
        .setDescription("Huh, something not under the other three categories. Speak your mind. We're listening.")
      ]}).catch((error) => channel.send({embeds: [
            new MessageEmbed()
            .setColor("RED")
            .setDescription(`:no_entry_sign: ${Author}'s DM's were closed. I couldn't send them an introduction embed with instructions. Please ensure that their DM's are open for the system to work effectively.`)
          ]}));
    }
    
    return interaction.reply({content: `:white_check_mark: Your Modmail link has been created. All communications will be used in the Eventure bot DM's.`, ephemeral: true});
      });
  }
}