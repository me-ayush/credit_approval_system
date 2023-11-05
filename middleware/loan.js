const { body } = require('express-validator');
const validateLoanData = [
    body('customer_id').isInt({ min: 0 }).notEmpty(),
    body('loan_amount').isFloat({ min: 0 }).notEmpty(),
    body('tenure').isInt({ min: 0 }).notEmpty(),
    body('interest_rate').isFloat({ min: 0 }).notEmpty(),
    body('monthly_payment').isFloat({ min: 0 }).notEmpty(),
];

const validateProcessLoanData = [
    body('customer_id').isInt({ min: 0 }).notEmpty(),
    body('loan_amount').isFloat({ min: 0 }).notEmpty(),
    body('tenure').isInt({ min: 0 }).notEmpty(),
    body('interest_rate').isFloat({ min: 0 }).notEmpty(),
];

module.exports = { validateLoanData, validateProcessLoanData };