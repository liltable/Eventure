const { CommandInteraction } = require("discord.js");

module.exports = {
  name: "ninjago",
  description: "Ninjago.",
  permission: "VIEW_AUDIT_LOG",
  /**
  *
  * @param {CommandInteraction} interaction
  */
  execute(interaction) {
    interaction.reply({content: "Ninjago was created by the First Spinjitzu Master by using the four Weapons of Spinjitzu: The Scythe of Quakes, the Nunchucks of Lightning, the Shurikens of Ice, and the Sword of Fire. Weapons so powerful no one can handle all of their power at once. When he passed away his two sons swore to protect them, but the oldest was consumed by darkness and wanted to posess them. A battle between brothers broke out and the oldest was struck down and banished to the Underworld. Peace returned and the younger brother hid the Weapons. But knowing his older brother's relentless ambition for power, he placed a guardian to protect them. And for fear of his own demise, a map for an honest man to hide. JUMP UP KICK BACK WHIP AROUND AND SPIN, AND THEN WE JUMP BACK DO IT AGAIN. NINJA GO! NINJA GO! C'MON C'MON AND DO THE WEEKEND WHIP the whip NINJA GO NINJA GO CMON CMON CMON AND DO THE WEEKEND WHIP. JUMP UP KICK BACK WHIP AROUND AND SPIN"});
  }
}