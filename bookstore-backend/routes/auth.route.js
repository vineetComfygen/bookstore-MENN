const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model'); // Corrected path if necessary
const { register, login } = require('../controllers/authController');

const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save new user
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/login' , async (req,res) => {
    try {
        const { email, password } = req.body;

        //check if use exists
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found '});

        //validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) return res.status(400).json({ message: 'Invalid Credentials' });

        //Generate JWT token 
        const token = jwt.sign({ id: user,_id }, process.env.JWT_SECRET, { expiresIn: '1D' });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error'});
    }
});

module.exports = router;