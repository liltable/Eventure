const { CommandInteraction, Client } = require("discord.js");
const guildMemberAdd = require("../../Events/Member/guildMemberAdd");

module.exports = {
    name: "emit",
    description: "Event emitter.",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "member",
            description: "Server member events.",
            type: "STRING",
            required: true,
            choices: [
                {
                    name: "guildMemberAdd",
                    value: "guildMemberAdd",

                }, 
                {
                    name: "guildMemberRemove",
                    value: "guildMemberRemove",
                    
                }
            ]


        }
    ],
    execute(interaction, client) {
        const choices = interaction.options.getString("member");

        switch(choices) {
            case "guildMemberAdd" : {
                client.emit("guildMemberAdd", interaction.member);
                interaction.reply({content: "Emitted the event specified.", ephermal: true})
            }
            break;
            case "guildMemberRemove" : {
                client.emit("guildMemberRemove", interaction.member);
                interaction.reply({content: "Emitted the event specified.", ephermal: true})
            }
            break;


        }
    }
}