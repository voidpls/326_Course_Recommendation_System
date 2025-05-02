const express = require("express");
const session = require("express-session");
const app = express()
const path = require('path')
const sqlite3   = require("sqlite3").verbose();
const bcrypt  = require('bcrypt');


const PORT = 3000

app.use(express.static(path.join(__dirname, '../src')))
app.use(express.json())

// ——— Session middleware ———
app.use(session({
    name: 'sid',                     // cookie name
    secret: 'your-super-secret',     // change to a strong secret
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// —————————————
// 2️⃣ Database setup (users.db in project root)
// —————————————
const db = new sqlite3.Database(path.join(__dirname, 'users.db'), err => {
    if (err) console.error("❌ Failed to open users.db:", err);
    else       console.log("✅ Connected to users.db");
});

// Create users table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT    UNIQUE,
    password TEXT
  )
`, err => {
    if (err) console.error("❌ Failed to create users table:", err);
});

// —————————————
// 3️⃣ Signup endpoint
// —————————————

// Replace your existing /api/signup handler with this:

app.post('/api/signup', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password are required.'
        });
    }

    // 1️⃣ Check if the username is already taken
    db.get(
        `SELECT 1 FROM users WHERE username = ?`,
        [username],
        (err, row) => {
            if (err) {
                console.error('DB error on SELECT:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Internal server error.'
                });
            }

            if (row) {
                // Already exists → bail out
                return res.status(400).json({
                    success: false,
                    message: 'Username already taken.'
                });
            }

            // 2️⃣ Not taken yet → hash & insert
            bcrypt
                .hash(password, 10)
                .then(hash => {
                    db.run(
                        `INSERT INTO users (username, password) VALUES (?, ?)`,
                        [username, hash],
                        function (err) {
                            if (err) {
                                console.error('DB error on INSERT:', err);
                                return res.status(500).json({
                                    success: false,
                                    message: 'Could not create account.'
                                });
                            }
                            return res.json({
                                success: true,
                                message: 'Account created.'
                            });
                        }
                    );
                })
                .catch(e => {
                    console.error('Hashing error:', e);
                    res.status(500).json({
                        success: false,
                        message: 'Could not process your request.'
                    });
                });
        }
    );
});


// —————————————
// 4️⃣ Login endpoint
// —————————————
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get(
        `SELECT password FROM users WHERE username = ?`,
        [username],
        async (err, row) => {
            if (err) {
                console.error("DB error on SELECT:", err);
                return res.status(500).json({
                    success: false,
                    message: 'Internal server error.'
                });
            }
            if (!row) {
                return res.status(400).json({
                    success: false,
                    message: 'User not found.'
                });
            }
            const match = await bcrypt.compare(password, row.password);
            if (match) {
                // ✅ store login state
                req.session.user = { username };
                res.json({ success: true });
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Invalid password.'
                });
            }
        }
    );
});
// —————————————

// 1️⃣ custom root handler
app.get('/', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, '../src/index.html'));
    } else {
        res.sendFile(path.join(__dirname, '../src/login.html'));
    }
});

// 2️⃣ then serve all other static assets
app.use(express.static(path.join(__dirname, '../src')));

// import routers
const detailsRouter  = require('./routes/course_details')
const progressRouter = require('./routes/course_progress')
const reviewsRouter  = require('./routes/course_reviews')
const profileRouter  = require('./routes/course_profile')
const recommendationsRouter  = require('./routes/recommendations')


// mount routers
app.use('/course-details', detailsRouter);
app.use('/course-progress', progressRouter);
app.use('/course-reviews', reviewsRouter);
app.use('/course-profile', profileRouter);
app.use('/recommendations', recommendationsRouter)

// catch all 404
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// // In-memory storage for demonstration purposes
// let profileData = {};

// // GET: Retrieve profile data
// app.get('/profile', (req, res) => {
//     res.json(profileData);
// });

// // POST: Create new profile data
// app.post('/profile', express.json(), (req, res) => {
//     profileData = req.body;
//     res.status(201).json({ message: 'Profile created successfully', data: profileData });
// });

// // PUT: Update existing profile data
// app.put('/profile', express.json(), (req, res) => {
//     profileData = { ...profileData, ...req.body };
//     res.json({ message: 'Profile updated successfully', data: profileData });
// });

// // DELETE: Delete profile data
// app.delete('/profile', (req, res) => {
//     profileData = {};
//     res.json({ message: 'Profile deleted successfully' });
// });

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))

module.exports = app
