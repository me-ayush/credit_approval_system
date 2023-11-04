const { DBconnection } = require("./db");

const getLoanByCustomerId = (userId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM loans WHERE customer_id = ?`;

        DBconnection.query(query, [userId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};
module.exports = { getLoanByCustomerId };
