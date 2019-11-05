const express = require('express');

const User = require('../models/user');
const Course = require('../models/course');
const Course_Studnets = require('../models/course_students');

exports.getAdmin = (req,res)=>{
    if(req.session.isAuth == null){
        res.redirect('/home')
    }
    else{
        res.render('admin_dashboard',{path:'/home', docTitle:'Dashboard',name:'',email:'',password:''});
    }
    
}

exports.AddUser = (req,res)=>{
    if(req.session.isAuth == true && req.session.user.type == 'adm'){
        var name     = req.body.name;
        var email    = req.body.email;
        var password = req.body.password;
        var type     = req.body.type;
        var sex      = req.body.sex;
        const u = new User(name,email,password,type,sex);
        u.save(id =>{
            if(id == -1){
                res.render('admin_dashboard.ejs',{path:'/home', docTitle:'Dashboard',name:name,email:email,password:password});
            }
            else{
                res.render('admin_dashboard.ejs',{path:'/home', docTitle:'Dashboard',name:'',email:'',password:''});
            }
        });
    }
    else{
        res.redirect('/home');
    }


}

exports.getUsers = (req,res)=>{
    if(req.session.isAuth == true && req.session.user.type == 'adm'){
        var id = req.session.user.id;
        User.getAll(users=>{
            res.render('user_dashboard',{path:'/users', docTitle:'User Dashboard',users:users, admin_id:id});
        })
    }
    else{
        res.redirect('/home');
        
    }
}

exports.updateUser = (req,res)=>{
    if(req.session.isAuth == true && req.session.user.type == 'adm'){
        var name     = req.body.name;
        var email    = req.body.email;
        var password = req.body.password;
        var type     = req.body.type;
        var sex      = req.body.sex;
        var id       = req.body.id;
        
        if(!type){
            type = req.session.user.type;
        }
        const u = new User(name,email,password,type,sex,id);
        u.update(msg =>{
            if(msg == 'Done'){
                res.redirect('/adm/users');
            }
            else{
                res.redirect('/error');
            }
        });   
    }
    else{
        res.redirect('/home');
        
    }
}

exports.deleteUser = (req,res)=>{
    if(req.session.isAuth == true && req.session.user.type == 'adm'){
        var id       = req.body.id;
        User.delete(id,msg=>{
            if(msg == 'Done'){
                res.redirect('/adm/users');
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

exports.addCourse = (req,res)=>{
    if(req.session.isAuth == true && req.session.user.type == 'adm'){
        var name     = req.body.name;
        var tchr_id  = req.body.tchr_id;
        
        const c = new Course(name,tchr_id);
        c.save(id =>{
            if(id == -1){
                res.redirect('/error');
            }
            else{
                res.redirect('/adm/courses');
            }
        });
    }
    else{
        res.redirect('/home');
    }
}

exports.getCourses = (req,res)=>{
    if(req.session.isAuth == true && req.session.user.type == 'adm'){
        User.getAllTchr(users=>{
            Course.getAll(courses=>{
                res.render('course_dashboard',{path:'/courses', docTitle:'Course Dashboard',users:users,courses:courses});
            });
        })
    }
    else{
        res.redirect('/home');
    }
}

exports.updateCourse = (req,res)=>{
    if(req.session.isAuth == true && req.session.user.type == 'adm'){
        var name    = req.body.name;
        var id      = req.body.id;
        var tchr_id = req.body.tchr_id;
        const c = new Course(name,tchr_id,id);
        c.update(msg =>{
            if(msg == 'Done'){
                res.redirect('/adm/courses');
            }
            else{
                res.redirect('/error');
            }
        });   
    }
    else{
        res.redirect('/home'); 
    }
}

exports.deleteCourse = (req,res)=>{
    if(req.session.isAuth == true && req.session.user.type == 'adm'){
        var id = req.body.id;
        Course.delete(id,msg=>{
            if(msg == 'Done'){
                res.redirect('/adm/courses');
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

exports.courseStudents = (req,res)=>{
    if(req.session.isAuth == true && req.session.user.type == 'adm'){
        var name    = req.body.name;
        var id      = req.body.id;
        Course_Studnets.getCourse_students(id, course_students=>{
            User.getAllStuNotInCourse(id, rest_students=>{
                res.render('course_student',{path:'/course', docTitle:'Course students',name:name, id:id, cstu: course_students, rstu:rest_students});
            })
        })
    }
    else{
        res.redirect('/home');
    }
}

exports.saveCourseStudents = (req,res)=>{
    if(req.session.isAuth == true && req.session.user.type == 'adm'){
        var course_id = req.body.course_id;
        var students = req.body.selected_students;

        Course_Studnets.deleteByCourse(course_id, msg=>{
            if(msg == 'Done'){
                Course_Studnets.save(course_id,students,msg2=>{
                    res.redirect('/adm/courses');
                });
            }
            else{
                res.redirect('/error');
            }
        });
    }
    else{
        res.redirect('/home')
    }
}

