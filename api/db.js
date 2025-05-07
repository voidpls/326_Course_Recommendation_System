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
                                             courses          TEXT,    -- JSON.stringify array of codes
                                             course_progress  TEXT,    -- JSON.stringify object
                                             created_at       DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
    db.run(`ALTER TABLE users ADD COLUMN name TEXT NOT NULL DEFAULT ''`, err => {
        // ignore “duplicate column” errors:
        if (err && !/duplicate column/.test(err.message)) console.error(err);
    });
});

module.exports = db;
