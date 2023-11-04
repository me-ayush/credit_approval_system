const express = require('express');
const loanRouter = express.Router();

loanRouter.get('/create-loan', (req, res) => {
    res.send('create-loan');
});

loanRouter.get('/view-loan/:loan_id', (req, res) => {
    res.send('/view-loan/loan_id');
});

loanRouter.get('/make-payment/:customer_id/:loan_id', (req, res) => {
    res.send('/view-loan/loan_id');
});

loanRouter.get('/view-statement/:customer_id/:loan_id', (req, res) => {
    res.send('/view-loan/loan_id');
});


module.exports = loanRouter;