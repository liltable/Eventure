const { CommandInteraction, MessageEmbed, WebhookClient } = require("discord.js")
const {smpid, smptoken} = require("../../Structures/config.json");
const SMP = new WebhookClient({id: smpid, token: smptoken});
const DB = require("../../Structures/Schemas/SMPModel.js")


module.exports = {
  name: "smp",
  description: "The SMP registration system for Eventure",
  options: [
    {
      name: "register",
      description: "Register your Minecraft IGN to be whitelisted in the server!",
      type: "SUB_COMMAND",
      options: [
        {
          name: "username",
          description: "Your Minecraft IGN",
          type: "STRING",
          required: true
        }
      ]
    },
    {
      name: "whitelist",
      description: "Tell the user via DM's that they have been whitelisted for the SMP!",
      type: "SUB_COMMAND",
      options: [
        {
          name: "user",
          description: "The user that has been whitelisted",
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
    const Sub = interaction.options.getSubcommand();
    
    if(interaction.channel.id !== process.env.smpchannel) return interaction.reply({content: `This command needs to be run in <#${process.env.smpchannel}>`, ephemeral: true});
    
    switch(Sub) {
      case "register" : {

        const IGN = interaction.options.getString("username");
        const Author = interaction.user;
        
        await DB.findOne({GuildID: interaction.guild.id, MemberID: interaction.user.id, MemberIGN: IGN}, async(err, data) => {
          if(err) throw err;
          
          if(!data) {
            DB.create({
              GuildID: interaction.guild.id,
              MemberID: interaction.user.id,
              MemberIGN: IGN,
              Whitelisted: false
            });
            
            SMP.send({embeds: [
              new MessageEmbed()
              .setColor("BLUE")
              .setTitle("SMP Access Requested")
              .addFields(
                {name: "User Info", value: `User: ${Author}\n IGN: ${IGN}`},
                {name: "Date Requested", value: `<t:${parseInt(interaction.createdTimestamp / 1000)}:R>`}
              )
            ]});
            
            return interaction.reply({embeds: [
              new MessageEmbed()
              .setColor("GREEN")
              .setDescription(`Successfully registered your account **${IGN}** with the SMP! You will recieve a DM notifying you when you've been whitelisted, if your DM's are open.`)
            ], ephemeral: true});
          }
          
          if(data) return interaction.reply({embeds: [
            new MessageEmbed()
            .setColor("RED")
            .setDescription(":no_entry_sign: You already registered for the SMP! If you wish to add multiple accounts, contact staff using `/ask`!")
            .setFooter(`You registered with the account **${data.MemberIGN}**.`)
          ], ephemeral: true});
        })
      }
        break;
        
      case "whitelist" : {
        if(!interaction.member.permissions.has("MANAGE_GUILD")) return interaction.reply({embeds: [
          new MessageEmbed()
          .setColor("RED")
          .setDescription(":no_entry_sign: Invalid permissions.")
        ], ephemeral: true});
        const Target = interaction.options.getMember("user");

        await DB.findOne({GuildID: interaction.guild.id, MemberID: Target.id}, async(err, data) => {
          if(err) throw err;
          if(!data) return interaction.reply({embeds: [
            new MessageEmbed()
            .setColor("RED")
            .setDescription(":no_entry_sign: This user has not registered their IGN yet!")
          ]});
          
          if(data) {
            if(data.Whitelisted === true) return interaction.reply({embeds: [
              new MessageEmbed()
              .setColor("RED")
              .setDescription("This user has already been whitelisted!")
            ], ephemeral: true});
            
            await DB.updateOne({GuildID: interaction.guild.id, MemberID: Target.id, Whitelisted: true});

            Target.roles.add("970388679891771462");
            
            Target.send({embeds: [
              new MessageEmbed()
              .setColor("GREEN")
              .setDescription(`:white_check_mark: Your account ${data.MemberIGN} has been whitelisted!`)
            ]}).catch((error) => interaction.channel.send({embeds: [
              new MessageEmbed()
              .setColor("RED")
              .setDescription(`${Target}'s DM's were closed. They could NOT have been told that their account has been whitelisted.`)
            ]}));
            
            SMP.send({embeds: [
              new MessageEmbed()
              .setColor("RED")
              .setTitle("SMP Member Whitelisted")
              .addFields(
                {name: "Member Info", value: `Username: ${Target}\n IGN: ${data.MemberIGN}`},
                {name: "Whitelister", value: `${interaction.user}`}
              )
              .setTimestamp()
            ]});
            
            return interaction.reply({embeds: [
              new MessageEmbed()
              .setColor("GREEN")
              .setDescription(`Successfully whitelisted ${Target}'s account **${data.MemberIGN}**!'`)
            ], ephemeral: true});
          }
        });
      }
        break;
    }
  }
}