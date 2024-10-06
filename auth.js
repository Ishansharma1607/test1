
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
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

const authMiddleware = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

module.exports = { app, authMiddleware };
