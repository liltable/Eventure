const { MessageEmbed, Client, WebhookClient, GuildMember, Guild} = require("discord.js");
const { lobbyid, lobbytoken } = require("../../Structures/config.json");

module.exports = {
    name: "guildMemberAdd",
    execute(member) {
        const { user, guild } = member;

        const Lobby = new WebhookClient({
            id: lobbyid,
            token: lobbytoken,
        });

        const Welcome = new MessageEmbed()
        .setColor("PURPLE")
        .setAuthor(user.tag, user.avatarURL({dynamic: true, size: 512}))
        .setThumbnail(user.avatarURL({dynamic: true, size: 512}))
        .setDescription(`
        Welcome ${member} to **${guild.name}**!\n
        Account Created: <t:${parseInt(user.createdTimestamp / 1000)}:R>\n
        Latest Member Count: **${guild.memberCount}**`)
        .setFooter(`ID: ${user.id}`)

       Lobby.send({embeds: [Welcome]});
    }
}
