const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const path = require("path");

const db = new sqlite3.Database(path.join(__dirname, 'users.db'), err => {
    if (err) console.error(err);
    else     console.log('✅ SQLite DB opened');
});

const courses = require('../src/Services/course-details-page/sorted_full_course_list.json');

db.serialize(() => {
    const stmt = db.prepare(`
    INSERT OR IGNORE INTO courses (code,title,instructors,description,prerequisites,credits,frequency) VALUES (?,?,?,?,?,?,?)
  `);
    for (const c of courses) {
        stmt.run(c.code, c.title, c.instructors, c.description, c.prerequisites, c.credits, c.frequency);
    }
    stmt.finalize(() => {
        console.log('✅ Courses seeded');
    });
});
