// api/controllers/course_profile_controller.js
const db = require('../db');

exports.getProfile = (req, res, next) => {
    const uid = req.user.id;
    db.get(
        `SELECT
             name            AS username,
             email,
             phone,
             graduation_year,
             interests,
             preferred_contact
         FROM users
         WHERE id = ?`,
        [uid],
        (err, user) => {
            if (err) return next(err);

            db.all(
                `SELECT c.code, c.title, uc.enrolled_at
                 FROM user_courses uc
                 JOIN courses c ON c.id = uc.course_id
                 WHERE uc.user_id = ?`,
                [uid],
                (e, courses) => {
                    if (e) return next(e);
                    try {
                        user.interests = JSON.parse(user.interests || '[]');
                    } catch {
                        user.interests = [];
                    }
                    res.json({ user, taken: courses });
                }
            );
        }
    );
};

exports.updateProfile = (req, res, next) => {
    const uid = req.user.id;
    const {
        name,
        email,
        phone,
        gradYear,
        interests,
        contact,
        courseCodes = []
    } = req.body;

    db.serialize(() => {
        // 1) update user (now writing into `name`)
        db.run(
            `UPDATE users
             SET name             = ?,
                 email            = ?,
                 phone            = ?,
                 graduation_year  = ?,
                 interests        = ?,
                 preferred_contact = ?
             WHERE id = ?`,
            [
                name,
                email,
                phone,
                gradYear,
                JSON.stringify(interests || []),
                contact,
                uid
            ]
        );

        // 2) refresh courses
        db.run(`DELETE FROM user_courses WHERE user_id = ?`, [uid]);

        if (courseCodes.length) {
            const placeholders = courseCodes.map(_ => '?').join(',');
            db.all(
                `SELECT id FROM courses WHERE code IN (${placeholders})`,
                courseCodes,
                (e, rows) => {
                    if (e) return next(e);
                    const stmt = db.prepare(
                        `INSERT INTO user_courses (user_id, course_id) VALUES (?, ?)`
                    );
                    for (let { id } of rows) {
                        stmt.run(uid, id);
                    }
                    stmt.finalize(() => res.json({ success: true }));
                }
            );
        } else {
            res.json({ success: true });
        }
    });
};
