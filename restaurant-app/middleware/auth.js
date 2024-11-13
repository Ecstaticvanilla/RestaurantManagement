// middleware/auth.js
function isAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        return next(); // User is authenticated, proceed to the next middleware/route handler
    }
    req.session.returnTo = req.originalUrl; // Store original URL to redirect after login
    res.redirect('/login'); // Redirect to login if not authenticated
}

module.exports = isAuthenticated;

