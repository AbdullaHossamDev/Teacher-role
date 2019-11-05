const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');

router.get('/',adminController.getAdmin);

router.post('/add-user',adminController.AddUser);

router.get('/users', adminController.getUsers);

router.post('/user-update', adminController.updateUser);

router.post('/user-delete', adminController.deleteUser);

router.get('/courses', adminController.getCourses);

router.post('/add-course', adminController.addCourse);

router.post('/course-update', adminController.updateCourse);

router.post('/course-students', adminController.courseStudents);

router.post('/save-studnets', adminController.saveCourseStudents);

router.post('/course-delete', adminController.deleteCourse);

module.exports = router;