const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const menuItemsRoutes = require('./routes/menuitems');
const customersRoutes = require('./routes/customers');
const orderRoutes = require('./routes/orders');
const loginRoutes = require('./routes/login');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(session({
        secret: 'your_secret_key',  // Replace with a secure key
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }  // Use `true` if using HTTPS
    }));
    

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
;

app.use('/menuitems', menuItemsRoutes);
app.use('/customers', customersRoutes);
app.use('/orders', orderRoutes);
app.use('/login', loginRoutes);

app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 

app.use(session({
    secret: 'key', 
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



