// api/server.js
require('dotenv').config();
const express       = require("express");
const session       = require("express-session");
const cors          = require('cors');
const path          = require('path');
const bcrypt        = require('bcrypt');
const db            = require('./db');

const authRoutes    = require('./routes/auth');
const profileRoutes = require('./routes/course_profile');
const detailsRouter = require('./routes/course_details');
const progressRouter= require('./routes/course_progress');
const reviewsRouter = require('./routes/course_reviews');

const app  = express();
const PORT = 3000

// ── Global middleware ─────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Session middleware ────────────────────────────────────────────────────────
app.use(session({
    name:              'sid',
    secret:            process.env.SESSION_SECRET || 'your-super-secret',
    resave:            false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));
// ── Mount auth & profile routes ───────────────────────────────────────────────
app.use('/api/auth',           authRoutes);
app.use('/api/course_profile', profileRoutes);

// ── Serve static (SPA) ───────────────────────────────────────────────────────
app.use(
    express.static(path.join(__dirname, '../src'), {
        index: 'login.html'
    })
);

// —————————————
// 2️⃣ Database setup (users.db in project root)
// —————————————


// ── Signup endpoint ───────────────────────────────────────────────────────────
app.post('/api/signup', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    db.get(`SELECT 1 FROM users WHERE username = ?`, [username], (err, row) => {
        if (err) {
            console.error('Signup SELECT error:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        if (row) {
            return res.status(400).json({ success: false, message: 'Username already taken.' });
        }

        bcrypt.hash(password, 10)
            .then(hash => {
                db.run(
                    `INSERT INTO users (username, password_hash) VALUES (?, ?)`,
                    [username, hash],
                    function(err) {
                        if (err) {
                            console.error('Signup INSERT error:', err);
                            return res.status(500).json({ success: false, message: 'Could not create account.' });
                        }
                        res.status(201).json({ success: true, message: 'Account created.' });
                    }
                );
            })
            .catch(e => {
                console.error('Signup bcrypt error:', e);
                res.status(500).json({ success: false, message: 'Encryption error.' });
            });
    });
});

// ── Login endpoint ────────────────────────────────────────────────────────────
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    db.get(
        `SELECT id, password_hash AS password FROM users WHERE username = ?`,
        [username],
        async (err, row) => {
            if (err) {
                console.error('Login SELECT error:', err);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            if (!row) {
                return res.status(400).json({ success: false, message: 'User not found.' });
            }

            try {
                const match = await bcrypt.compare(password, row.password);
                if (!match) {
                    return res.status(400).json({ success: false, message: 'Invalid password.' });
                }

                // ← store both id and username in session
                req.session.user = { id: row.id, username };
                res.json({ success: true });
            } catch (e) {
                console.error('Login bcrypt compare error:', e);
                res.status(500).json({ success: false, message: 'Authentication error.' });
            }
        }
    );
});
// ── Logout endpoint ───────────────────────────────────────────
app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: 'Logout failed' });
        // clear the cookie in the browser
        res.clearCookie('sid');
        res.json({ success: true });
    });
});
// 1️⃣ custom root handler
app.get('/', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, '../src/index.html'));
    } else {
        res.sendFile(path.join(__dirname, '../src/login.html'));
    }
});

// ── Other routers ─────────────────────────────────────────────────────────────
app.use('/course-details',  detailsRouter);
app.use('/course-progress', progressRouter);
app.use('/course-reviews',  reviewsRouter);
app.use('/course-profile',  profileRoutes);
const recommendationsRouter  = require('./routes/recommendations')
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
