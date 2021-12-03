/**
 * 连接 mongoDB
 */
const mongoose = require('mongoose')
const { URL } = require('./../config')
const log4js = require('./../utils/log4j')

mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection

db.on('error', () => {
  log4js.error('***数据库连接失败***')
})

db.on('open', () => {
  log4js.info('***数据库连接成功***')
})
