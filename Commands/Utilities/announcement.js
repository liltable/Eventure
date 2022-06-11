const { CommandInteraction, WebhookClient, MessageEmbed } = require("discord.js");
const { loggerid, loggertoken, announcerid, announcertoken } = require("../../Structures/config.json");

module.exports = {
  name: "announcement",
  description: "Sends an announcement in the news channel.",
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
  * @param {CommandInteraction} interaction
  */
  async execute(interaction) {
    const author = interaction.options.getMember("author");
    const Message = interaction.options.getString("message");
    await author.user.fetch();
    

    const Logger = new WebhookClient({
      id: loggerid,
      token: loggertoken,
    });

    const Announcer = new WebhookClient({
      id: announcerid,
      token: announcertoken,
    })

    const LogMessage = new MessageEmbed()
    .setColor("RED")
    .setTitle("Announcement Sent")
    .addFields(
      {name: "Author", value: `${author.user.tag}`},
      {name: "Announcement:", value: `${Message}`},
      {name: "Date Published", value: `<t:${parseInt(interaction.createdTimestamp / 1000)}:R>`}
)
const Announcement = new MessageEmbed()
    .setColor("RED")
    .setTitle("New Announcement!")
    .addFields(
      {name: "Announcement:", value: `${Message}`},
      {name: "Date Published", value: `<t:${parseInt(interaction.createdTimestamp / 1000)}:R>`}
      )
    .setAuthor(author.user.tag, author.user.avatarURL({dynamic: true, size: 512}))
    .setThumbnail(author.user.avatarURL({dynamic: true, size: 512}))
    .setFooter(`Posted by ${author.user.username}.`)

    const Response = new MessageEmbed()
    .setColor("GREEN")
    .setTitle("Announcement Sent!")
    .addFields(
      {name: "Message Posted", value: ":white_check_mark: Posted the message inside the announcement channel."},
      {name: "Your Message:", value: `${Message}`},
      {name: "Date Posted", value: `<t:${parseInt(interaction.createdTimestamp / 1000)}:R>`}
      )
    

  Announcer.send({embeds: [Announcement]});
  Logger.send({embeds: [LogMessage]});
  return interaction.reply({embeds: [Response], ephemeral: true});
  }
}