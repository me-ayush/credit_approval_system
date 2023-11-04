const express = require('express');
const dataIngestionRouter = express.Router();
const { performDataIngestion } = require('../services/injection');

dataIngestionRouter.post('/', async (req, res) => {
    try {
        const { customerFile, loanFile } = req.files;

        if (!customerFile || !loanFile) {
            return res.status(400).json({ error: 'Both customer and loan files are required' });
        }

        await performDataIngestion([loanFile, customerFile]);

        res.json({ message: 'Data ingestion task initiated' });
    } catch (error) {
        console.error('Error during data ingestion:', error);
        res.status(500).json({ error: 'Data ingestion task failed' });
    }
});

module.exports = dataIngestionRouter;
