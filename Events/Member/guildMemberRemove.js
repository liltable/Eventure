const { MessageEmbed, Client, WebhookClient, GuildMember, Guild} = require("discord.js");

const { lobbyid, lobbytoken } = require("../../Structures/config.json");

module.exports = {
    name: "guildMemberRemove",
    execute(member) {
        const { user, guild } = member; 
      
        const Lobby = new WebhookClient({
            id: lobbyid,
            token: lobbytoken,
        });

        const MemberLeft = new MessageEmbed()
            .setColor("RED")
            .setAuthor(user.tag, user.avatarURL({dynamic: true, size: 512}))
            .setThumbnail(user.avatarURL({dynamic: true, size: 512}))
            .setDescription(`
            ${member} has left the community. :(\n
            Joined: <t:${parseInt(member.joinedTimestamp / 1000)}:R>\n
            Latest Member Count: **${guild.memberCount}**`)
            .setFooter(`ID: ${user.id}`)

        Lobby.send({embeds: [MemberLeft]});
    }
}
