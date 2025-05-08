const db = require('../db');

exports.getProgress = async (req, res, next) => {
    let { userId } = req.params;
    try {
        userId = parseInt(userId)
        const user = await databaseGetProgress(userId)
        if (!user) return res.status(200).json({success: false, error: "User does not exist"})

        res.status(200).json({
            userId, 
            courseProgress: JSON.parse(user.course_progress),
            courses: JSON.parse(user.courses),
            success: true
        })
    } catch (err) {
        res.status(500).json({success: false, error: err.message})
        next(err)
    }
}

exports.setProgress = async (req, res, next) => {
    let { userId, courseProgress, courses } = req.body
    try {
        console.log(req.body)
        userId = parseInt(userId)
        
        const dbStatus = await databaseSetProgress(userId, courseProgress, courses)
        if (!dbStatus) res.status(500).json({success: false, error: "Could not set progress in DB"})
        else res.status(200).json({success: true})
    } catch (err) {
        res.status(500).json({success: false, error: err.message})
        next(err)
    }
}

exports.deleteProgress = async (req, res, next) => {
    let { userId } = req.params;
    try {
        userId = parseInt(userId)
        
        const dbStatus = await databaseSetProgress(userId, null, null)
        if (!dbStatus) res.status(500).json({success: false, error: "Could not delete progress in DB"})
        else res.status(200).json({success: true})
    } catch (err) {
        res.status(500).json({success: false, error: err.message})
        next(err)
    }
}

function databaseSetProgress(userId, courseProgress, courses) {
    const courseProgresStr = courseProgress ? JSON.stringify(courseProgress) : null
    const coursesStr = courses ? JSON.stringify(courses) : null
    
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE users
             SET course_progress   = ?,
                 courses           = ?
             WHERE id = ?`,
            [
                courseProgresStr,
                coursesStr,
                userId
            ],
            err => {
                if (err) {
                    console.error(err)
                    reject(err)
                } else resolve(true)
            }
        );
    })
}

function databaseGetProgress(userId) {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT course_progress,
                    courses
             FROM users
             WHERE id = ?`,
            [
                userId
            ],
            (err, user) => {
                if (err) {
                    console.error(err)
                    reject(err)
                } else resolve(user)
            }
        );    
    })
}