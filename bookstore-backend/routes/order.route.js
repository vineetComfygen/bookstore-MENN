const express = require('express');
const Order = require('../models/order.model');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
    try {
        const { books, totalPrice } = req.body;

        const order = new Order({
            user: req.user.id,
            books,
            totalPrice,
        });

        await order.save();

        res.status(201).json({ message: 'Order placed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to place order' });
    }
});

router.get('/user', authenticate, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate('books.book');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

router.get('/', authenticate, isAdmin, async (req, res) => {
    try {
        const orders = await Order.find().populate('books.book');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

module.exports = router;
