/**
 * 连接 mongoDB
 */
const mongoose = require('mongoose')
const {URL} = require('./../config')
const log4js = require('./../utils/log4j')

module.exports = () => {
    // 使用 mongodb 协议
    mongoose
        .connect(URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }, null)
        .then(() => {
            log4js.info('***数据库连接成功***')
        })
        .catch((err) => {
            log4js.error('***数据库连接失败***')
        });
};

