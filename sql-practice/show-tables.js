const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const db = new DatabaseSync(path.join(__dirname, 'practice.db'));

const tables = ['customers', 'products', 'orders', 'order_items'];

for (const table of tables) {
    console.log(`\n=== ${table} ===`);
    const rows = db.prepare(`SELECT * FROM ${table};`).all();
    console.table(rows);
}

db.close();
