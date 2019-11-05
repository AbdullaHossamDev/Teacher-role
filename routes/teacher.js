const express = require('express');
const router = express.Router();

const teacherController = require('../controllers/teacher');

router.get('/', teacherController.home)

router.get('/quizzes', teacherController.getQuizzes);
 
router.post('/add-quiz', teacherController.addQuiz); 

router.post('/edit-quiz', teacherController.editQuiz);

router.post('/delete-quiz', teacherController.deleteQuiz); 

router.post('/save-quiz', teacherController.saveQuiz)

router.get('/questions', teacherController.getQuestions);
 
router.post('/add-question', teacherController.addQuestion);

router.post('/delete-question', teacherController.deleteQuestion);
 
router.post('/edit-question', teacherController.editQuestion);

router.post('/add-answer', teacherController.addAnswer);

router.post('/update-answer', teacherController.updateAnswer);
 
router.post('/delete-answer/:id', teacherController.deleteAnswer);

module.exports = router;