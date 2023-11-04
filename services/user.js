const { dbQuery } = require("../models/db");

const registerCustomer = async (req, res) => {
    const {
        first_name,
        last_name,
        age,
        monthly_income,
        phone_number,
    } = req.body;

    // Calculate the approved credit limit
    const approved_limit = Math.round(36 * monthly_income / 100000) * 100000;

    // Insert the new customer into the "customers" table
    const insertCustomerQuery = `
      INSERT INTO customers (first_name, last_name, age, monthly_salary, approved_limit, phone_number)
      VALUES (?, ?, ?, ?, ?, ?);
    `;

    const values = [
        first_name,
        last_name,
        age,
        monthly_income,
        approved_limit,
        phone_number,
    ];


    try {
        const result = await dbQuery(insertCustomerQuery, values);

        // Get the customer_id of the newly registered customer
        const customer_id = result.insertId;

        // Create the response object
        const customerInfo = {
            customer_id,
            name: `${first_name} ${last_name}`,
            age,
            monthly_income,
            approved_limit,
            phone_number,
        };

        res.json(customerInfo);
    } catch (error) {
        console.error('Error registering customer:', error);
        res.status(500).json({ error: 'Registration failed' });
    }

    // DBconnection.query(insertCustomerQuery, values, (insertError, insertResult) => {
    //     if (insertError) {
    //         console.error('Error registering customer:', insertError);
    //         res.status(500).json({ error: 'Registration failed' });
    //     } else {
    //         // Get the customer_id of the newly registered customer
    //         const customer_id = insertResult.insertId;

    //         // Create the response object
    //         const customerInfo = {
    //             customer_id,
    //             name: `${first_name} ${last_name}`,
    //             age,
    //             monthly_income,
    //             approved_limit,
    //             phone_number,
    //         };

    //         res.json(customerInfo);
    //     }
    // });

}

module.exports = {
    registerCustomer
};
