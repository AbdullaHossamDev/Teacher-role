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

module.exports = class Question{
    constructor(text, tchr_id, course_id, id = -1){
        this.text       = text;
        this.tchr_id    = tchr_id;
        this.course_id  = course_id;
        this.id         = id;
    }

    save(callback){
        const db = openDB();
        var id = -1;
        db.serialize(()=>{
            var stmt ="insert into question(text,tchr_id,course_id) values('"+this.text+"','"+this.tchr_id+"', '"+this.course_id+"')";
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

    static getQuestion(id, callback){
        const db = openDB();
        db.serialize(()=>{
            
            db.get("select * from question where id= "+id,(err,row) => {
                if(err){
                    console.log('1 ',err);
                }
                callback(row);
            });
        });
        closeDB(db);
    }

    static getAll(tchr_id,callback){
        const db = openDB();
        db.serialize(()=>{
            db.all("select q.*, c.name c_name from question q,course c where q.course_id = c.id and q.tchr_id ="+tchr_id+" order by c.name",(err,row) => {
                if(err){
                    console.log(err);
                }
                callback(row);    
            });
        });
        closeDB(db);
    }

    static getAllForQuiz(tchr_id, course_id, quiz_id ,callback){
        const db = openDB();
        db.serialize(()=>{
            db.all(`select distinct(q.id), q.*, c.name c_name ,a.id a_id, a.text a_text, a.type a_type
                    from question q,course c ,answer_question_quiz qq ,answer a
                    where q.tchr_id =`+tchr_id+`
                    and q.course_id = c.id 
                    and c.id = `+course_id+`
                    and a.qs_id = q.id
                    and q.id not in (
                                select qs_id 
                                from answer_question_quiz 
                                where quiz_id = `+quiz_id+` )
                    order by c.name`,(err,row) => {
                if(err){
                    console.log(err);
                }
                callback(row);    
            });
        });
        closeDB(db);
    }

    static getAllQsForCourse(tchr_id,course_id,callback){
        const db = openDB();
        db.serialize(()=>{
            db.all("select q.*, c.name c_name from question q,course c where q.course_id = c.id and q.tchr_id ="+tchr_id+" and q.course_id ="+course_id,(err,row) => {
                if(err){
                    console.log(err);
                }
                callback(row);    
            });
        });
        closeDB(db);
    }

    update(callback){
        const db = openDB();
        db.serialize(()=>{
            var stmt ="update question set text='"+this.text+"' where id="+this.id;
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
            var stmt ="delete FROM question where id="+id;
            db.run(stmt, function(err) {
                if (err) {console.log(err.message);callback('Not done');}
                else{callback('Done');}
            });  
        });
        closeDB(db);
    }
}
