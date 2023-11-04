const mysql = require('mysql');
const { MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_HOST } = require('../Constants/constant');
require('dotenv').config();

const dbConfig = {
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
}
const dbPool = mysql.createPool({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
})

const DBconnection = mysql.createConnection(dbConfig);

DBconnection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the database');
    }
});

function dbQuery(query, values) {
    return new Promise((resolve, reject) => {
        dbPool.getConnection((err, connection) => {
            if (err) {
                reject(err);
                return;
            }

            connection.query(query, values, (err, results) => {
                connection.release(); // Release the connection back to the pool.

                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    });
}

module.exports = { DBconnection, dbQuery };