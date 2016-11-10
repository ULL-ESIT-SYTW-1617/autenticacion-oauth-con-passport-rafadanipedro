const express = require('express');
const passport = require('passport');
const { Strategy } = require('passport-github')
const { ensureLoggedIn } = require('connect-ensure-login')
const github = require ('octonode')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const path = require ('path')

const { host, clientID, clientSecret, organizacion } = require('./config.json')

const app = express();

passport.use(new Strategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: `http://${host}/login/github/return`
  },
  (accessToken, refreshToken, profile, cb) => cb(null, profile)))


passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((obj, cb) => cb(null, obj));

app.set('views', path.resolve(__dirname + '/views'));
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(logger('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());


// Función que verifica que el usuario está en una organización

function middlewareOrganization (req, res, next) {
  const client = github.client({id: clientID, secret: clientSecret})

  client.get(`/users/${req.user.username}/orgs`, {}, function (err, status, body, headers) {
    for(let org of body) {
      if (org.login === organizacion) {
        return next()
      }
    }
    res.render('error', {error: 'No tienes permisos para ver el libro'})
  });
}


app.get('/login', (req, res) => {
  if (req.isAuthenticated()) return res.redirect('/')
  res.render('login')
})

app.get('/login/github', passport.authenticate('github'));

app.get('/login/github/return',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  });

app.get('/assets/*', express.static('assets'))

app.get('*', ensureLoggedIn('/login'), middlewareOrganization, express.static('gh-pages'))

app.use((req, res) => res.render('error', {error: 'Tienes que desplegar el libro al menos una vez'}))

const port = process.env.PORT || 8080
console.log(`Express escuchando en puerto ${port}`)
app.listen(port)
