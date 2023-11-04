
const xlsx = require('xlsx');
const { dbQuery, DBconnection } = require('../models/db');

const tableMapping = {
    customer: {
        table: 'customers',
        columns: {
            customer_id: 'customer_id',
            first_name: 'first_name',
            last_name: 'last_name',
            age: 'age',
            phone_number: 'phone_number',
            monthly_salary: 'monthly_salary',
            approved_limit: 'approved_limit',
            current_debt: 'current_debt',
        },
    },
    loan: {
        table: 'loans',
        columns: {
            customer_id: 'customer_id',
            loan_id: 'loan_id',
            loan_amount: 'loan_amount',
            tenure: 'tenure',
            interest_rate: 'interest_rate',
            emi: 'monthly_payment',
            emi_paid: 'EMIs paid on Time',
            start_date: 'start_date',
            end_date: 'end_date',
        },
    },
};

const performIngestion = async (filesArr) => {

    try {
        await createTables();
    } catch (err) {
        console.error(`Error creating tables: ${err.message}`);
    }

    for (const uploadedFile of filesArr) {
        const type = uploadedFile.name.split('_')[0];

        try {
            const workbook = xlsx.read(uploadedFile.data);
            const sheetName = workbook.SheetNames[0];
            const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

            const tableInfo = tableMapping[type];
            const tableName = tableInfo.table;
            let columns = Object.values(tableInfo.columns);
            const placeholders = columns.map(() => '?').join(', ');

            const values = await Promise.all(data.map(async (row) => {
                return await Promise.all(columns.map(async (column, index) => {
                    if (column === 'start_date' || column === 'end_date') {
                        try {
                            const numericDate = row[column];
                            const baseDate = new Date('1900-01-01'); // Excel's base date
                            const targetDate = new Date(baseDate.getTime() + (numericDate * 24 * 60 * 60 * 1000));
                            return targetDate;
                        } catch (err) {
                            // console.error(`Error parsing or formatting date: ${err}`);
                            return null;
                        }
                    } else if (column === 'current_debt') {
                        const calculateDebtQuery = `SELECT SUM(loan_amount) AS total_debt FROM loans WHERE tenure > emi_paid and customer_id = ${row['customer_id']} GROUP by customer_id`;
                        try {
                            const [calculateDebtResult] = await dbQuery(calculateDebtQuery); // Assuming dbQuery is a function that wraps db.query in a promise
                            return calculateDebtResult ? calculateDebtResult.total_debt : null;
                        } catch (calculateDebtErr) {
                            // console.error('Error calculating current_debt:', calculateDebtErr);
                            return null;
                        }
                    } else {
                        return row[column];
                    }
                }));
            }));


            columns = Object.keys(tableInfo.columns);
            const insertQuery = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES ${values.map(() => `(${placeholders})`).join(', ')}`;

            const flattenedValues = values.flat();

            const result = await dbQuery(insertQuery, flattenedValues); // Use your actual database query function.
            console.log(`${result.affectedRows} Data inserted into the database for table ${type}`);

            // db.DBconnection.query(insertQuery, flattenedValues, (err, result) => {
            //     if (err) {
            //         console.error('Error inserting data into the database:', err);
            //     } else {
            //         console.log(`${result.affectedRows} Data inserted into the database`);
            //     }
            // });
        }
        catch (err) {
            console.error(`Error inserting data in table ${type} Error: ${err.message}`);
        }
    };
}


const createTables = () => {
    return new Promise((resolve, reject) => {
        const createCustomersTableQuery = `
            CREATE TABLE IF NOT EXISTS customers (
                customer_id INT PRIMARY KEY,
                first_name VARCHAR(50),
                last_name VARCHAR(50),
                age INT,
                phone_number VARCHAR(20),
                monthly_salary INT,
                approved_limit INT,
                current_debt DECIMAL(10, 2) DEFAULT NULL
            );
        `;

        const createLoansTableQuery = `
            CREATE TABLE IF NOT EXISTS loans (
                loan_id INT,
                customer_id INT,
                loan_amount DECIMAL(10, 2),
                tenure INT,
                interest_rate DECIMAL(5, 2),
                emi DECIMAL(10, 2),
                emi_paid INT,
                start_date DATE,
                end_date DATE
            );
        `;

        // Execute the CREATE TABLE queries
        DBconnection.query(createCustomersTableQuery, (createCustomersErr, createCustomersResult) => {
            if (createCustomersErr) {
                reject(createCustomersErr);
            } else {
                DBconnection.query(createLoansTableQuery, (createLoansErr, createLoansResult) => {
                    if (createLoansErr) {
                        reject(createLoansErr);
                    } else {
                        resolve();
                    }
                });
            }
        });
    });
};

module.exports = {
    performIngestion
};
