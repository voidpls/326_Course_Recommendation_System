const db      = require('../db');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
require('dotenv').config();

const SALT_ROUNDS = 12;

exports.register = async (req, res) => {
    const { username, password, email } = req.body;
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    db.run(
        `INSERT INTO users (username,password_hash,email) VALUES (?,?,?)`,
        [username, hash, email],
        function(err) {
            if (err) return res.status(400).json({ error: err.message });
            const token = jwt.sign(
                { id: this.lastID, username },
                process.env.JWT_SECRET
            );
            res.json({ token });
        }
    );
};

exports.login = (req, res) => {
    const { username, password } = req.body;
    db.get(
        `SELECT id,password_hash FROM users WHERE username = ?`,
        [username],
        async (err, row) => {
            if (err || !row)
                return res.status(400).json({ error: 'Invalid creds' });
            const ok = await bcrypt.compare(password, row.password_hash);
            if (!ok) return res.status(400).json({ error: 'Invalid creds' });
            const token = jwt.sign(
                { id: row.id, username },
                process.env.JWT_SECRET
            );
            res.json({ token });
        }
    );
};
