const crypto = require('crypto');

const User = require('../models/user');
const Session = require('../models/session');

const logger = require('../utils/logger');

const generateSessionKey = () => {
    return crypto.randomBytes(16).toString('hex');
};

const createUser = (req, res) => {
    const { mobile, username } = req.body;

    let user = User.findByMobile(mobile);

    if (!user) {
        user = User.create(mobile, username);
        logger.info('New user created', {
            user_id: user.id
        });
    }

    const activeSessions = Session.findActiveByUserId(user.id);

    if (activeSessions.length > 0) {
        const lastSession = activeSessions[activeSessions.length - 1];
        Session.invalidateSession(lastSession.id);

        logger.info('Previous session invalidated', {
            user_id: user.id,
            invalidated_session_id: lastSession.id
        });
    }

    const sessionKey = generateSessionKey();
    const newSession = Session.create(user.id, sessionKey, req.headers['user-agent'], req.ip);

    logger.info('New session created', {
        user_id: user.id,
        session_key: sessionKey
    });

    res.json({
        mobile_number: user.mobile_number,
        user_name: user.user_name,
        activeSession: sessionKey,
    });
};

const getUser = (req, res) => {
    const { mobile } = req.query;
    const session_key = req.headers['session-key'];

    if (!Session.checkForInvalidation(session_key)) {
        logger.warn('Invalid session attempt', {
            session_key: session_key.substring(0, 8) + '...'
        });
        return res.status(401).json({ message: 'there is already session up and running, please logout and login again' });
    }

    const user = User.findByMobile(mobile);

    if (!user) {
        logger.warn('User not found', { mobile });
        return res.status(404).json({ message: 'User not found' });
    }

    const activeSessions = Session.findActiveByUserId(user.id);

    res.json({
        mobile_number: user.mobile_number,
        user_name: user.user_name,
        activeSession: activeSessions.length > 0 ? activeSessions[0].session_key : null,
        sessions: Session.getAllSessionsByUserId(user.id).filter(s => s.expired || s.invalidate).map(s => (s.session_key))
    });
};

module.exports = { createUser, getUser };
