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

module.exports = class Quiz{
    constructor(tchr_id, course_id, publish='N', id = -1){
        this.course_id  = course_id;
        this.tchr_id    = tchr_id;
        this.publish    = publish;
        this.id         = id;
    }

    save(callback){
        const db = openDB();
        var id = -1;
        db.serialize(()=>{
            var stmt ="insert into quiz(course_id,tchr_id,publish) values("+this.course_id+","+this.tchr_id+",'"+this.publish+"')";
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

    static getQuizByTchr_course(tchr_id, course_id,callback){
        const db = openDB();
        db.serialize(()=>{
            db.all("select * from quiz where tchr_id= "+tchr_id+" and course_id= "+course_id,(err,row) => {
                if(err){
                    console.log('1 ',err);
                }
                callback(row);  
            });
        });
        closeDB(db);   
    }

    static getQuizByTchr(tchr_id, callback){
        const db = openDB();
        db.serialize(()=>{
            db.all("select q.*, c.name c_name from quiz q, course c where q.course_id = c.id and q.tchr_id="+tchr_id+" order by c.name",(err,row) => {
                if(err){
                    console.log('1 ',err);
                }
                callback(row);  
            });
        });
        closeDB(db);   
    }

    static getQuizByStu(stu_id,callback){//for stu
        const db = openDB();
        db.serialize(()=>{
            db.all("select q.* , c.name from quiz q, course c where q.publish = 'Y' and c.id = q.course_id and q.course_id in (select course_id from course_students where stu_id = "+stu_id+")order by c.id",(err,row) => {
                if(err){
                    console.log('1 ',err);
                }
                callback(row);   
            });
        });
        closeDB(db);
        
    }


    static update(id, publish,callback){
        const db = openDB();
        db.serialize(()=>{
            var stmt ="update quiz set publish='"+publish+"' where id="+id;
            db.run(stmt, function(err) {
                if (err) {console.log(err.message);callback('Not done');}
                else{callback('Done');}
            });  
        });
        closeDB(db);
    };

    static delete(id, callback){
        const db = openDB();
        db.serialize(()=>{
            var stmt ="delete FROM quiz where id="+id;
            db.run(stmt, function(err) {
                if (err) {console.log(err.message);callback('Not done');}
                else{callback('Done');}
            }); 
        });
        closeDB(db);
    }
}
