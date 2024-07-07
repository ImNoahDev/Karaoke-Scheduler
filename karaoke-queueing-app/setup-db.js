import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('karaoke.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    time TEXT NOT NULL,
    song TEXT NOT NULL
  )`);
});

db.close();
