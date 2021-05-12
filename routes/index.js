const express = require('express')

const mainRouter = require('./main')
const loginRouter = require('./login')
const adminRouter = require('./admin')

const router = express.Router()

router.use('/', mainRouter)

router.use('/login', loginRouter)

router.use('/admin', adminRouter)

module.exports = router
