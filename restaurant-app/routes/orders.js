const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all orders
router.get('/', (req, res) => {
    db.query('SELECT * FROM orders', (err, results) => {
        if (err) throw err;
        res.render('orders', { orders: results });
    });
});

// Render form to create a new order
router.get('/new', (req, res) => {
    // Fetch customers
    db.query('SELECT * FROM customers', (err, customers) => {
        if (err) throw err;

        // Fetch menu items
        db.query('SELECT * FROM menuitems', (err, menuItems) => {
            if (err) throw err;
            res.render('newOrder', { customers, menuItems });
        });
    });
});

// Create a new order
router.post('/', (req, res) => {
    const { customer_id, status } = req.body;

    if (!customer_id  || !status) {
        return res.status(400).send('Missing required fields');
    }

    db.query('INSERT INTO orders (customer_id, status) VALUES (?, ?)', 
    [customer_id, status], (err, result) => {
        if (err) {
            console.error('Error inserting order:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect(`/orders/${result.insertId}`);
    });
});
// Add items to order
router.post('/:id/items', (req, res) => {
    const orderId = req.params.id;
    const { menu_item_id, quantity } = req.body;

    db.query('SELECT price FROM menuitems WHERE menu_item_id = ?', [menu_item_id], (err, results) => {
        if (err) throw err;
        const price = results[0].price;

        db.query('INSERT INTO orderitems (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)', 
        [orderId, menu_item_id, quantity, price], (err) => {
            if (err) throw err;
            res.redirect(`/orders/${orderId}`);
        });
    });
});
// Get order details
router.get('/:id', (req, res) => {
    const orderId = req.params.id;

    db.query('SELECT * FROM orders WHERE order_id = ?', [orderId], (err, orderResults) => {
        if (err) throw err;
        if (orderResults.length === 0) {
            return res.status(404).send('Order not found');
        }

        db.query('SELECT * FROM orderitems WHERE order_id = ?', [orderId], (err, orderItems) => {
            if (err) throw err;

            // Fetch menu items for adding to the order
            db.query('SELECT * FROM menuitems', (err, menuItems) => {
                if (err) throw err;
                res.render('orderDetails', { order: orderResults[0], orderItems, menuItems });
            });
        });
    });
});

// Delete an order and its order items
router.post('/:id/delete', (req, res) => {
    const orderId = req.params.id;

    // First, delete the order items associated with the order
    db.query('DELETE FROM orderitems WHERE order_id = ?', [orderId], (err) => {
        if (err) {
            console.error('Error deleting order items:', err);
            return res.status(500).send('Internal Server Error');
        }

        // Now, delete the order itself
        db.query('DELETE FROM orders WHERE order_id = ?', [orderId], (err) => {
            if (err) {
                console.error('Error deleting order:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.redirect('/orders'); // Redirect to the orders list after deletion
        });
    });
});

module.exports = router;
module.exports = router;
