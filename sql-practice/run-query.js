const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const db = new DatabaseSync(path.join(__dirname, 'practice.db'));
const query = process.argv.slice(2).join(' ');

if (!query) {
    console.error('Usage: node run-query.js "SELECT * FROM customers;"');
    process.exit(1);
}

try {
    const rows = db.prepare(query).all();
    console.table(rows);
    console.log(`${rows.length} row(s)`);
} catch (err) {
    console.error('Query error:', err.message);
}

db.close();
