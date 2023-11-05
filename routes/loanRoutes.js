const express = require('express');
const { createLoanController, viewLoanController, makeLoanPaymentController } = require('../controllers/loanController');
const { validateProcessLoanData } = require('../middleware/loan');
const loanRouter = express.Router();

loanRouter.post('/create-loan', validateProcessLoanData, createLoanController);

loanRouter.get('/view-loan/:loan_id', viewLoanController);

loanRouter.post('/make-payment/:customer_id/:loan_id', makeLoanPaymentController);

loanRouter.get('/view-statement/:customer_id/:loan_id', (req, res) => {
    res.send('/view-loan/loan_id');
});


module.exports = loanRouter;