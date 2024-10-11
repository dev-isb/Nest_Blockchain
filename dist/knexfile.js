"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    client: 'mysql2',
    connection: {
        host: "172.26.98.57",
        port: Number(process.env.DATABASE_PORT) || 3306,
        user: "manager",
        password: 'manager@123',
        database: 'price_listings',
    },
    migrations: {
        directory: './migrations',
    },
};
//# sourceMappingURL=knexfile.js.map