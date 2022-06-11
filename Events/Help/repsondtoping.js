const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "messageCreate",

  async execute(message) {
    if(!message.guild) return;
    if(!message.content !== "<@959580736673972314>") return;
    return message.channel.send({embeds: [
      new MessageEmbed()
      .setColor("GREEN")
      .setDescription("Hi! I'm Eventure, and I help manage this events server.")
    ]});
  }
}