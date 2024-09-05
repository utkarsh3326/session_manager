let sessions = []; // In-memory storage for simplicity

const Session = {
    create: (user_id, session_key, user_agent, ip_address) => {
        const session = {
            id: sessions.length + 1,
            user_id,
            session_key,
            user_agent,
            ip_address,
            created_at: new Date(),
            expired: false
        };
        sessions.push(session);
        return session;
    },
    findActiveByUserId: (user_id) => {
        return sessions.filter(s => s.user_id === user_id && !s.expired && !s.invalidate);
    },
    invalidateSession: (session_id) => {
        const session = sessions.find(s => s.id === session_id);
        if (session) session.invalidate = true;
    },
    getAllSessionsByUserId: (user_id) => {
        return sessions.filter(s => s.user_id === user_id);
    },
    isValid: (session_key) => {
        const session = sessions.find(s => s.session_key === session_key);
        return session && !session.expired;
    },
    checkForInvalidation: (session_key) => {
        const session = sessions.find(s => s.session_key === session_key);
        return session && !session.invalidate;
    }
};

module.exports = Session;
