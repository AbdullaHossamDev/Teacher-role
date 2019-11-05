const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const teacherRoutes = require('./routes/teacher');
const studentRoutes = require('./routes/student');

const app = express();

app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/auth', authRoutes);
app.use('/adm', adminRoutes);
app.use('/tch', teacherRoutes);
app.use('/stu', studentRoutes)
    /*app.use('/', (req,res,next)=>{
        res.render('error',{path:'error',docTitle:'Error'})
    })*/
app.use('/', (req, res, next) => {
    if (req.session.isAuth == null) {
        res.redirect('/auth');
    } else {
        if (req.session.type == 'adm') {
            res.redirect('/adm');
        } else if (req.session.type == 'tch') {
            res.redirect('/tch');
        } else {
            res.redirect('/stu');
        }
    }
    next();
})


app.listen(process.env.PORT || 3000);