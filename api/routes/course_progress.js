const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/course_progress_controller.js');

router.get('/:userId', ctrl.getProgress);

router.post('/', ctrl.setProgress);


// // PUT /course-details/:courseId
// router.put('/:courseId', ctrl.updateDetails);

// // DELETE /course-details/:courseId
// router.delete('/:courseId', ctrl.deleteDetails);

module.exports = router;
