// api/routes/course_profile.js
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/course_profile_controller');
const auth    = require('./middleware_auth');

// apply auth to all course_profile routes
router.use(auth);

// GET /api/course_profile
//    returns the profile for the logged-in user (req.user.id)
router.get('/', ctrl.getProfile);

// PUT /api/course_profile
//    updates the profile for the logged-in user
router.put('/', ctrl.updateProfile);

module.exports = router;
