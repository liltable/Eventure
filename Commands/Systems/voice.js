const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "voice",
  description: "Control your own channel",
  options: [
    {
      name: "invite",
      type: "SUB_COMMAND",
      description: "Invite a friend to your channel.",
      options: [
        {
          name: "member",
          type: "USER",
          required: true,
          description: "Select the member."
        }
      ]
    },
    {
      name: "disallow",
      type: "SUB_COMMAND",
      description: "Remove someone's access to the channel",
      options: [
        {
          name: "member",
          type: "USER",
          required: true,
          description: "Select the member."
        }
      ]
    },
    {
      name: "name",
      type: "SUB_COMMAND",
      description: "Change the name of the channel",
      options: [
        {
          name: "text",
          type: "STRING",
          required: true,
          description: "Provide the name."
        }
      ]
    },
    {
      name: "open",
      type: "SUB_COMMAND",
      description: "Toggles whether you want your channel open or private.",
      options: [
        {
          name: "toggle",
          type: "STRING",
          required: true,
          description: "Toggle the channels state, whether its public or private.",
          choices: [
            { name: "Public", value: "on"},
            { name: "Private", value: "off"}
          ]
        }
      ]
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction, client) {
    const { options, member, guild } = interaction;

    const subCommand = options.getSubcommand();
    const voiceChannel = member.voice.channel;
    const Embed = new MessageEmbed().setColor("GREEN");
    const ownedChannel = client.voiceGenerator.get(member.id);

    if(!voiceChannel)
      return interaction.reply({embeds: [Embed.setDescription("You're not in a voice channel.").setColor("RED")]});

    if(!ownedChannel || voiceChannel.id !== ownedChannel)
      return interaction.reply({embeds: [Embed.setDescription("You don't own this or any channel.").setColor("RED")]});

    switch(subCommand) {
      case "name" : {
        const newName = options.getString("text");
        if(newName.length > 22 || newName.length < 1)
          return interaction.reply({embeds: [Embed.setDescription("The channel cannot exceed the 22 character limit.").setColor("RED")]})

        voiceChannel.edit({ name: newName});
        interaction.reply({embeds: [Embed.setDescription(`Your channel name has been changed to: **${newName}**`)]})
      }
      break;
      case "invite" : {

            const targetMember = options.getMember("member");
            voiceChannel.permissionOverwrites.edit(targetMember, {CONNECT: true});
  
            targetMember.send({embeds: [Embed.setDescription(`${member} has invited you to <#${voiceChannel.id}>`)]}).catch(error => {return interaction.channel.send({embeds: [
              new MessageEmbed()
              .setColor("RED")
              .setDescription(`:no_entry_sign: Never mind, ${targetMember} DM's are closed.`)
              ]})});
        
              interaction.reply({embeds: [Embed.setDescription(`${targetMember} has been invited.`)]});
            

        }
      break;
      case "disallow" : {
       const targetMember = options.getMember("member");
       voiceChannel.permissionOverwrites.edit(targetMember, {CONNECT: false});

        if(targetMember.voice.channel && targetMember.voice.channel.id == voiceChannel.id) targetMember.voice.setChannel(null);
        interaction.reply({embeds: [Embed.setDescription(`${targetMember} has been denied access to this channel.`)]});
      }
      break;
      case "open" : {
        const turnChoice = options.getString("toggle")
        switch(turnChoice) {
          case "on" : {
            voiceChannel.permissionOverwrites.edit(guild.id, {CONNECT: null});
            interaction.reply({embeds: [Embed.setDescription("Your voice channel is now public for all to join.")]})
          }
          break;
          case "off" : {
             voiceChannel.permissionOverwrites.edit(guild.id, {CONNECT: false});
            interaction.reply({embeds: [Embed.setDescription("Your channel is now closed to the public.")]})
          }
          break;
        }
      }
      break;
    }
  }
}