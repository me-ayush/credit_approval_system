const { validationResult } = require('express-validator');
const { checkEligibility } = require('../services/customerService');
const { processNewLoan } = require('../services/loanService');

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

module.exports = {
    createLoanController,
};

