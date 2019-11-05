const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/', authController.authHome);

router.post('/login', authController.authLogin);

router.get('/profile', authController.profile); 

router.post('/save-user', authController.updateProfile);

router.get('/logout', authController.logout);

module.exports = router;