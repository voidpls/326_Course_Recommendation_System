const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/course_details_controller.js');

// // GET /course-details
 router.get('/', ctrl.getDetails);
 // // GET /course-details/ratingAvg/:courseId
 router.get('/ratingAvg/:courseId', ctrl.getAvg);

// // POST /course-details
// router.post('/', ctrl.createDetails);

// // PUT /course-details/:courseId
// router.put('/:courseId', ctrl.updateDetails);

// // DELETE /course-details/:courseId
// router.delete('/:courseId', ctrl.deleteDetails);

module.exports = router;
