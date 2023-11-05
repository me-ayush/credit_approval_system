const { dbQuery } = require("./db");

const getLoanByCustomerId = async (userId) => {
    const query = `SELECT * FROM loans WHERE customer_id = ?`;
    const results = await dbQuery(query, userId)
    return results
};

const getMaxLoanId = async () => {
    const query = 'Select max(loan_id) as loan_id from loans'
    const result = dbQuery(query)
    return result
}

const insertNewLoan = async (values) => {
    const query = `insert into loans (customer_id, loan_id, loan_amount, tenure, interest_rate, emi, emi_paid, start_date, end_date) values(?,?,?,?,?,?,?,?,?)`
    const result = dbQuery(query, values)
    return result
}

const getLoanDetailsByLoanId = async (loan_id) => {
    const query = `SELECT * FROM loans WHERE loan_id = ?`;
    const results = await dbQuery(query, loan_id)
    return results
}

const getLoanDetailByLoanIdCustomerId = async (loan_id, customer_id) => {
    const query = `SELECT * FROM loans WHERE loan_id = ? and customer_id = ?`;
    const results = await dbQuery(query, [loan_id, customer_id])
    return results
}

const updateLoan = async (values) => {
    const query = `UPDATE loans set loan_amount = ?, tenure = ?, emi = ?, emi_paid =  ? WHERE loan_id = ? and customer_id = ?`;
    const results = await dbQuery(query, values)
    return results
}
const getDebtByCustomerId = async (customer_id) => {
    const query = 'SELECT SUM(loan_amount) AS total_debt FROM loans WHERE tenure > emi_paid and customer_id = ? GROUP by customer_id';
    const [results] = await dbQuery(query, customer_id)
    return results.total_debt

}
module.exports = { getLoanByCustomerId, getMaxLoanId, insertNewLoan, getLoanDetailsByLoanId, getLoanDetailByLoanIdCustomerId, updateLoan, getDebtByCustomerId };
