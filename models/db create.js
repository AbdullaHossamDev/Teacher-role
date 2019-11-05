/*const sqlite3 = require('sqlite3').verbose();
 
// open database in memory
let db = new sqlite3.Database('/models/crm_ass.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the chinook database.');
});



db.serialize(function(){
  db.run("insert into user(email, password) values('ahmed.mostafa@gmail.com','123')",(err)=>{
    console.log(err)
  });

  /*db.run("create table user(email varchar2(100), password varchar2(100))",(err)=>{
    console.log(err)
  });
});
//tchr_id number(10) constraint question_tchr_id_fk REFERENCES user(id)
// close the database connection
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});*/









user = `CREATE TABLE user (
	id	INTEGER PRIMARY KEY AUTOINCREMENT,
	name	varchar2 ( 400 ),
	email	varchar2 ( 100 ) UNIQUE,
	password	varchar2 ( 100 ),
	type	varchar2 ( 3 ),
	sex	varchar2 ( 1 )
)`;

course = `CREATE TABLE course (
	id	INTEGER PRIMARY KEY AUTOINCREMENT,
	name	varchar2 ( 400 ) UNIQUE,
	tchr_id	number ( 10 ),
	CONSTRAINT course_tchr_id_fk FOREIGN KEY(tchr_id) REFERENCES user(id) ON DELETE CASCADE
)`;

question = `CREATE TABLE question (
	id	INTEGER PRIMARY KEY AUTOINCREMENT,
	text	varchar2 ( 4000 ),
	tchr_id	number ( 10 ),
	course_id	number ( 10 ),
	CONSTRAINT question_course_id_fk FOREIGN KEY(course_id) REFERENCES course(id) ON DELETE CASCADE,
	CONSTRAINT question_tchr_id_fk FOREIGN KEY(tchr_id) REFERENCES user(id) ON DELETE CASCADE
)`;

answer = `CREATE TABLE answer (
	id	INTEGER PRIMARY KEY AUTOINCREMENT,
	text	varchar2 ( 4000 ),
	qs_id	number ( 10 ),
	type	varchar2 ( 1 ),
	CONSTRAINT answer_qs_id_fk FOREIGN KEY(qs_id) REFERENCES question(id) ON DELETE CASCADE
)`;

quiz = `CREATE TABLE quiz (
	id	INTEGER PRIMARY KEY AUTOINCREMENT,
	course_id	number ( 10 ),
	tchr_id	TEXT,
	publish	varchar ( 1 ),
	CONSTRAINT quiz_course_id_fk FOREIGN KEY(course_id) REFERENCES course(id) ON DELETE CASCADE,
	CONSTRAINT quiz_tchr_id_fk FOREIGN KEY(tchr_id) REFERENCES user(id) ON DELETE CASCADE
)`;

answer_question_quiz = `create table answer_question_quiz (
  ans_id number ( 10 ),
  quiz_id	number ( 10 ),
  qs_id	number ( 10 ),
  CONSTRAINT answer_question_quiz_ans_id_fk FOREIGN KEY(ans_id) REFERENCES answer(id) ON DELETE CASCADE,
	CONSTRAINT answer_question_quiz_qs_id_fk FOREIGN KEY(qs_id) REFERENCES question(id) ON DELETE CASCADE,
	CONSTRAINT answer_question_quiz_quiz_id_fk FOREIGN KEY(quiz_id) REFERENCES quiz(id) ON DELETE CASCADE
)`;

course_student = `create table course_students(
  stu_id number ( 10 ),
  course_id number ( 10 ),
  CONSTRAINT course_student_stu_id_fk FOREIGN KEY(stu_id) REFERENCES user(id) ON DELETE CASCADE,
  CONSTRAINT course_student_course_id_fk FOREIGN KEY(course_id) REFERENCES course(id) ON DELETE CASCADE
)`;



const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('../crm_ass.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the crm_ass database.');
});

db.serialize(function(){
  db.run(user,(err)=>{
    console.log(err)
  });
  db.run(course,(err)=>{
    console.log(err)
  });
  db.run(question,(err)=>{
    console.log(err)
  });
  db.run(answer,(err)=>{
    console.log(err)
  });
  db.run(quiz,(err)=>{
    console.log(err)
  });
  db.run(answer_question_quiz,(err)=>{
    console.log(err)
  });
  db.run(course_student,(err)=>{
    console.log(err);
  });
});
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});