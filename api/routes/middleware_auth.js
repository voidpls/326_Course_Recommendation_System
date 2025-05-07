// api/routes/middleware_auth.js

// Session-based auth middleware
module.exports = function(req, res, next) {
    if (req.session && req.session.user) {
        // req.session.user set at login
        req.user = {
            id:       req.session.user.id,
            username: req.session.user.username
        };
        return next();
    }
    return res.status(401).json({ error: 'Not authenticated' });
};
