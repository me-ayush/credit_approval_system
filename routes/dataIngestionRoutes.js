const express = require('express');
const { dataIngestionController } = require('../controllers/dataIngestionController');
const dataIngestionRouter = express.Router();

dataIngestionRouter.post('/', dataIngestionController);

module.exports = dataIngestionRouter;
