const express = require('express')

const loginController = require('../controllers/loginController')

const router = express.Router()

router.get('/', loginController.getLoginPage)

router.post('/', loginController.sendForm)

module.exports = router
