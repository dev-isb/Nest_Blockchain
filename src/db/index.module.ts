import { Model, knexSnakeCaseMappers } from 'objection';
import knex from 'knex';

export default class DbModule {
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
      ...knexSnakeCaseMappers(),
    };

    const db = knex(dbConfig);
    console.log("binding the database");
    Model.knex(db);

    this.createTables(db);
  }

  private async createTables(db: any) {
    try {
      await db.raw(`
        CREATE TABLE IF NOT EXISTS price (
          id INT AUTO_INCREMENT PRIMARY KEY,
          chain VARCHAR(255) NOT NULL,
          price DECIMAL(15, 8) NOT NULL,
          create_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await db.raw(`
        CREATE TABLE IF NOT EXISTS alert (
          id INT AUTO_INCREMENT PRIMARY KEY,
          chain VARCHAR(255) NOT NULL,
          target_price DECIMAL(15, 8) NOT NULL,
          email VARCHAR(255) NOT NULL,
          create_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

    } catch (error) {
      console.error('Error creating tables:', error);
    }
  }
}
