const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/course_reviews_controller.js');

// // GET /course-reviews/reviews/:courseID
router.get('/reviews/:courseID', ctrl.getReviews);

// // POST /course-reviews/review
router.post('/review', ctrl.createReview);

// // PUT /course-reviews/:courseId
// router.put('/:courseId', ctrl.updateDetails);

// // DELETE /course-reviews/review/:reviewId
router.delete('/review/:reviewId', ctrl.deleteReview);

module.exports = router;
