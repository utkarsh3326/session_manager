const express = require('express');
const router = express.Router();
const { createUser, getUser } = require('../controllers/user');
const { superUserAuth, validateSession } = require('../middleware/authMiddleware');
const { logRequest, logResponse } = require('../middleware/loggerMiddleware');

// Log requests and responses
router.use(logRequest);
router.use(logResponse);

// Route to create a new user and session
router.post('/createUser', superUserAuth, createUser);

// Route to fetch user and session details by mobile number
router.get('/getUser', superUserAuth, validateSession, getUser);

module.exports = router;
