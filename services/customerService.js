const { getUserById, registerNewCustomer } = require("../models/customerModel");
const { getLoanByCustomerId } = require("../models/loanModel");
const { dbQuery } = require("../models/db");
const { calculateCreditScore, determineLoanEligibility } = require("./creditApprovalService");

const registerCustomer = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            age,
            monthly_income,
            phone_number,
        } = req.body;

        const approved_limit = Math.round((36 * monthly_income) / 100000) * 100000;

        const values = [
            first_name,
            last_name,
            age,
            monthly_income,
            approved_limit,
            phone_number,
        ];

        const result = await registerNewCustomer(values);
        const customer_id = result.insertId;

        const customerInfo = {
            customer_id,
            name: `${first_name} ${last_name}`,
            age,
            monthly_income,
            approved_limit,
            phone_number,
        };

        res.json(customerInfo);
    } catch (error) {
        console.error('Error registering customer:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

const checkEligibility = async (req, res) => {
    try {
        const { customer_id, loan_amount, interest_rate, tenure } = req.body;

        const user = await getUserById(customer_id)

        if (!user) {
            return { code: 402, message: "User not found", nonApprovalMessage: "User not found" }
        }
        const userLoan = await getLoanByCustomerId(customer_id)

        // Calculate the credit score based on the given components
        const creditScore = calculateCreditScore(userLoan);

        // Determine loan eligibility based on the credit score and other criteria
        const { approval, corrected_interest_rate, monthly_installment, message } = determineLoanEligibility(
            creditScore,
            loan_amount,
            interest_rate,
            tenure,
            user['monthly_salary'],
            userLoan
        );

        // Prepare the response object
        const response = {
            code: 200,
            message: {
                customer_id,
                approval,
                interest_rate,
                corrected_interest_rate,
                tenure,
                monthly_installment,
            },
            nonApprovalMessage: message
        };

        return response

        // Send the response
    } catch (error) {
        console.error('Error checking loan eligibility:', error.message);
        res.status(500).json({ error: 'Loan eligibility check failed' });
    }
}


module.exports = {
    registerCustomer,
    checkEligibility
};

