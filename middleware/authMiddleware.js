const Session = require('../models/session');
const logger = require('../utils/logger');


// This is a simple example for superuser auth middleware
const superUserCredentials = {
    username: "admin",
    password: "password"
};

const superUserAuth = (req, res, next) => {
    const { username, password } = req.headers;

    if (username === superUserCredentials.username && password === superUserCredentials.password) {
        return next();
    }

    return res.status(401).json({ message: "Unauthorized access." });
};

const validateSession = (req, res, next) => {
    const session_key = req.headers['session-key'];

    if (!Session.isValid(session_key)) {
        logger.warn('Invalid or expired session attempt', {
            session_key: session_key.substring(0, 8) + '...'
        });
        return res.status(401).json({ message: 'Invalid or expired session' });
    }

    next();
};

module.exports = { superUserAuth, validateSession };
