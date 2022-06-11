const { CommandInteraction, MessageEmbed, WebhookClient } = require("discord.js");
//const DB = require("../../Structures/Schemas/Modmail.js");
const { mailid, mailtoken } = require("../../Structures/config.json");
const Mailbot = new WebhookClient({id: mailid, token: mailtoken});

module.exports = {
  name: "ask",
  description: "Open a DM link between you and the Eventure staff, with the bot acting as the middleman!",
  options: [
    {
      name: "reason",
      description: "Describe why you're creating a DM link!",
      type: "STRING",
      required: true
    }
  ],

  /**
  * @param {CommandInteraction} interaction
  */

  async execute(interaction) {
    interaction.reply({content: "This command has been closed.", ephemeral: true});
    /**const Reason = interaction.options.getString("reason");

    const LogMessage = new MessageEmbed()
    .setColor("GREEN")
    .setTitle("Modmail Link Opened")
    .setTimestamp()
    .addFields(
      {name: "Link Opener", value: `<@${interaction.user.id}>`},
      {name: "Reason", value: `${Reason}`}
    )

    interaction.user.send({embeds: [
      new MessageEmbed()
      .setColor("GREEN")
      .setDescription(`:white_check_mark: Opened a DM link with the Eventure staff with the reason: **${Reason}**`)
    ]}).catch((error) => {
      return interaction.reply({embeds: [
      new MessageEmbed()
      .setColor("RED")
      .setDescription(":no_entry_sign: Your DM's are closed. If you want to recieve messages, enable your DM's in Eventures privacy settings.")
      ]})}); 
    
    interaction.reply({embeds: [
      new MessageEmbed()
      .setColor("GREEN")
      .setDescription(":white_check_mark: Successful!")
    ], ephemeral: true});

      DB.create({
        GuildID: interaction.guild.id,
        MemberID: interaction.user.id,
        Reason: Reason
      });    

    return Mailbot.send({embeds: [LogMessage]});
  
    */
  }
}