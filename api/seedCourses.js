const courses = require('../src/Services/course-details-page/sorted_full_course_list.json');

module.exports = db => {
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
}