import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const db = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: "mysql",
        logging: process.env.NODE_ENV === "development" ? console.log : false,
        timezone: "+07:00", // Sesuaikan dengan timezone lokal
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true,
            underscored: true, // Menggunakan snake_case untuk kolom
            freezeTableName: true
        }
    }
);

export default db;
