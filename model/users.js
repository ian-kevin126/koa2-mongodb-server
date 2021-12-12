const mongoose = require('mongoose')

// 用户对象
const UserSchema = new mongoose.Schema({
  username: String,
  password: {
    type: String,
    default: '123456',
  },
  phoneNo: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
})

const UserModel = mongoose.model('users', UserSchema, 'users')

module.exports = UserModel
