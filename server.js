
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');
const { app, authMiddleware } = require('./auth');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === '12345') {
    req.session.user = username;
    res.status(200).send();
  } else {
    res.status(401).send();
  }
});

app.post('/api/save-text', authMiddleware, (req, res) => {
  const { textContent } = req.body;
  const insertQuery = db.prepare('INSERT INTO user_text (text_content) VALUES (?)');
  insertQuery.run(textContent);
  res.status(200).send();
});

app.get('/api/load-text', authMiddleware, (req, res) => {
  const selectQuery = db.prepare('SELECT text_content FROM user_text ORDER BY id DESC LIMIT 1');
  const row = selectQuery.get();
  res.status(200).json({ textContent: row ? row.text_content : '' });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
