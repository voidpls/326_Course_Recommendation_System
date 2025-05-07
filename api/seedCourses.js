const fs = require('fs');
const db = require('./db');
const path = require("path");

const courses = require('../src/Services/course-details-page/sorted_full_course_list.json');

db.serialize(() => {
    const stmt = db.prepare(`
    INSERT OR IGNORE INTO courses (code,title) VALUES (?,?)
  `);
    for (const c of courses) {
        stmt.run(c.code, c.title);
    }
    stmt.finalize(() => {
        console.log('✅ Courses seeded');
        process.exit();
    });
});
