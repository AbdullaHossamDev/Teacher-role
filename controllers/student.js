const express = require('express');

const Quiz = require('../models/quiz');
const QuizQuestions = require('../models/quiz_questions');

exports.home = (req,res)=>{
    if(req.session.isAuth == true && req.session.user.type == 'stu'){
        const id = req.session.user.id;

        Quiz.getQuizByStu(id,quizzes =>{
            res.render('student_dashboard',{path:'/home', docTitle:'Home', quizzes:quizzes});
        });
    }
    else{
        res.redirect('/home');
    }
}

exports.showQuiz = (req,res)=>{
    if(req.session.isAuth == true && req.session.user.type == 'stu'){
        const quiz_id = req.body.id;
        
        QuizQuestions.getQsAnsText(quiz_id, data=>{
            res.render('show_quiz',{path:'/quiz' , docTitle:'Quiz', data:data})
        })

    }
    else{
        res.redirect('/home');
    }
}