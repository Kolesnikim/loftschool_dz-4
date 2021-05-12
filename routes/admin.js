const express = require('express')

const adminController = require('../controllers/adminController')

const router = express.Router()

router.get('/', adminController.isAdmin, adminController.getAdminPage)

router.post('/skills', adminController.updateSkills)

router.post('/upload', adminController.addNewProduct)

module.exports = router
