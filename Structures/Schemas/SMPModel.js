const { model, Schema } = require("mongoose");

module.exports = model("SMP Registration", new Schema({
  GuildID: String,
  MemberID: String,
  MemberIGN: String,
  Whitelisted: Boolean
})
);