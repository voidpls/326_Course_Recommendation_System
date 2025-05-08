let reviewData = {fake: 'data'}
const db = require('../db');

exports.getReviews = async (req, res, next) => {
  const courseId = req.params.courseID;  
  db.all(
    `SELECT title, rating, professor, mand_attendance, grade, desc FROM reviews WHERE id = ?`,
    [courseId],
    (err, review) => {
      if (err) return next(err);
      res.json(review);
  }
  )
};

exports.createReview = async (req, res, next) => {
  let review = req.body;
  console.log(review)
  db.run(
    `INSERT INTO reviews (title, rating, professor, mand_attendance, grade, desc, user_id, course_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
    [review.title, review.rating, review.professor, review.attendance, review.grade, review.desc, 1, 1],
    function (err) {
      if (err) return next(err);
      res.json({success: true});
    }
  )
};

exports.deleteReview = async (req, res, next) => {
  const { reviewId } = req.params; 
  try {
      reviewData = {}; 
      res.json({ message: 'Profile deleted successfully', id: reviewId});
  } catch (err) {
      next(err);
  }
};