const logger = require('../utils/logger');

const logRequest = (req, res, next) => {
    logger.info('Incoming request', {
        method: req.method,
        url: req.url,
        headers: { ...req.headers, 'authorization': '****' }, // Mask sensitive headers
        body: req.body,
        query: req.query,
        ip: req.ip,
        userAgent: req.headers['user-agent']
    });
    next();
};

const logResponse = (req, res, next) => {
    const originalSend = res.send;
    res.send = function (body) {
        logger.info('Response sent', {
            statusCode: res.statusCode,
            body: body
        });
        originalSend.apply(res, arguments);
    };
    next();
};

module.exports = { logRequest, logResponse };
