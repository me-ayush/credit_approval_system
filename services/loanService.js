const { getUserById } = require("../models/customerModel");
const { getMaxLoanId, insertNewLoan, getLoanDetailsByLoanId } = require("../models/loanModel");

const processNewLoan = async (req, res, loanDetails) => {
    try {
        const LoanId = await getMaxLoanId();
        const newLoanId = LoanId[0].loan_id + 1;

        const startDate = new Date();
        const tenure = loanDetails['tenure'];
        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + tenure);

        const values = {
            customer_id: loanDetails['customer_id'],
            loan_id: newLoanId,
            loan_amount: req.body.loan_amount,
            tenure: loanDetails['tenure'],
            interest_rate: loanDetails['corrected_interest_rate'],
            emi: loanDetails['monthly_installment'],
            emi_paid: 0,
            start_date: startDate.toISOString().slice(0, 10),
            end_date: endDate.toISOString().slice(0, 10),
        };

        const result = await insertNewLoan(Object.values(values));

        const response = {
            loan_id: values.loan_id,
            customer_id: values.customer_id,
            loan_approved: false,
            message: "something went wrong",
            monthly_installment: null,
        };

        if (result && result.affectedRows >= 1) {
            response.loan_approved = true;
            response.message = "";
            response.monthly_installment = values.emi;
        }

        res.status(200).json(response);
    } catch (error) {
        console.error('Error processing loan:', error);
        res.status(500).json({ error: 'Loan processing failed' });
    }
}

const viewLoanDetails = async (req, res) => {
    const loanId = req.params.loan_id;
    const loanRecords = await getLoanDetailsByLoanId(loanId)

    if (Object.values(loanRecords).length == 0) return res.status(402).json("Loan not found")

    const loanDetails = [];

    for (const record of loanRecords) {
        const customerDetails = await getUserById(record.customer_id);

        if (customerDetails) {
            loanDetails.push({
                loan_id: record.loan_id,
                customer: {
                    first_name: customerDetails.first_name,
                    last_name: customerDetails.last_name,
                    phone_number: customerDetails.phone_number,
                    age: customerDetails.age,
                },
                loan_approved: true,
                interest_rate: record.interest_rate,
                monthly_installment: record.emi,
                tenure: record.tenure,
            });
        } else {
            loanDetails.push({
                loan_id: record.loan_id,
                customer: null,
                loan_approved: false,
                interest_rate: null,
                monthly_installment: null,
                tenure: null,
            });
        }
    }
    return res.status(200).json(loanDetails)
}

module.exports = {
    processNewLoan,
    viewLoanDetails
}