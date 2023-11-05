const { dbQuery } = require("./db");

const getUserById = async (userId) => {
    const query = `SELECT * FROM customers WHERE customer_id = ?`;
    const results = await dbQuery(query, userId)
    return results[0]
};
module.exports = { getUserById };
