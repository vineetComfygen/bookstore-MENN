const express = require('express');
const Book = require('../models/book.model');
const router = express.Router();
const { getAllBooks, addBook, updateBook, deleteBook } = require('../controllers/booksController');
// const authenticate = require('../middlewares/authenticate');
const { authenticate, isAdmin } = require('../middlewares/authenticate'); // adjust the path as needed
// const isAdmin = require('../middlewares/authenticates');

router.get('/home', async (req, res) => {
    try {
        const books = await Book.find(); //Add pagination here if needed
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({message: 'Failed to fetch books'});
    }
});

router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch book' });
    }
});

router.post('/', authenticate, isAdmin, async (req, res) => {
    try {
        const { title, author, price, category, description, stock, image } = req.body;

        const book = new Book({ title, author, price, category, description, stock, image });
        await book.save();

        res.status(201).json({ message: 'Book added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add book' });
    }
});


module.exports = router;