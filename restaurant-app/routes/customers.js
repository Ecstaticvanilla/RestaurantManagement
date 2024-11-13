const express = require('express');
const router = express.Router();
const db = require('../db'); 
// const isAuthenticated = require('../middleware/auth');

// router.use(isAuthenticated); 

// Get all customers
router.get('/', (req, res) => {
    db.query('SELECT * FROM customers', (err, results) => {
        if (err) throw err;
        res.render('customers', { customers: results });
    });
});

// New customer form
router.get('/new', (req, res) => {
    res.render('newCustomer');
});

// Add new customer
router.post('/',(req, res) => {
    const { first_name, last_name, email, phone_number } = req.body;
    db.query('INSERT INTO customers (first_name, last_name, email, phone_number) VALUES (?, ?, ?, ?)', 
    [first_name, last_name, email, phone_number], (err) => {
        if (err) throw err;
        res.redirect('/customers');
    });
});

// Edit customer form
router.get('/edit/:id', (req, res) => {
    const customerId = req.params.id;
    db.query('SELECT * FROM customers WHERE customer_id = ?', [customerId], (err, results) => {
        if (err) throw err;
        res.render('editCustomer', { customer: results[0] });
    });
});

// Handle editing a customer
router.post('/edit/:id', (req, res) => {
    const customerId = req.params.id;
    const { first_name, last_name, email, phone_number } = req.body;
    db.query('UPDATE customers SET first_name = ?, last_name = ?, email = ?, phone_number = ? WHERE customer_id = ?', 
    [first_name, last_name, email, phone_number, customerId], (err) => {
        if (err) throw err;
        res.redirect('/customers');
    });
});

// Delete customer
router.post('/delete/:id', (req, res) => {
    const customerId = req.params.id;
    db.query('DELETE FROM customers WHERE customer_id = ?', [customerId], (err) => {
        if (err) throw err;
        res.redirect('/customers');
    });
});


// Get customer order history
// In customers.js

// View Orders (Already Present)
router.get('/orders/:id', (req, res) => {
    const customerId = req.params.id;
    db.query('SELECT * FROM orders WHERE customer_id = ?', [customerId], (err, orders) => {
        if (err) throw err;

        // Fetch customer details
        db.query('SELECT * FROM customers WHERE customer_id = ?', [customerId], (err, customer) => {
            if (err) throw err;
            res.render('orderHistory', { orders, customer: customer[0] });
        });
    });
});

// Assign Order (Create a new route)
router.post('/assign/:customerId',(req, res) => {
    const customerId = req.params.customerId;
    const { orderId } = req.body; // Assume order ID is sent in the request body

    db.query('UPDATE orders SET customer_id = ? WHERE order_id = ?', [customerId, orderId], (err) => {
        if (err) throw err;
        res.redirect(`/customers/orders/${customerId}`);
    });
});

module.exports = router;
