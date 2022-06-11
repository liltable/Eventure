const { CommandInteraction, Client, MessageEmbed } = require('discord.js');

module.exports = {
  name: "music",
  description: "A complete music system at your disposal.",
  permission: "ADMINISTRATOR",
  options: [
    {
      name: "play",
      description: "Play a song to your choosing.",
      type: "SUB_COMMAND",
      options: [{ name: "query", description: "Provide a name or url for the song you want to play.", type: "STRING", required: true}]
    },
    {
      name: "volume",
      description: "Alter the volume of the music",
      type: "SUB_COMMAND",
      options: [{ name: "percent", description: "volume customizer", type: "NUMBER", required: true}]
    },
    {
      name: "settings",
      description: "Customize your experience.",
      type: "SUB_COMMAND",
      options: [{name: "options", description: "Select an option.", type: "STRING", required: true,
                choices: [
        {name: "queue", value: "queue"},
        {name: "skip", value: "skip"},
        {name: "pause", value: "pause"},
        {name: "resume", value: "resume"},
        {name: "stop", value: "stop"},
                ]}]
    }
  ],
  /**
  *
  * @param {CommnadInteraction} interaction
  * @param {Client} client
  */
  async execute(interaction, client) {
      const { options, member, guild, channel } = interaction;
      const VoiceChannel = member.voice.channel;

      if(!VoiceChannel)
      return interaction.reply({content: "You must join a call to be able to use the command.", ephemeral: true});

    if(guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId)
      return interaction.reply({content: `I'm already playing music in <#${guild.me.voice.channelId}>.`, ephemeral: true});

    try {
          switch(options.getSubcommand()) {
            case "play" : {
              client.distube.playVoiceChannel( VoiceChannel, options.getString("query"), { textChannel: channel, member: member });
              return interaction.reply({content: " Request recived."});
            }
            
            case "volume": {
              const Volume = options.getNumber("percent")
              if(Volume > 100 || Volume < 1)
                return interaction.reply({content: "You have to specify a number between 1 and 100."});

              client.distube.setVolume(VoiceChannel, Volume);
              return interaction.reply({content: ` Volume has been set to \`${Volume}%\``});
            }
            case "settings" : {
              const queue = await client.distube.getQueue(VoiceChannel);

              if(!queue)
                return interaction.reply({const: " There is no queue."});

              switch(options.getString("options")) {
                case "skip"  :
                  await queue.skip(VoiceChannel);
                  return interaction.reply({content: " Song has been skipped"})
                case "stop" :
                  await queue.stop(VoiceChannel);
                  return interaction.reply({content: "Music has been stopped"})
                case "pause" :
                  await queue.pause(Voicechannel);
                  return interaction.reply({content: "Music has been paused"})
                case "resume" : 
                  await queue.resume(VoiceChannel);
                  return interaction.reply({content: "Music has been resumed"})
                case "queue" : 
                  return interaction.reply({embeds: [new MessageEmbed()
                                                    .setColor("PURPLE")
                                                    .setDescription(`${queue.songs.map((song, id) => `\n**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``)}`
                                            )]});
              
            }
            return;
          }

        } 
    } catch (e) {
      const errorEmbed = new MessageEmbed()
      .setcolor("RED")
      .setDescription(` Alert: ${e}`)
      return interaction.reply({embeds: [errorEmbed]});
    }
    
  }
}