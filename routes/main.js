const Router = require('koa-router')

const mainController = require('../controllers/mainController')

const router = new Router()

router.get('/', mainController.getMainPage)

router.post('/', mainController.sendMessage)

module.exports = router
