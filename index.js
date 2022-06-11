const { Client, Collection } = require("discord.js");
const client = new Client({intents: 32767});
const { keepalive } = require("./keepalive.js");


client.commands = new Collection();
client.voiceGenerator = new Collection();

require("./Systems/GiveawaySys")(client);
require('./Structures/Handlers/events')(client);
require('./Structures/Handlers/commands')(client);
require('./Structures/Handlers/anticrash')(client);

client.login(process.env.token);