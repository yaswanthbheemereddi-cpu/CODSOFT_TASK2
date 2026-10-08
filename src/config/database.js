const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const dataDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'contacts.db');
const db = new DatabaseSync(dbPath);

function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      company TEXT,
      job_title TEXT,
      address TEXT,
      category TEXT CHECK(category IN ('personal', 'work', 'other')) DEFAULT 'personal',
      is_favorite INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const count = db.prepare('SELECT COUNT(*) as count FROM contacts').get().count;
  if (count === 0) {
    seedInitialContacts();
  }
}

function seedInitialContacts() {
  console.log('[Database] Seeding sample contacts for Task 2...');
  const stmt = db.prepare(`
    INSERT INTO contacts (name, email, phone, company, job_title, address, category, is_favorite)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run('Yaswanth Bose', 'yaswanth@codsoft.dev', '+91 9876543210', 'CodSoft Inc', 'Backend Engineer', 'Hyderabad, India', 'work', 1);
  stmt.run('Ananya Rao', 'ananya.rao@techcorp.com', '+91 9876543211', 'Tech Corp', 'Product Manager', 'Bengaluru, India', 'work', 1);
  stmt.run('Kiran Kumar', 'kiran.k@gmail.com', '+91 9876543212', 'Freelance', 'UI/UX Designer', 'Visakhapatnam, India', 'personal', 0);
  stmt.run('Deepak Sharma', 'deepak.s@innovate.org', '+91 9876543213', 'Innovate Labs', 'DevOps Specialist', 'Pune, India', 'work', 0);
  stmt.run('Sravani Reddy', 'sravani.reddy@yahoo.com', '+91 9876543214', 'Apollo Health', 'Data Analyst', 'Hyderabad, India', 'personal', 1);

  console.log('[Database] Contacts seeded successfully!');
}

initializeDatabase();

module.exports = db;
