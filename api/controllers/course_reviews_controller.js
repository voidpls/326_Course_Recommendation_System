let reviewData = {fake: 'data'}
const db = require('../db');

exports.getReviews = async (req, res, next) => {
  const courseId = req.params.courseID;  
  db.all(
    `SELECT r.title, r.rating, r.professor, r.mand_attendance, r.grade, r.desc FROM reviews r, courses c WHERE c.id = ? AND c.id = r.course_id`,
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
    [review.title, review.rating, review.professor, review.attendance, review.grade, review.desc, review.user_id, review.course_id],
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