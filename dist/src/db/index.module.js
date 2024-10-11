"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const knex_1 = require("knex");
class DbModule {
    makeConnection() {
        const dbConfig = {
            client: "mysql2",
            connection: {
                host: process.env.DATABASE_HOST || "172.26.98.57",
                port: "3306",
                database: process.env.DATABASE_NAME || "block_chain_register",
                user: process.env.DATABASE_USER || "manager",
                password: process.env.DATABASE_PASSWORD || "manager@123",
            },
            pool: {
                min: 10,
                max: 20,
            },
            multipleStatements: true,
            ...(0, objection_1.knexSnakeCaseMappers)(),
        };
        const db = (0, knex_1.default)(dbConfig);
        console.log("binding the database");
        objection_1.Model.knex(db);
        this.createTables(db);
    }
    async createTables(db) {
        try {
            console.log('Checking and creating tables if not exists...');
            await db.raw(`
        CREATE TABLE IF NOT EXISTS price (
          id INT AUTO_INCREMENT PRIMARY KEY,
          chain VARCHAR(255) NOT NULL,
          price DECIMAL(15, 8) NOT NULL,
          create_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
            console.log("price table created");
            await db.raw(`
        CREATE TABLE IF NOT EXISTS alert (
          id INT AUTO_INCREMENT PRIMARY KEY,
          chain VARCHAR(255) NOT NULL,
          target_price DECIMAL(15, 8) NOT NULL,
          email VARCHAR(255) NOT NULL,
          create_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
            console.log("alert table created");
        }
        catch (error) {
            console.error('Error creating tables:', error);
        }
    }
}
exports.default = DbModule;
//# sourceMappingURL=index.module.js.map