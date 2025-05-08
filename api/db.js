const path    = require('path');
const sqlite3 = require('sqlite3').verbose();
const seed = require("./seedCourses")

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
                                             name             TEXT,
                                             email            TEXT    UNIQUE,
                                             phone            TEXT,
                                             graduation_year  TEXT,
                                             interests        TEXT,
                                             preferred_contact TEXT,
                                             courses          TEXT,    -- JSON.stringify array of codes
                                             course_progress  TEXT,    -- JSON.stringify object
                                             created_at       DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
    db.run(`ALTER TABLE users ADD COLUMN name TEXT NOT NULL DEFAULT ''`, err => {
        // ignore “duplicate column” errors:
        if (err && !/duplicate column/.test(err.message)) console.error(err);
    });
    db.run(`
        CREATE TABLE IF NOT EXISTS reviews (
                                             id               INTEGER PRIMARY KEY AUTOINCREMENT,
                                             title            TEXT    NOT NULL,
                                             rating           FLOAT    NOT NULL,
                                             professor        TEXT    NOT NULL,
                                             mand_attendance  TEXT    NOT NULL,
                                             grade            FLOAT    NOT NULL,
                                             desc             TEXT    NOT NULL,
                                             created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
                                             user_id          INTEGER NOT NULL,
                                             course_id        INTEGER NOT NULL,
                                             FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
                                             FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
        );
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS courses (
                                               id         INTEGER PRIMARY KEY AUTOINCREMENT,
                                               code       TEXT    UNIQUE NOT NULL,
                                               title      TEXT    NOT NULL,
                                               instructors TEXT, -- JSON.stringify array of intructors
                                               description TEXT,
                                               prerequisites TEXT, -- JSON.stringify array of codes
                                               credits INTEGER,
                                               frequency TEXT,
                                               created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    seed(db)
});

module.exports = db;
