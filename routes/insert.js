const express = require('express');
const insertDataRouter = express.Router();
const { performIngestion } = require('../services/injection');



insertDataRouter.post('/', async (req, res) => {
    try {
        const customersFile = req.files.customer_file;
        const loansFile = req.files.loan_file;

        if (!customersFile || !loansFile) {
            return res.status(400).json({ error: 'No file uploaded or type not defined' });
        }

        await performIngestion([loansFile, customersFile]);

        res.json({ message: 'Ingestion task initiated' });
    } catch (error) {
        console.error('Error during ingestion:', error);
        res.status(500).json({ error: 'Ingestion task failed' });
    }
});

module.exports = insertDataRouter;