const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const logger = require('koa-logger')
const koaJwt=require('koa-jwt')
const index = require('./routes/index')
const users = require('./routes/users')
const upload=require('./routes/upload')
const mongoConf = require('./db/config');
const cors = require('@koa/cors')
const bodyparser=require('koa-bodyparser')

//connect mongo
mongoConf.connect();
// error handler
onerror(app)
//trust proxy
app.proxy = true
// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(cors())
app.use(require('koa-static')(__dirname + '/public'))

app.use(koaJwt({
  
  secret:'morney-server-jwt'
}).unless({
   path:[/^\/users\/login/,/^\/users\/register/]
}))
app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})


// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(upload.routes(),upload.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
