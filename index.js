const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const menuItemsRoutes = require('./routes/menuitems');
const customersRoutes = require('./routes/customers');
const orderRoutes = require('./routes/orders');
const db = require('./db');

const app = express();
const PORT = 3000;


db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/menuitems', menuItemsRoutes);
app.use('/customers', customersRoutes);
app.use('/orders', orderRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
