const UserModel = require('../model/users')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, EXPIRES_IN } = require('../config/index')

/**
 * 新用户注册
 * @param ctx
 * @returns {Promise<void>}
 */
const register = async (ctx) => {
  const { username, password, phoneNo, email } = ctx.request.body

  let hasExist = false

  await UserModel.findOne({ username }).then((rel) => {
    if (rel) hasExist = true
  })

  if (hasExist) {
    ctx.body = {
      code: 300,
      msg: '用户名已经存在',
    }
  } else {
    // 如果不存在，就创建一个新的用户
    await UserModel.create({ username, password, phoneNo, email })
      .then((rel) => {
        if (rel) {
          ctx.body = {
            code: 200,
            msg: '注册成功',
          }
        } else {
          ctx.body = {
            code: 300,
            msg: '注册失败',
          }
        }
      })
      .catch((err) => {
        ctx.body = {
          code: 500,
          msg: '注册时出现异常',
          err,
        }
      })
  }
}

/**
 * 用户登录
 * @param ctx
 * @returns {Promise<void>}
 */
const login = async (ctx) => {
  const { username, password } = ctx.request.body

  await UserModel.findOne({ username, password })
    .then((rel) => {
      if (rel) {
        console.log('rel', rel)
        const token = jwt.sign(
          {
            username: rel.username,
            _id: rel._id,
          },
          JWT_SECRET,
          {
            expiresIn: EXPIRES_IN,
          }
        )

        ctx.body = {
          code: 200,
          msg: '登录成功',
          data: {
            username: rel.username,
            token: token,
            phoneNo: rel.phoneNo,
            email: rel.email,
          },
        }
      } else {
        ctx.body = {
          code: 300,
          msg: '用户名或密码错误',
        }
      }
    })
    .catch((err) => {
      ctx.body = {
        code: 500,
        msg: '登录时出现异常，请稍后再试',
        err,
      }
    })
}

module.exports = {
  register,
  login,
}
