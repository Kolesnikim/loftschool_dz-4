const Router = require('koa-router')

const adminController = require('../controllers/adminController')

const router = new Router()

router.get('/', adminController.isAdmin, adminController.getAdminPage)

router.post('/skills', adminController.updateSkills)

router.post('/upload', adminController.addNewProduct)

module.exports = router
