const xlsx = require('xlsx');
const { dbQuery } = require('../models/db');
const { createTables } = require('../models/dataIngestion');
const { getDebtByCustomerId } = require('../models/loanModel');

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

const performDataIngestion = async (filesArr) => {

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
                            return null;
                        }
                    } else if (column === 'current_debt') {
                        try {
                            const [calculateDebtResult] = await getDebtByCustomerId(row['customer_id'])
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

        }
        catch (err) {
            console.error(`Error inserting data in table ${type} Error: ${err.message}`);
        }
    };
}

module.exports = {
    performDataIngestion
};
