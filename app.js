const express = require('express');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const KEYS = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');

const app = express();

// set up view engine
app.set('view engine', 'ejs');

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [KEYS.session.cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// connect to MongoDb
mongoose.connect(KEYS.mongoDb.dbUri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log('connected to mongoDb');
  });

// set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

// create home route
app.get('/', (req, res) => {
  res.render('home', { user: req.user });
});

// start server
app.listen(3000, () => {
  console.log('App now listening on port 3000');
});
