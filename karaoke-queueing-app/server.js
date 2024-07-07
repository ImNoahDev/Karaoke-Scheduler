import express from 'express';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import cors from 'cors';

const app = express();
const db = new sqlite3.Database('karaoke.db');

app.use(bodyParser.json());
app.use(cors());

// Get all songs in the queue
app.get('/api/queue', (req, res) => {
  db.all('SELECT * FROM queue', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ data: rows });
  });
});

// Add a song to the queue
app.post('/api/queue', (req, res) => {
  const { name, time, song } = req.body;
  const stmt = db.prepare('INSERT INTO queue (name, time, song) VALUES (?, ?, ?)');
  stmt.run(name, time, song, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
  stmt.finalize();
});

// Remove a song from the queue
app.delete('/api/queue/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM queue WHERE id = ?', id, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ deleted: this.changes });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
