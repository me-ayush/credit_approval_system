const express = require('express');
const { dataIngestionController, dataIngestionAutoController } = require('../controllers/dataIngestionController');
const dataIngestionRouter = express.Router();

dataIngestionRouter.post('/', dataIngestionController);
dataIngestionRouter.get('/', dataIngestionAutoController);

module.exports = dataIngestionRouter;
