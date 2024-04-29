var express = require('express');
var router = express.Router();

// require models
const userModel = require('./users');
const postModel = require('./posts');

// Multer
const upload = require('./multer');

// Passport
const passport = require('passport');
const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// Profile Route
router.get('/profile', isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  }).populate('posts')
  res.render('Profile', { user });
});

// Profile Route
router.get('/feed', function (req, res, next) {
  res.send('feed');
});

// Register Route
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });

  userModel.register(userData, req.body.password).then(() => {
    passport.authenticate('local')(req, res, () => res.redirect('/profile'))
  });
});

// Login route
router.get('/login', (req, res) => {
  res.render('login', { error: req.flash('error') });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}), (req, res) => { });

// Logout Route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/')
  });
});

// Adding Authentication Protection
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
};

router.post('/upload', isLoggedIn, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(404).send('No files were uploaded.');
  }
  const user = await userModel.findOne({ username: req.session.passport.user });
  const post = await postModel.create({
    image: req.file.filename,
    postText: req.body.fileCaption,
    user: user._id
  });
  user.posts.push(post._id)
  await user.save()
  res.redirect('/profile')
});

module.exports = router;
