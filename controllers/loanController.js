const { validationResult } = require('express-validator');
const { checkEligibility } = require('../services/customerService');
const { processNewLoan, viewLoanDetails, makePayment } = require('../services/loanService');

const createLoanController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const isEligible = await checkEligibility(req)
        if (isEligible.code == 402 || !isEligible.message.approval) {
            return res.status(402).json({
                loan_id: null,
                customer_id: req.body.customer_id,
                loan_approved: false,
                message: isEligible.nonApprovalMessage,
                monthly_installment: null
            })
        }
        processNewLoan(req, res, isEligible.message);
    } catch (error) {
        console.error('Error processing loan:', error);
        res.status(500).json({ error: 'Loan processing failed' });
    }
}

const viewLoanController = async (req, res) => {
    viewLoanDetails(req, res)
}

const makeLoanPaymentController = async (req, res) => {
    const { customer_id, loan_id } = req.params;
    const { amountPaid } = req.body;

    if (!customer_id || isNaN(customer_id) || !loan_id || isNaN(loan_id) || !amountPaid) {
        return res.status(400).json({ error: "Invalid request. Please provide valid customer_id, loan_id, and amountPaid." });
    }

    if (typeof amountPaid !== 'number' || amountPaid <= 0) {
        return res.status(400).json({ error: "Invalid amountPaid value. Please provide a positive number." });
    }

    try {
        makePayment(req, res);
    } catch (error) {
        console.error('Error making loan payment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    createLoanController,
    viewLoanController,
    makeLoanPaymentController,
};

