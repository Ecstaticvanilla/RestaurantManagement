// routes/login.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const session = require('express-session');
const isAuthenticated = require('../middleware/auth');

// Session configuration (this may already be in app.js)
router.use(session({
    secret: 'key',
    resave: false,
    saveUninitialized: true,
    cookie : true
}));

// Render login page on GET /login
router.get('/', (req, res) => {
    res.render('login'); // Renders "login.ejs" in the views folder
});

// Handle login form submission on POST /login
router.post('/', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    // Query the database to check user credentials
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length === 0) {
            return res.status(401).send('Invalid credentials');
        }

        const user = results[0];

        // Check password match (consider hashing passwords in production)
        if (user.password === password) {
            // Set session variables
            req.session.userId = user.user_id;
            req.session.username = user.username;

            // Redirect to the original intended page or default to index
            const redirectTo = req.session.returnTo || 'http://localhost:5500/restaurant-app/views/index.html'; // Use stored return URL or default
            delete req.session.returnTo; // Clear the returnTo session variable after use
            return res.redirect(redirectTo); // Ensure to return he
        } else {
            return res.status(401).send('Invalid credentials');
        }
    });
});

// Protected route for the index page
router.get('http://localhost:5500/restaurant-app/views/index.html', isAuthenticated, (req, res) => {
    res.render('index.html', { username: req.session.username }); // Render index.ejs and pass username
});

module.exports = router;

