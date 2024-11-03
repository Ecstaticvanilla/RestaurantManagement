const express = require('express');
const router = express.Router();
const db = require('../db'); 

router.get('/', (req, res) => {
    db.query('SELECT * FROM menuitems', (err, results) => {
        if (err) throw err;
        res.render('menuitems', { items: results });
    });
});

router.get('/new', (req, res) => {
    res.render('newMenuItem');
});

router.post('/', (req, res) => {
    const { name, description, price } = req.body;
    db.query('INSERT INTO menuitems (name, description, price) VALUES (?, ?, ?)', [name, description, price], (err) => {
        if (err) throw err;
        res.redirect('/menuitems');
    });
});

router.get('/edit/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM menuitems WHERE menu_item_id = ?', [id], (err, results) => {
        if (err) throw err;
        res.render('editMenuItem', { item: results[0] });
    });
});

router.post('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;
    db.query('UPDATE menuitems SET name = ?, description = ?, price = ? WHERE menu_item_id = ?', [name, description, price, id], (err) => {
        if (err) throw err;
        res.redirect('/menuitems');
    });
});

router.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM menuitems WHERE menu_item_id = ?', [id], (err) => {
        if (err) throw err;
        res.redirect('/menuitems');
    });
});

module.exports = router;
