const { CommandInteraction, WebhookClient, MessageEmbed } = require("discord.js");
const { mailid, mailtoken } = require("../../Structures/config.json");
const Mailbot = new WebhookClient({id: mailid, token: mailtoken});
//const DB = require("../../Structures/Schemas/Modmail.js");

module.exports = {
  name: "mail",
  description: "A complete ModMail system for Eventure. Staff edition.",
  permission: "ADMINISTRATOR",
  options: [
    {
      name: "send",
      description: "Send a response to a ModMail user!",
      type: "SUB_COMMAND",
      options: [
        {
          name: "user",
          description: "The user that that we will send mail to!",
          type: "USER",
          required: true
        },
        {
          name: "message",
          description: "What you're going to send the user!",
          type: "STRING",
          required: true
        }
      ]
    },
    {
      name: "close",
      description: "Close a ModMail link with a Eventure member.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "user",
          description: "Pull the user to close their ModMail link, if one exists.",
          type: "USER",
          required: true
        }
      ]
    },
    {
      name: "info",
      description: "Pull the info about a ModMail Link.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "user",
          description: "The users' ModMail link.",
          type: "USER",
          required: true
        }
      ]
    }
  ],
/**
  * @param {CommandInteraction} interaction
*/
  async execute(interaction) {

    interaction.reply({content: `This command has been closed.`, ephemeral: true});

    /**
      const Sub = interaction.options.getSubcommand();

    switch(Sub) {
      case "send" : {
        const Author = interaction.user;
    const Target = interaction.options.getMember("user");
    const Message = interaction.options.getString("message");

    DB.findOne({MemberID: Target.id}, async(err, data) => {
        if(err) throw err;
      if(!data) return interaction.reply({embeds: [
        new MessageEmbed()
        .setColor("RED")
        .setDescription(":no_entry_sign: This user does not have a ModMail link open. You cannot send a message to this user unless they do so.")
      ]});

      if(data) {

Target.send({embeds: [
      new MessageEmbed()
      .setColor("BLUE")
      .setTitle("Eventure Mail Recieved!")
      .setTimestamp()
      .addFields(
        {name: "Message", value: `${Message}`},
        {name: "Author", value: `${Author}`},
        {name: "Your ID", value: `${Target.id}`}
      )
      .setFooter("Note: Your user ID can be used to trace your message history if an error ensues.")
    ]}).catch((error) => {
      return interaction.channel.send({embeds: [
        new MessageEmbed()
        .setColor("RED")
        .setDescription(":no_entry_sign: The target's DM's were closed. Their message has NOT been sent.")
      ]});
          });
        
        interaction.reply({embeds: [
        new MessageEmbed()
        .setColor("GREEN")
        .setTimestamp()
        .addFields(
          {name: "Successful", value: `Your message to <@${Target.id}> has been delivered.`},
          {name: "Your Message", value: `${Message}`}
        )
      ], ephemeral: true}); 
        
       return Mailbot.send({embeds: [
        new MessageEmbed()
        .setColor("GREEN")
        .setTimestamp()
        .setTitle("ModMail Message Sent")
        .setFooter("Developer Tip: The user's ID can be used to trace message history if an error ensues.")
        .addFields(
          {name: "Target", value: `${Target}`},
          {name: "Target ID", value: `${Target.id}`},
          {name: "Message", value: `${Message}`},
          {name: "Author", value: `<@${Author.id}>`}
        )
      ]});
        }
      });
    }
        break;
      case "close" : {
        
        const Target = interaction.options.getMember("user");
        DB.findOne({MemberID: Target.id}, async(err, data) => {
          if(err) throw err;
          if(!data) return interaction.reply({embeds: [
            new MessageEmbed()
            .setColor("RED")
            .setDescription(":no_entry_sign: This user does not have a ModMail link opened. You cannot close a link that does NOT exist.")
          ], ephemeral: true});

          if(data) {
            data.delete();
            interaction.reply({embeds: [
              new MessageEmbed()
              .setColor("GREEN")
              .setDescription(`:white_check_mark: Closed a ModMail link between the Eventure staff and ${Target}`)
              .setTimestamp()
              .setFooter("Developer Tip: The Target's ID can be used to trace message history if an error ensues")
            ]});
            Target.send({embeds: [
              new MessageEmbed()
              .setColor("ORANGE")
              .setDescription("The Eventure ModMail link has been terminated.")
            ]}).catch((error) => interaction.channel.send({embeds: [
              new MessageEmbed()
              .setColor("RED")
              .setDescription(":no_entry_sign: The target's DM's were closed. They have NOT been notified that their ModMail link has been terminated. It is advised that you do so manually.")
            ]}));

            return Mailbot.send({embeds: [
              new MessageEmbed()
              .setColor("RED")
              .setTitle("ModMail Link Terminated")
              .setTimestamp()
              .addFields(
                {name: "User", value: `<@${Target.id}>`},
                {name: "Reason Opened", value: `${data.Reason}`}
              )
            ]});
          }
        });
      }
        break;
      case "info" : {
        const Target = interaction.options.getUser("user");
        DB.findOne({MemberID: Target.id}, async(err, data) => {
          if(err) throw err;
          if(!data) return interaction.reply({embeds: [
            new MessageEmbed()
            .setColor("RED")
            .setDescription(":no_entry_access: This user does NOT have a ModMail link open.")
          ], ephemeral: true});

          if(data) {
            return interaction.reply({embeds: [
              new MessageEmbed()
              .setColor(`${Target.displayHexColor}`)
              .setTimestamp()
              .setFooter("This embed will be more advanced once I learn how Mongoose timestamps work.")
              .setAuthor(`${Target.displayName}'s ModMail Link'`)
              .addFields(
                {name: "Reason Created", value: `${data.Reason}`}
              )
            ]});
          }
        });
      }
    }

    */
  }
}