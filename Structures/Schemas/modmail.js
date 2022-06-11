const { model, Schema } = require("mongoose");
module.exports = model("modmail system v2", new Schema({
  GuildName: String,
  GuildID: String,
  Username: String, 
  UserID: String,
  ChannelID: String,
  ID: String,
  Time: String,
  Reason: String,
  Locked: Boolean,
  Closed: Boolean
}));