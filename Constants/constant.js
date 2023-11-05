const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    MYSQL_HOST: process.env.MYSQL_HOST,
    MYSQL_USER: process.env.MYSQL_USER,
    MYSQL_PASSWORD: process.env.MYSQL_PASS,
    MYSQL_DATABASE: process.env.MYSQL_DB,
    NODEJS_PORT: process.env.NODEJS_PORT
};
