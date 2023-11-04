const { DBconnection } = require("./db");

const getUserById = (userId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM customers WHERE customer_id = ?`;

        DBconnection.query(query, [userId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results[0]);
            }
        });
    });
};
module.exports = { getUserById };
