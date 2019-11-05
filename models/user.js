const sqlite3 = require('sqlite3').verbose();

function openDB(){
    //return new sqlite3.Database('../database/crm_ass.db',(err) => {
    return new sqlite3.Database('./crm_ass.db',(err) => {
        if (err) {
            console.error('0 ',err.message);
        }
      });

}

function closeDB(db){
    db.close((err) => {
        if (err) {
           console.error(err.message);
        }
      });
}

module.exports = class User{
    constructor(name, email,password, type,sex,id = -1){
        this.name       = name;
        this.email      = email;
        this.password   = password;
        this.type       = type;
        this.sex        = sex;
        this.id         = id;
    }

    save(callback){
        var db = openDB();
        var id = -1;
        db.serialize(()=>{
            var stmt ="insert into user(name,email,password,type,sex) values('"+this.name+"','"+this.email+"','"+this.password+"','"+this.type+"','"+this.sex+"')";
            
            db.run(stmt, function(err) {
                if (err) {console.log(err.message);callback(-1);}
                else{
                    id = this.lastID;
                    callback(id);
                }
            }); 
        });
        closeDB(db);
    }

    static getUser(email, password, callback){
        var db = openDB();
        db.serialize(()=>{
            db.get("select * from user where lower(email)= lower('"+email+"') and password= '"+password+"'",(err,row) => {
                if(err){
                    console.log('1 ',err);
                }
                callback(row);
            });
        });
        closeDB(db);
    }   

    static getAll(callback){
        var db = openDB();
        db.serialize(()=>{
            db.all("select * from user",(err,row) => {
                if(err){
                    console.log(err);
                }
                callback(row);   
            });
        });
        closeDB(db);
    }

    static getAllTchr(callback){
        var db = openDB();
        db.serialize(()=>{
            db.all("select * from user where type='tch'",(err,row) => {
                if(err){
                    console.log(err);
                }
                callback(row);   
            });
        });
        closeDB(db);
    }

    static getAllStuNotInCourse(course_id,callback){
        var db = openDB();
        db.serialize(()=>{
            db.all("select id,name from user where type='stu' and id not in (select u.id from course_students cs, user u where u.id = cs.stu_id and cs.course_id = "+course_id+")",(err,row) => {
                if(err){
                    console.log(err);
                }
                callback(row);  
            });
        });
        closeDB(db);
    }

    update(callback){
        var db = openDB();
        db.serialize(()=>{
            var stmt ="update user set name='"+this.name+"',email ='"+this.email+"',password='"+this.password+"',type='"+this.type+"',sex='"+this.sex+"' where id="+this.id;
            db.run(stmt, function(err) {
                if (err) {console.log(err.message);callback('Not done');}
                else{callback('Done');}
            }); 
        });
        closeDB(db);
    }

    static delete(id, callback){
        var db = openDB();
        db.serialize(()=>{
            var stmt ="delete FROM user where id="+id;
            db.run(stmt, function(err) {
                if (err) {console.log(err.message);callback('Not done');}
                else{callback('Done');}
            });  
        });
        closeDB(db);
    }
}
