const { dbQuery } = require("./db");

const makeNewPayment = async (loan_id, customer_id, amount_paid) => {
    const values = [loan_id, customer_id, amount_paid]
    const query = `INSERT into payments (loan_id, customer_id, amount_paid) VALUES (?,?,?) `;
    const results = await dbQuery(query, values)
    return results
};
const getPaymentRecord = async (loan_id, customer_id) => {
    const query = `select * from payments where loan_id = ? and customer_id = ?`;
    const results = await dbQuery(query, [loan_id, customer_id])
    return results
};
const getPaymentRecordSum = async (loan_id, customer_id) => {
    const query = `select SUM(amount_paid) as amount_paid from payments where loan_id = ? and customer_id = ? group by loan_id, customer_id`;
    const [results] = await dbQuery(query, [loan_id, customer_id])
    return results && results.amount_paid ? results.amount_paid : 0
};

const getPaymentRecordByCustomerId = async (customer_id) => {
    const query = `select * from payments where customer_id = ?`;
    const results = await dbQuery(query, customer_id)
    return results
};

const insertLoanIntoPayments = async () => {
    await dbQuery(`INSERT INTO payments (loan_id, customer_id, amount_paid)
    SELECT loan_id, customer_id, emi * emi_paid
    FROM loans;`)
}

module.exports = { makeNewPayment, getPaymentRecord, getPaymentRecordByCustomerId, getPaymentRecordSum, insertLoanIntoPayments };
