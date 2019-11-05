const express = require('express');

const User = require('../models/user');

exports.authHome = (req,res)=>{
    if(req.session.isAuth == null){
        res.render('login',{path:'/login',docTitle:'Login'});
    }
    else{
        res.redirect('/home')
    }
}

exports.authLogin = (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    User.getUser(email,password, (user) =>{
        if(!user){
            res.render('Nlogin',{path:'/login',docTitle:'Login'})
        }else{
            req.session.isAuth = true;
            req.session.type = user.type;
            req.session.user = user;
            res.redirect('/home');
        }
    })
}

exports.profile = (req,res)=>{
    if(req.session.isAuth == true){
        res.render('user_profile' ,{path:'/profile', docTitle:'Profile', user:req.session.user});
    }
    else{
        res.redirect('/home');
    }
}

exports.updateProfile = (req,res)=>{
    if(req.session.isAuth == true){
        var id       = req.session.user.id;
        var name     = req.body.name;
        var email    = req.session.user.email;
        var password = req.body.password;
        var type     = req.session.user.type;
        var sex      = req.body.sex;

        const u = new User(name,email,password,type,sex,id);
        req.session.user = u; 
        u.update(msg=>{
            if(msg == 'Done'){
                res.redirect('/auth/profile');
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

exports.logout = (req,res)=>{
    if(req.session.isAuth == true){
        req.session.destroy();
        res.redirect('/home');
    }
    else{
        res.redirect('/home')
    }
}