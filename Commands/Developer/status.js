const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const { connection } = require("mongoose");
require('../../Events/Client/ready');

module.exports = {
    name: "status",
    description: "Returns to the Eventure client status and other information.",
    permission: "ADMINISTRATOR",
    async execute(interaction, client) {

        const Response = new MessageEmbed()
        .setColor('PURPLE')
        .setDescription(`**CLIENT:** \`Online.\` - \`${client.ws.ping}ms\`\n **UPTIME**: Since <t:${parseInt(client.readyTimestamp / 1000)}:R>\n
        **DATABASE**: \`${switchTo(connection.readyState)}\``)

        
        interaction.reply({embeds: [Response]});
    }
}

function switchTo(val) {
    var status = " ";
    switch(val) {
        case 0 : status = `Client disconnected.`
        break;
        case 1 : status = `Client connected.`
        break;
        case 2 : status = `Client actively connecting.`
        break;
        case 3 : status = `Client disconnecting.`
        break;
    }
    return status;
};