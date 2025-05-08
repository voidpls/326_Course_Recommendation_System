const db = require('../db');

exports.getDetails = async (req, res, next) => {
  db.all(
    `SELECT * FROM courses`,
    (err, courses) => {
      if (err) return next(err);
      res.json(courses);
  }
  )
};

exports.getAvg = async (req, res, next) => {
  const courseId = req.params.courseId;
  db.get(
    `Select AVG(rating) as avg FROM courses c, reviews r WHERE c.id = ? AND c.id = r.course_id`,
    [courseId],
    (err, rating) => {
      if (err) return next(err);
      res.json(rating);
  }
  )
}
    