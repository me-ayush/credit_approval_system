const express = require('express');
const { registerCustomer } = require('../services/user');
const { registerCustomerValidation } = require('../models/customer');
const { validationResult } = require('express-validator');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.post('/register', registerCustomerValidation, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        registerCustomer(req, res);
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

router.get('/check-eligibility', (req, res) => {
    res.send('check-eligibility');
});

router.get('/create-loan', (req, res) => {
    res.send('create-loan');
});

router.get('/view-loan/:loan_id', (req, res) => {
    res.send('/view-loan/loan_id');
});

router.get('/make-payment/:customer_id/:loan_id', (req, res) => {
    res.send('/view-loan/loan_id');
});

router.get('/view-statement/:customer_id/:loan_id', (req, res) => {
    res.send('/view-loan/loan_id');
});

module.exports = router;