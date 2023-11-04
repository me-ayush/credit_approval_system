const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.get('/register', (req, res) => {
    res.send('register');
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