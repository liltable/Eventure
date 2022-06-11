const { MessageEmbed, CommandInteraction, Client, WebhookClient } = require("discord.js");
const moment = require("moment");
const { loggerid, loggertoken } = require("../../Structures/config.json");
const warnModel = require("../../Structures/Schemas/warnModel.js");
const Logger = new WebhookClient({id: loggerid, token: loggertoken});

module.exports = {
    name: "warnings",
    description: "System command for warnings.",
    permission: "KICK_MEMBERS",
    options: [
        {
            name: "add",
            description: "Add a warning to a user.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "target",
                    description: "Select the user to warn them.",
                    type: "USER",
                    required: true
                },
                {
                    name: "reason",
                    description: "Add the reason why the user was warned.",
                    type: "STRING",
                    required: false
                }
            ]
        },
        {
            name: "remove",
            description: "Remove a warning from the user.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "warnid",
                    description: "Provide the ID of the warn in order to remove it.",
                    type: "STRING",
                    required: true
                }
            ]
        },
        {
            name: "list",
            description: "List the amount of warnings a user has.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "target",
                    type: "USER",
                    description: "Select the user to list their warnings.",
                    required: true
                }
            ]
        }
    ],

    async execute(interaction, client) {
        const { options } = interaction;
        const Sub = options.getSubcommand();

        switch (Sub) {
            case "add": {
                const user = interaction.options.getMember("target");
                const reason = interaction.options.getString("reason") || "nothing";

                new warnModel({
                    userId: user.id,
                    guildId: interaction.guildId,
                    moderatorId: interaction.user.id,
                    reason,
                    timestamp: Date.now(),
                }).save();

                user.send({ embeds: [
                    new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`You have been warned in **Eventure** for **${reason}**.`)]})
                    .catch((error) => { interaction.channel.send({embeds: [
                  new MessageEmbed()
                      .setColor("RED")
                      .setDescription(":no_entry_sign: The warned user's DM's were closed. They could not be notified of their warn.")
                      ]})});

                interaction.reply({ embeds: [
                    new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`${user} has been warned for **${reason}**.`)] });

              Logger.send({embeds: [
                new MessageEmbed()
                .setColor("RED")
                .setTitle("Warning Issued")
                .addFields(
                  {name: "User Warned", value: `${user}`},
                  {name: "Issuer", value: `<@${interaction.user.id}>`},
                  {name: "Justification", value:` ${interaction.options.getString("reason")}`}
                )
                .setTimestamp()
              ]});
            }
                break;
            case "remove": {
                const warnId = interaction.options.getString('warnid');

                const data = await warnModel.findById(warnId).catch((error) => {return interaction.reply({embeds: [
                  new MessageEmbed()
                  .setColor("RED")
                  .setDescription(":no_entry_sign: The warning ID has to be a string consisting of only numbers and letters. No special characters should be included, such as spaces or dashes.")
                ], ephemeral: true})});

                if (!data)
                    return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setColor("RED")
                                .setDescription(`🚫 **${warnId}** wasn't a valid ID! Try again.`)
                        ]
                    });

                 data.delete();
              const user = interaction.guild.members.cache.get(data.userId);

              Logger.send({embeds: [
                new MessageEmbed()
                .setColor("GREEN")
                .setTitle("Warning Removed")
                .setTimestamp()
                .addFields(
                  {name: "Pardoned User", value: `${user}`},
                  {name: "Responsible Staff", value: `<@${interaction.user.id}>`},
                  {name: "Former Warning ID", value: `${warnId}`}
                )
              ]});

                return interaction.reply({ embeds: [new MessageEmbed().setColor("GREEN").setDescription(`Successfully removed one (1) of ${user}'s warnings.`)] });
              
            }
                break;
            case "list": {
                const user = interaction.options.getUser('target');

                const userWarnings = await warnModel.find({
                    userId: user.id, guildId: interaction.guildId,
                });

                if (!userWarnings?.length) return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor("GREEN")
                            .setDescription(`${user} has no warnings! Good job, ${user}!`)
                    ]
                });

                const embedDescription = userWarnings.map((warn) => {
                    const moderator = interaction.guild.members.cache.get(
                        warn.moderatorId
                    );

                    return [
                        `warnId: ${warn._id}`,
                        `Moderator: ${moderator || "Has Left"}`,
                        `Date: ${moment(warn.timestamp).format("MMMM do YYYY")}`,
                        `Reason: ${warn.reason}`,
                    ].join("\n");
                })
                    .join("\n\n");

                const embed = new MessageEmbed()
                    .setTitle(`${user.tag}'s Warnings:`)
                    .setDescription(embedDescription)
                    .setColor("ORANGE");

                interaction.reply({embeds: [embed]});
            }
        }
    }
}