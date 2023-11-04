const express = require('express');
const router = require('./routes/routes');
const dataIngestionRouter = require('./routes/insert');
const { NODEJS_PORT } = require('./Constants/constant');
const fileUpload = require('express-fileupload');

require('dotenv').config();
const app = express();
// const port = NODEJS_PORT || 3000;
const port = 8000;

app.use(fileUpload());

app.use(express.json());

app.use('/', router);
app.use('/trigger-ingestion', dataIngestionRouter);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
