const { dbQuery } = require("./db");

const createTables = async () => {
    const createCustomersTableQuery = `
    CREATE TABLE IF NOT EXISTS customers (
        customer_id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        age INT,
        phone_number VARCHAR(20),
        monthly_salary INT,
        approved_limit INT,
        current_debt DECIMAL(10, 2) DEFAULT 0
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

    const createPaymentsTableQuery = `
    CREATE TABLE IF NOT EXISTS payments (
        payment_id INT AUTO_INCREMENT PRIMARY KEY,
        loan_id INT,
        customer_id INT,
        amount_paid DECIMAL(10, 2),
        date_paid TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`


    const createCustomersResult = await dbQuery(createCustomersTableQuery);
    const createLoansResult = await dbQuery(createLoansTableQuery);
    const createPaymentsResult = await dbQuery(createPaymentsTableQuery);

    if (createCustomersResult && createLoansResult && createPaymentsResult) {
        console.log('Tables created successfully');
    } else {
        console.error('Error creating tables');
    }
}

module.exports = {
    createTables
}