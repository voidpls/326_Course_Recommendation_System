const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/course_progress_controller.js');

router.get('/:userId', ctrl.getProgress);

// // GET /course-details/:courseId
// router.get('/:courseId', ctrl.getDetails);

// // POST /course-details
// router.post('/', ctrl.createDetails);

// // PUT /course-details/:courseId
// router.put('/:courseId', ctrl.updateDetails);

// // DELETE /course-details/:courseId
// router.delete('/:courseId', ctrl.deleteDetails);

module.exports = router;
