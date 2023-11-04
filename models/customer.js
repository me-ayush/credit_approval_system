const { body } = require('express-validator');
const registerCustomerValidation = [
    body('first_name').isString().notEmpty(),
    body('last_name').isString().notEmpty(),
    body('age').isInt({ min: 0 }).notEmpty(),
    body('monthly_income').isFloat({ min: 0 }).notEmpty(),
    body('phone_number').isInt({ min: 0 }).notEmpty(),
];

const Customer = {

    customer_id: null,
    first_name: '',
    last_name: '',
    phone_number: '',
    age: 0,
    monthly_salary: 0.0,
    approved_limit: 0.0,
    current_debt: 0.0,
    created_at: null,
    updated_at: null
};

module.exports = { Customer, registerCustomerValidation };
