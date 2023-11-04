const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    MYSQL_HOST: process.env.MYSQL_HOST,
    MYSQL_USER: process.env.MYSQL_USER,
    MYSQL_PASSWORD: process.env.MYSQL_PASS,
    MYSQL_DATABASE: process.env.MYSQL_DB,

    USER_NAME: process.env.MAIL_USER_NAME,
    PASS_WORD: process.env.MAIL_PASS_WORD,
    SMTP_SERVER: process.env.SMTP_SERVER,
    SMTP_PORT: process.env.SMTP_PORT,

    SERVER_NAME: process.env.IS_DEV == 1 ? "http://localhost:3000" : process.env.PROD_SERVER_NAME,
    IS_DEV: process.env.IS_DEV == 1 ? 1 : 0,

    NODEJS_PORT: process.env.NODEJS_PORT

};
