const { validationResult } = require('express-validator');
const { registerCustomer, checkEligibility } = require('../services/customerService');

const registerCustomerController = async (req, res) => {
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
}

const checkEligibilityController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const response = await checkEligibility(req);
        return res.status(response.code).json(response.message);
    } catch (error) {
        console.error('Error checking loan eligibility:', error);
        res.status(500).json({ error: 'Loan eligibility check failed' });
    }
}

module.exports = {
    registerCustomerController,
    checkEligibilityController
};

