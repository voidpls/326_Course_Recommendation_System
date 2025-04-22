const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/course_profile_controller.js');

// GET /course-profile/:userId
router.get('/:userId', ctrl.getProfile);

// POST /course-profile
router.post('/', ctrl.createDetails);

// PUT /course-profile/:userId
router.put('/:userId', ctrl.updateDetails);

// DELETE /course-profile/:userId
router.delete('/:userId', ctrl.deleteDetails);

module.exports = router;
