
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
}));

const predefinedUsername = 'admin';
const predefinedPassword = '12345';

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === predefinedUsername && password === predefinedPassword) {
    req.session.user = username;
    res.redirect('/app.html');
  } else {
    res.status(401).send('Invalid credentials');
  }
});

app.get('/api/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login.html');
});

module.exports = app;
