const express = require('express');
const router = express.Router();

const studentControllers = require('../controllers/student');

router.get('/', studentControllers.home);

router.post('/show-quiz', studentControllers.showQuiz);

module.exports = router;