const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const  verifytoken = require('../middleware/authMiddleware.js');

router.get('/me', verifytoken, getMe);

router.post('/register', register);

router.post('/login', login);

module.exports = router;
