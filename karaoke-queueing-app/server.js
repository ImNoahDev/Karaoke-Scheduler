import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3001;

let queue = [];

app.use(cors());
app.use(bodyParser.json());

app.get('/api/queue', (req, res) => {
  res.json({ data: queue });
});

app.post('/api/queue', (req, res) => {
  const { names, time, song, instrument } = req.body;
  const newEntry = {
    id: uuidv4(),
    names,
    time,
    song,
    instrument,
  };
  queue.push(newEntry);
  res.status(201).json({ message: 'Entry added successfully', data: newEntry });
});

app.delete('/api/queue/:id', (req, res) => {
  const { id } = req.params;
  queue = queue.filter((item) => item.id !== id);
  res.json({ message: 'Entry deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
