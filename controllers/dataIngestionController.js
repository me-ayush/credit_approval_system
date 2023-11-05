const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const { performDataIngestion } = require('../services/dataIngestionService');

const dataIngestionController = async (req, res) => {
    try {
        const { customerFile, loanFile } = req.files;
        if (!customerFile || !loanFile) {
            return res.status(400).json({ error: 'Both customer and loan files are required' });
        }
        files = []
        for (const currentFile of [loanFile, customerFile]) {
            const workbook = XLSX.read(currentFile.data);
            const sheetName = workbook.SheetNames[0];
            const data = {
                name: currentFile.name,
                data: XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])
            }
            files.push(data)
        }
        await performDataIngestion(files);
        res.json({ message: 'Data ingestion task initiated' });
    } catch (error) {
        console.error('Error during data ingestion:', error);
        res.status(500).json({ error: 'Data ingestion task failed' });
    }
}

const dataIngestionAutoController = async (req, res) => {
    try {
        fileNames = ['loan_data.xlsx', 'customer_data.xlsx']
        files = []
        for (const currentFile of fileNames) {
            const xlsxFilePath = path.join(__dirname, `../uploads/${currentFile}`);
            const workbook = XLSX.readFile(xlsxFilePath);
            const sheetName = 'Sheet1';
            const worksheet = workbook.Sheets[sheetName];
            const data = {
                name: currentFile,
                data: XLSX.utils.sheet_to_json(worksheet)
            }
            files.push(data)
        }
        await performDataIngestion(files);
        res.json({ message: 'Data ingestion task initiated' });
    } catch (error) {
        console.error('Error during data ingestion:', error);
        res.status(500).json({ error: 'Data ingestion task failed' });
    }
}

module.exports = {
    dataIngestionController,
    dataIngestionAutoController
}