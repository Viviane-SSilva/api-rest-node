import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.resolve(__dirname, "database.db");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT)
    `);
});

export default db;