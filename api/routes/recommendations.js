const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/recommendations_controller.js');

// POST /recommendations
router.post('/', ctrl.getRecommendations);

module.exports = router;
