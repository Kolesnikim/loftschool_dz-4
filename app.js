const path = require('path')

const Koa = require('koa')
const serve = require('koa-static')
const koaBody = require('koa-body')
const KoaPug = require('koa-pug')
const session = require('koa-session')
const flash = require('koa-connect-flash')

const logger = require('koa-morgan')
const dotenv = require('dotenv')

const router = require('./routes/')
const errorHandler = require('./controllers/errorController')

dotenv.config({
  path: './config.env'
});

const app = new Koa()

const pug = new KoaPug({
  viewPath: path.resolve(__dirname, 'views'),
  app: app,
});

process.env.NODE_ENV === 'development'
  ? app.use(logger('dev'))
  : app.use(logger('short'))

app.use(koaBody())
app.use(serve(path.resolve(__dirname, 'public')))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  key: 'current-user',
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  },
  signed: false,
  rolling: false,
  renew: false,
  saveUninitialized: false,
  resave: false
}, app))

app.use(router.routes())

app.use(errorHandler);

app.on('error', (err, ctx) => {
  console.log(err)
  ctx.response.body = {}
  ctx.render('error', {
    status: ctx.response.status,
    error: ctx.response.message,
  });
});

app.listen(3000, () => {})
