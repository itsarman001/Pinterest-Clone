var express = require('express');
var router = express.Router();

// require models
const userModel = require('./users');
const postModel = require('./posts');

// Passport
const passport = require('passport');
const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// Profile Route
router.get('/profile', isLoggedIn, function (req, res, next) {
  res.send('Profile');
});

// Register Routhe
router.post('/register', (req, res) => {
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });

  userModel.register(userData, req.body.password).then(() => {
    passport.authenticate('local')(req, res, () => res.redirect('/feed'))
  });
});

// Login route
router.post('/login', passport.authenticate('local', {
  successRedirect: '/feed',
  failureRedirect: '/login'
}), (req, res)=>{});

// Logout Route
router.get('/logout', (req, res)=>{
  req.logout((err)=>{
    if (err) {return next(err);}
    res.redirect('/')
  });
});

// Adding Authentication Protection
function isLoggedIn (req, res, next) {
  if(req.isAuthenticated()) return next();
  res.redirect('/login');
};

module.exports = router;
