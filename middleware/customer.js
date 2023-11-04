const { body } = require('express-validator');
const registerCustomerValidation = [
    body('first_name').isString().notEmpty(),
    body('last_name').isString().notEmpty(),
    body('age').isInt({ min: 0 }).notEmpty(),
    body('monthly_income').isFloat({ min: 0 }).notEmpty(),
    body('phone_number').isInt({ min: 0 }).notEmpty(),
];

const checkEligibilityValidation = [
    body('customer_id').isInt().notEmpty(),
    body('loan_amount').isFloat({ min: 0 }).notEmpty(),
    body('interest_rate').isFloat({ min: 0 }).notEmpty(),
    body('tenure').isFloat({ min: 0 }).notEmpty(),
];

module.exports = { registerCustomerValidation, checkEligibilityValidation };