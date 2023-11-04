const { body } = require('express-validator');
const validateLoanData = [
    body('customer_id').isInt({ min: 0 }).notEmpty(),
    body('loan_amount').isFloat({ min: 0 }).notEmpty(),
    body('tenure').isInt({ min: 0 }).notEmpty(),
    body('interest_rate').isFloat({ min: 0 }).notEmpty(),
    body('monthly_payment').isFloat({ min: 0 }).notEmpty(),
];

const Loan = {
    customer_id: null,
    loan_id: null,
    loan_amount: 0.0,
    tenure: 0,
    interest_rate: 0.0,
    emi: 0,
    emi_paid: 0,
    start_date: null,
    end_date: null,
    created_at: null,
    updated_at: null
};

module.exports = { Loan, validateLoanData };
