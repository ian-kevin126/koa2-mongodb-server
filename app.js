const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors')

const log4js = require('./utils/log4j')
const MongoConnect = require('./config/db')

const index = require('./routes/index')
const users = require('./routes/users')

// error handler
onerror(app)

// 连接MongoDB数据库
MongoConnect();

// middlewares
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text'],
  })
);

app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'))

// 解决跨域问题，一定要放在路由中间件之前
app.use(cors());

app.use(
  views(__dirname + '/views', {
    extension: 'pug',
  })
);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
});

// logger
app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
// app.on('error', (err, ctx) => {
//   console.error('server error', err, ctx)
// })

app.on('error', (err, ctx) => {
  log4js.error(`${err.stack}`)
})

module.exports = app
