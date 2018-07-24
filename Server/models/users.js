var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// var validateEmail = function (email) {
//     var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//     return re.test(email)
// };

var UserSchema = new Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: 'Email address is required'
  },
  password: {
    type: String,
    required: true
  },
  avatar: String,
  active: {
    type: Boolean,
    default: false
  },
  online: {
    type: Boolean,
    default: false
  },
  token: {
    type:String
  }

});

module.exports = mongoose.model("users", UserSchema);
