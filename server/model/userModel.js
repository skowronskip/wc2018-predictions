const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  login: {
    type: String,
    required: [true, 'Login is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  mail: {
    type: String,
    required: [true, 'E-mail is required']
  },
  active: {
    type: Boolean,
    default: false
  },
  activationToken: {
    type: String
  },
    resetToken: {
        type: String
    },
    resetPass: {
        type: Boolean,
        default: false
    },
    creationDate: {
    type: Date
    }
});

const User = mongoose.model('users', UserSchema);

module.exports = User;
