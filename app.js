const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors')
const router = require('koa-router')()

const log4js = require('./utils/log4j')
const MongoConnect = require('./config/db')

const index = require('./routes/index')
const users = require('./routes/users')
const menu = require('./routes/menu')

// error handler
onerror(app)

// 连接MongoDB数据库
MongoConnect()

// middlewares
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text'],
  })
)

app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

// 解决跨域问题，一定要放在路由中间件之前
app.use(cors())

app.use(
  views(__dirname + '/views', {
    extension: 'pug',
  })
)

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 一级路由，定义路由前缀，匹配前端的请求
router.prefix('/api')

// 加载二级路由
router.use(index.routes(), index.allowedMethods())
router.use(users.routes(), users.allowedMethods())
router.use(menu.routes(), menu.allowedMethods())
// router.use(roles.routes(), roles.allowedMethods())

// 加载全局路由，注意这一步也不可以漏写
app.use(router.routes(), router.allowedMethods())

// error-handling
// app.on('error', (err, ctx) => {
//   console.error('server error', err, ctx)
// })

app.on('error', (err, ctx) => {
  log4js.error(`${err.stack}`)
})

module.exports = app
