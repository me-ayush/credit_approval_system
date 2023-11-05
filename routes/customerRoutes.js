const express = require('express');
const { registerCustomerValidation, checkEligibilityValidation } = require('../middleware/customer');
const { registerCustomerController, checkEligibilityController } = require('../controllers/customerController');
const customerRouter = express.Router();

customerRouter.post('/register', registerCustomerValidation, registerCustomerController);

customerRouter.post('/check-eligibility', checkEligibilityValidation, checkEligibilityController);


module.exports = customerRouter;