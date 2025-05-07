const path    = require('path');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(path.join(__dirname, 'users.db'), err => {
    if (err) console.error(err);
    else     console.log('✅ SQLite DB opened');
});

// on startup, ensure our tables exist
db.serialize(() => {
    // users
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
                                             id               INTEGER PRIMARY KEY AUTOINCREMENT,
                                             username         TEXT    UNIQUE NOT NULL,
                                             password_hash    TEXT    NOT NULL,
                                             name             TEXT    NOT NULL,
                                             email            TEXT    UNIQUE,
                                             phone            TEXT,
                                             graduation_year  TEXT,
                                             interests        TEXT,
                                             preferred_contact TEXT,
                                             created_at       DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // courses
    db.run(`
        CREATE TABLE IF NOT EXISTS courses (
                                               id         INTEGER PRIMARY KEY AUTOINCREMENT,
                                               code       TEXT    UNIQUE NOT NULL,
                                               title      TEXT    NOT NULL,
                                               created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // user↔course join
    db.run(`
        CREATE TABLE IF NOT EXISTS user_courses (
                                                    user_id     INTEGER NOT NULL,
                                                    course_id   INTEGER NOT NULL,
                                                    enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                                    PRIMARY KEY (user_id, course_id),
                                                    FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
                                                    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
        );
    `);
});

module.exports = db;
