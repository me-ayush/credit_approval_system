const { dbQuery } = require("./db");
const { getDebtByCustomerId } = require("./loanModel");

const getUserById = async (userId) => {
    const query = `SELECT * FROM customers WHERE customer_id = ?`;
    const results = await dbQuery(query, userId)
    return results[0]
};

const registerNewCustomer = async (values) => {
    const query = `INSERT INTO customers (first_name, last_name, age, monthly_salary, approved_limit, phone_number) VALUES (?, ?, ?, ?, ?, ?)`;
    return await dbQuery(query, values)
}

const updateDebt = async (values) => {
    const query = 'update customers set current_debt = ? where customer_id = ?'
    return await dbQuery(query, values)
}

module.exports = { getUserById, registerNewCustomer, updateDebt };
