// database/connection.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        pool: {
            max: 3,
            min: 0,
            acquire: 30000,
            idle: 5000
        },
        logging: false
    }
);

export default sequelize;