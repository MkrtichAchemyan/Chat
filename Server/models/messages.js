var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var messagesSchema = new Schema({
  uniqueId: {
    type: Number,
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  time: {
    type: Date,
    required: true,
  },
  message: String,
});

module.exports = mongoose.model("messages", messagesSchema);
