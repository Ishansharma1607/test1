
const express = require('express');
const path = require('path');
const auth = require('./auth');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(auth);

app.use(express.json());

app.post('/api/save-text', (req, res) => {
  const { text } = req.body;
  const insertQuery = db.prepare('INSERT INTO user_text (text_content) VALUES (?)');
  insertQuery.run(text);
  res.status(200).send('Text saved successfully');
});

app.get('/api/load-text', (req, res) => {
  const selectQuery = db.prepare('SELECT text_content FROM user_text ORDER BY id DESC LIMIT 1');
  const row = selectQuery.get();
  res.status(200).json({ text: row ? row.text_content : '' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
