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

module.exports = class Course_Students{
    constructor(course_id,stu_id){
        this.course_id = course_id;
        this.stu_id    = stu_id;
    }


    static save(course_id, students,callback){
        const db = openDB();
        
        db.serialize(()=>{
            var stmt = db.prepare("insert into course_students(course_id,stu_id) values(?,?)");
                if(students){
                    if( typeof(students) == 'string'){
                        stmt.run(course_id,students);
                    }   
                    else{
                        for( var i =0;i<students.length;i++){
                            stmt.run(course_id,students[i]);        
                        }
                    }
                }
            stmt.finalize();
        });
        closeDB(db);
        callback('Done');
    }

    static getCourse_students(course_id,callback){
        const db = openDB();
        db.serialize(()=>{
            db.all("select u.id, u.name from course_students cs, user u where u.id = cs.stu_id and cs.course_id= "+course_id,(err,row) => {
                if(err){
                    console.log('1 ',err);
                }
                callback(row);  
            });
        });
        closeDB(db);
    }

    static getStudent_courses(stu_id,callback){
        const db = openDB();
        db.serialize(()=>{
            db.all("select * from course_students cs, course c where c.id = cs.course_id and cs.stu_id= "+stu_id,(err,row) => {
                if(err){
                    console.log('1 ',err);
                }
                callback(row);  
            });
        });
        closeDB(db);
    }

    static deleteByStu(stu_id, callback){
        const db = openDB();
        db.serialize(()=>{
            var stmt ="delete FROM course_students where stu_id="+stu_id;
            db.run(stmt, function(err) {
                if (err) {console.log(err.message);callback('Not done');}
                else{callback('Done');}
            });
        });
        closeDB(db);
    }

    static deleteByCourse(course_id,callback){
        const db = openDB();
        db.serialize(()=>{
            var stmt ="delete FROM course_students where course_id="+course_id;
            db.run(stmt, function(err) {
                if (err) {console.log(err.message);callback('Not done');}
                else{callback('Done');}
            });
        });
        closeDB(db);
    }
}
