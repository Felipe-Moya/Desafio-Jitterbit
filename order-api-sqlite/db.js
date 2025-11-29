const Database = require('better-sqlite3');
const path = require('path');


// Cria/abre o arquivo orders.db na raiz
const dbPath = path.resolve(__dirname, 'orders.db');
const db = new Database(dbPath);


// Garante que as tabelas existem (opcional: útil para iniciar sem usar DB Browser)
const init = () => {
    db.exec(`
        CREATE TABLE IF NOT EXISTS "Order" (
        orderId TEXT PRIMARY KEY,
        value INTEGER NOT NULL,
        creationDate TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS Items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orderId TEXT NOT NULL,
        productId INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price INTEGER NOT NULL,
        FOREIGN KEY(orderId) REFERENCES "Order"(orderId) ON DELETE CASCADE
        );
    `);
};


init();


module.exports = db;