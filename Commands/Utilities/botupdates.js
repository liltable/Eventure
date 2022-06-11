const { CommandInteraction, WebhookClient, MessageEmbed } = require("discord.js");
const { loggerid, loggertoken, eventid, eventtoken } = require("../../Structures/config.json");

module.exports = {
  name: "event",
  description: "Sends an announcement about the upcoming event in the events channel.",
  permission: "ADMINISTRATOR",
  options: [
    {
      name: "message",
      description: "The announcement that is to be shared with the community.",
      type: "STRING",
      required: true
    }, 
    {
      name: "author",
      type: "USER",
      description: "The member that is to be shown as the author of the announcement.",
      required: true
      
    }
  ],
  /**
  * @param {CommandInteraction} interactoion
  */
  async execute(interaction) {
    const author = interaction.options.getMember("author");
    const Message = interaction.options.getString("message");
    await author.user.fetch();
    

    const Logger = new WebhookClient({
      id: loggerid,
      token: loggertoken,
    });

    const Eventer = new WebhookClient({
      id: eventid,
      token: eventtoken,
    })

    const LogMessage = new MessageEmbed()
    .setColor("RED")
    .setTitle("Eventure Event News")
    .addFields(
      {name: "Author", value: `${author.user.tag}`},
      {name: "Event Announcement:", value: `${Message}`},
      {name: "Date Published", value: `<t:${parseInt(interaction.createdTimestamp / 1000)}:R>`}
)
const Announcement = new MessageEmbed()
    .setColor("RED")
    .setTitle("Eventure Event News")
    .addFields(
      {name: "Event Announcement:", value: `${Message}`},
      {name: "Date Published", value: `<t:${parseInt(interaction.createdTimestamp / 1000)}:R>`}
      )
    .setAuthor(author.user.tag, author.user.avatarURL({dynamic: true, size: 512}))
    .setThumbnail(author.user.avatarURL({dynamic: true, size: 512}))
    .setFooter(`Posted by ${author.user.username}.`)

    const Response = new MessageEmbed()
    .setColor("GREEN")
    .setTitle("Update Sent!")
    .addFields(
      {name: "Message Posted", value: ":white_check_mark: Posted the message inside the bot news channel."},
      {name: "Your Message:", value: `${Message}`},
      {name: "Date Posted", value: `<t:${parseInt(interaction.createdTimestamp / 1000)}:R>`}
      )
    

  Updater.send({embeds: [Announcement]});
  Eventer.send({embeds: [LogMessage]});
  return interaction.reply({embeds: [Response], ephemeral: true});
  }
}