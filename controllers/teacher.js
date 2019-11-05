const express = require('express');

const User = require('../models/user');
const Course = require('../models/course');
const Question = require('../models/question');
const Answer = require('../models/answer');
const Quiz = require('../models/quiz');
const QuizQuestions = require('../models/quiz_questions');

function addExist(quizData,alldata,callback){
    for( var i =0;i<quizData.length ; i++){
        alldata.find(function(element) {
            if (element.id == quizData[i].qs_id){
                var dt = element.answer_text.find(function(item){
                    if(item.id == quizData[i].ans_id){
                        item.exist = true;
                        element.exist = true;
                    }
                })
            }
        });
    }
    callback(alldata);
}
function getAnswersForQuestions(allQS,i, callback){
        if(i == allQS.length){
            callback(allQS);
        }
        else{
            Answer.getAnswerByQs(allQS[i].id, answer_text=>{
                allQS[i].answer_text = answer_text;
                getAnswersForQuestions(allQS,++i,callback);
            });
        }   
}

exports.home = (req,res)=>{
    if(req.session.isAuth == true && req.session.user.type == 'tch'){
        const id= req.session.user.id;
        Course.getCourseByTchr(id,courses=>{
            res.render('teacher_dashboard',{path:'/home',docTitle:'Teacher Home',courses:courses});
        });
    } 
    else{
        res.redirect('/home');
    }
}

exports.getQuizzes = (req,res)=>{
    if(req.session.isAuth == true && req.session.user.type == 'tch'){
        const id= req.session.user.id;
        Quiz.getQuizByTchr(id, quizzes=>{
            Course.getCourseByTchr(id,courses=>{
                res.render('quizzes_dashboard',{path:'/quiz',docTitle:'Teacher quizzes',quizzes:quizzes,courses:courses});
            });
            
        })
    }
    else{
        res.redirect('/home');
    }
}

exports.addQuiz = (req,res)=>{
    if(req.session.isAuth == true && req.session.user.type == 'tch'){
        const tchr_id   = req.session.user.id;
        const course_id = req.body.course_id;

        const q = new Quiz(tchr_id,course_id,'N');
        q.save(id =>{
            if(id == -1){
                res.redirect('/error');
            }
            else{
                res.redirect('/tch/quizzes');
            }
        });
    } 
    else{
        res.redirect('/home');
    }
}

exports.editQuiz = (req,res)=>{
    if(req.session.isAuth == true && req.session.user.type == 'tch'){
        const tchr_id= req.session.user.id;
        const quiz_id= req.body.id;
        const course_id = req.body.course_id;
        const course_name = req.body.course_name;
        const publish = req.body.publish;

        QuizQuestions.getQuestionsByQuiz(quiz_id, its_data=>{
            Question.getAllQsForCourse(tchr_id,course_id, allQS=>{
                getAnswersForQuestions(allQS, 0,questions=>{
                    addExist(its_data,allQS,data=>{
                        res.render('quiz_edit',{path:'/quiz',docTitle:'Edit quiz', data:data, publish:publish, c_name:course_name,quiz_id:quiz_id });
                    })
                });
            })
        });
    } 
    else{
        res.redirect('/home');
    }
}

exports.deleteQuiz = (req,res)=>{
    if(req.session.isAuth == true && req.session.user.type == 'tch'){
        const id =  req.body.id;
        Quiz.delete(id,msg=>{
            if(msg == 'Done'){
                res.redirect('/tch/quizzes');  
            }
            else{
                res.redirect('/error');
            }
        })
    } 
    else{
        res.redirect('/home');
    }
}

exports.saveQuiz = (req,res)=>{
    if(req.session.isAuth == true && req.session.user.type == 'tch'){
        const tchr_id = req.session.user.id;
        const quiz_id = req.body.quiz_id;
        const publish = req.body.publish;

        const qs_ids = req.body.selected_questions;
        const ans_ids= req.body.selected_answers;

        Quiz.update(quiz_id,publish,msg=>{
            if(msg == 'Done'){
                QuizQuestions.deleteByQuiz(quiz_id,msg2=>{
                        QuizQuestions.save(quiz_id,ans_ids,msg3=>{
                            if(msg3 == 'Done'){
                                res.redirect('/tch/quizzes');
                            }else{
                                res.redirect('/error')
                            }
                        }); 
                })
            }else{
                res.redirect('/error')
            }
        })
    } 
    else{
        res.redirect('/home');
    }
}

exports.getQuestions = (req,res)=>{
    if(req.session.isAuth == true && req.session.user.type == 'tch'){
        const id= req.session.user.id;
        Question.getAll(id, questions=>{
            Course.getCourseByTchr(id,courses=>{
                res.render('question_dashboard',{path:'/question',docTitle:'Teacher questions',questions:questions,courses:courses});
            });
        })
    }
    else{
        res.redirect('/home');
    }
}

exports.addQuestion = (req,res)=>{
    if(req.session.isAuth == true && req.session.user.type == 'tch'){
        const tchr_id   = req.session.user.id;
        const course_id = req.body.course_id;
        const text = req.body.text;
        const right= req.body.right;
        const wrong= req.body.wrong;

        
        const qs = new Question(text,tchr_id,course_id)
        qs.save(id =>{
            if(id == -1){
                res.redirect('/error');
            }
            else{
                var answers = [];
                for(let r of right){
                    if(r != ''){
                        var Ranswer = new Answer(r,id,'R');
                        answers.push(Ranswer);
                    }
                }
                for(let w of wrong){
                    if(w != ''){
                        var Wanswer = new Answer(w,id,'W');
                        answers.push(Wanswer);
                    }
                }
                Answer.saveAll(answers,msg =>{
                    if(msg == 'Done'){
                        res.redirect('/tch/questions');
                    }
                    else{
                        res.redirect('/error');
                    }
                })
            }
        });
    } 
    else{
        res.redirect('/home');
    }
}

exports.deleteQuestion = (req,res)=>{
    if(req.session.isAuth == true && req.session.user.type == 'tch'){
        var id = req.body.id;
        Question.delete(id,msg=>{
            if(msg == 'Done'){
                res.redirect('/tch/questions');
            }
            else{
                res.redirect('/error');
            }
        })   
    }
    else{
        res.redirect('/home');
        
    }
}

exports.editQuestion = (req,res)=>{
    if(req.session.isAuth == true && req.session.user.type == 'tch'){
        var tchr_id= req.session.user.id;
        var qs_id = req.body.id;
        var text = req.body.text;
        var course_id = req.body.course_id;
        var course_name = req.body.c_name;
        const q = new Question(text, tchr_id, course_id, qs_id);

        Answer.getAnswerByQs(qs_id, answers=>{
            res.render('answer_dashboard',{path:'/answers', docTitle:'Answers dashboard', question: q, c_name:course_name, answers:answers})
        });

    }
    else{
        res.redirect('/home');
        
    } 
}

exports.addAnswer = (req,res)=>{
    if(req.session.isAuth == true && req.session.user.type == 'tch'){
        req.on('data', function(data) {
            var dt = JSON.parse(data);
            var text = dt.text;
            var qs_id= dt.qs_id;
            var type = dt.type[0];
            var answer = new Answer(text,qs_id,type)
            answer.save(id =>{
                if(id == -1){
                    res.send("false")
                }
                else{
                    res.send("true");
                }
            });
        });
    }
    else{
        res.redirect('/home');
        
    }
}

exports.updateAnswer = (req,res)=>{
    if(req.session.isAuth == true && req.session.user.type == 'tch'){
        const qs_id = req.body.qs_id;
        const qs_text = req.body.question_text;

        const ans_ids = req.body.ans_id;
        const ans_texts=req.body.ans_text;
        const ans_types=req.body.type;
        
        const qs = new Question(qs_text,-1,-1,qs_id);
        qs.update(msg=>{
            Answer.updateAll(ans_ids ,ans_texts, ans_types, msg=>{
                res.redirect('/tch/questions')
            })
        });
    }
    else{
        res.redirect('/home');
    }
}

exports.deleteAnswer = (req,res)=>{
    if(req.session.isAuth == true && req.session.user.type == 'tch'){
        var ans_id = req.params.id;
        
        Answer.delete(ans_id,msg=>{
            if(msg=='Done'){
                res.send('true');
            }
            else{
                res.send('false');
            }
        });
    }
    else{
        res.redirect('/home');
    }
}