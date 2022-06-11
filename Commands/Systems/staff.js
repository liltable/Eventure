const { MessageEmbed, CommandInteraction, WebhookClient } = require("discord.js");
const { loggerid, loggertoken } = require("../../Structures/config.json");


module.exports = {
  name: "staff",
  description: "All commands needed for staff activities.",
  permission: "VIEW_AUDIT_LOG",
  options: [
    {
      name: "kick",
      description: "Kicks a member from the server.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "target",
          description: "Selects the target to be kicked",
          type: "USER",
          required: true
        },
        {
          name: "justification",
          description: "Type a reason why the user was banned to be logged.",
          type: "STRING",
          required: false
        }
      ]
    },
    {
      name: "ban",
      description: "Bans a user from the server.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "target",
          type: "USER",
          description: "Selects the target to be banned from the server.",
          required: true
        },
        {
          name: "justification",
          type: "STRING",
          description: "Type a reason why the user was banned to be logged.",
          required: false
        }
      ]
    },
    {
      name: "clean",
      description: "Removes a certain amount of messages from the channel or user.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "amount",
          description: "Selects the amount of messages to delete.",
          type: "NUMBER",
          required: true
        },
        {
          name: "target",
          description: "Select the target from whose messages are to be deleted.",
          type: "USER",
          required: false
        },
      ]
    },
    {
      name: "role",
      description: "Adds or removes a role based on the member.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "role",
          type: "ROLE",
          description: "Selects the role to add/remove from/to the user.",
          required: true
        },
        {
          name: "target",
          type: "USER",
          description: "Selects the user to add/remove the role from.",
          required: true
        }
      ]
    }
    ],
  /**
  * @param {CommandInteraction} interaction
  */
  async execute(interaction) {
    const { options } = interaction;
    const Sub = interaction.options.getSubcommand();

    const ErrorEmbed = new MessageEmbed()
    .setColor("RED")
    .setTitle("Error Encountered...")

    const SuccessEmbed = new MessageEmbed()
    .setColor("GREEN")

    const Logger = new WebhookClient({
      id: loggerid, 
      token: loggertoken,
    });


    switch(Sub) {
      case "kick" : {
        const Target = interaction.options.getMember("target");
        const Author = interaction.user;
        const Reason = interaction.options.getString("justification");

      const LogMessage = new MessageEmbed()
        .setColor("RED")
        .setTitle("User Kicked")
        .addFields(
          {name: "User Info", value: `Username: ${Target.user.tag}\n ID: ${Target.id}`},
          {name: "Justification", value: `${Reason}`},
          {name: "Responsible Staff", value: `<@${Author.id}>`},
          {name: "Date Kicked", value: `<t:${parseInt(interaction.createdTimestamp / 1000)}:R>`}
        )

        const Response = new MessageEmbed()
          .setColor("RED")
          .setDescription(`:white_check_mark: Kicked <@${Target.user.id}> for ${Reason}`)
        
        Target.kick(Reason);
        interaction.reply({embeds: [Response]});
        return Logger.send({embeds: [LogMessage]});
       
      }
        break;
      case "ban" : {
        const Target = interaction.options.getMember("target");
        const Author = interaction.user;
        const Reason = interaction.options.getString("justification");
        const Logger = new WebhookClient({id: loggerid, token: loggertoken,});

        const LogMessage = new MessageEmbed()
        .setColor("RED")
        .setTitle("User Banned")
        .addFields(
          {name: "User Info", value: `Username: ${Target.user.tag}\n ID: ${Target.user.id}`},
          {name: "Justification", value: `${Reason}`},
          {name: "Responsible Staff", value: `<@${Author.id}>`},
          {name: "Date Banned", value: `<t:${parseInt(interaction.createdTimestamp / 1000)}:R>`}
        )  
        const Response = new MessageEmbed().setColor("RED").setDescription(`:white_check_mark: Banned <@${Target.user.id}> for ${Reason}`)

          Target.ban();
          Logger.send({embeds: [LogMessage]});
        return interaction.reply({embeds: [Response]});
    }
        break;
      case "clean" : {
        const { channel, options } = interaction;

        const Amount = options.getNumber("amount");
        const Target = options.getUser("target");
        const Author = interaction.user;

        const Messages = await channel.messages.fetch();

        const Response = new MessageEmbed()
        .setColor("RED")

        const LogMessage = new MessageEmbed()
      .setColor("RED")
      .setTitle("Messages Purged")
      .addFields(
        {name: "Responsible Staff", value: `${Author.tag}`},
        {name: "Amount Purged", value: `${Messages.size} message(s)`},
        {name: "Channel Issued", value: `<#${interaction.channel.id}>`},
        {name: "Date Issued", value: `<t:${parseInt(interaction.createdTimestamp / 1000)}:R>`}
     )

        if(Target) {
            let i = 0;
            const filtered = [];
            (await Messages).filter((m) => {
                if(m.author.id === Target.id && Amount > i) {
                    filtered.push(m);
                    i++;

                }
            })

            await channel.bulkDelete(filtered, true).then(messages => {
                Response.setDescription(`Cleared ${messages.size} message(s) from ${Target}.`);
                interaction.reply({embeds: [Response]});
                  return Logger.send({embeds: [LogMessage]});
            })
        } else {
            await channel.bulkDelete(Amount, true).then(messages => {
                Response.setDescription(`Cleared ${messages.size} message(s) from this channel.`);

              const LogMessage = new MessageEmbed()
      .setColor("RED")
      .setTitle("Messages Purged")
      .addFields(
        {name: "Responsible Staff", value: `${Author.tag}`},
        {name: "Amount Purged", value: `${messages.size} message(s)`},
        {name: "Channel Issued", value: `<#${interaction.channel.id}>`},
        {name: "Date Issued", value: `<t:${parseInt(interaction.createdTimestamp / 1000)}:R>`}
      )
              
              interaction.reply({embeds: [Response]});
              return Logger.send({embeds: [LogMessage]});
            });
      }
        
      }
        break;
      case "role" : {
        const { options } = interaction;
        const role        = options.getRole("role");
        const target      = options.getMember("target") || interaction.member;
        const embed       = new MessageEmbed()
                            .setColor(`#${interaction.guild.roles.cache.get(role.id).color.toString(16)}`)
                            .setTitle("Role Management");

        if (!role.editable || role.position === 0) {
            embed.setDescription(`I cannot edit the ${role} role!`)
            return interaction.reply({ embeds: [embed]})
        }
        
        embed.setDescription(target.roles.cache.has(role.id) ? `Removed the ${role} role from ${target}.` : `Added the ${role} role to ${target}.`);
        target.roles.cache.has(role.id) ? target.roles.remove(role) : target.roles.add(role);
         interaction.reply({embeds: [embed], fetchReply: true});
      } 
    }
  }
}