const Router = require('koa-router')

const loginController = require('../controllers/loginController')

const router = new Router()

router.get('/', loginController.getLoginPage)

router.post('/', loginController.sendForm)

module.exports = router
