const express = require('express');
const dataIngestionRouter = require('./routes/dataIngestionRoutes');
const { NODEJS_PORT } = require('./Constants/constant');
const fileUpload = require('express-fileupload');
const customerRouter = require('./routes/customerRoutes');
const loanRouter = require('./routes/loanRoutes');

require('dotenv').config();
const app = express();
const port = NODEJS_PORT || 3000;
// const port = 8000;

app.use(fileUpload());

app.use(express.json());

app.use('/', customerRouter);
app.use('/', loanRouter);
app.use('/trigger-ingestion', dataIngestionRouter);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
