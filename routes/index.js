const Router = require('koa-router')

const mainRouter = require('./main')
const loginRouter = require('./login')
const adminRouter = require('./admin')

const router = new Router()

router.use('/', mainRouter.routes())

router.use('/login', loginRouter.routes())

router.use('/admin', adminRouter.routes())

module.exports = router
