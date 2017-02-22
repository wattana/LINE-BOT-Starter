var express = require('express')
var app = express()

var pjson = require('./package.json');
//var http = require('http').Server(app);
var path = require('path');
var bodyParser = require('body-parser');
//app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
// invoked for any requested passed to this router
/*
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:1841');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    //console.log("router 55555",req.isAuthenticated(),req.user)
    //if (req.isAuthenticated()) {
      //return next()
    //}
    //res.redirect('/login.html')

    next();
});
*/

var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var dateFormat = require('dateformat');
console.log(dateFormat(new Date(), "dd,mmm yyyy h:MM"))

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new LocalStrategy(
  function(username, password, done) {
      console.log("username", username)
      return done(null, {
          username : username,
          id : '1'
      });
  }
));


app.use(session({ 
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

//app.use(require('morgan')('combined'));
//app.use(require('cookie-parser')());
//app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

app.post('/authenticate',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/loginx.html' }),
    function(req, res) {
        console.log("afft")
        res.redirect('/');
  });
                                   
/*
app.post('/authenticate',function(req, res, next) {
  console.log("......",req.body)
  passport.authenticate('local', function(err, user, info) {
    console.log("ww",err, user, info)
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/users/' + user.username);
    });
  })(req, res, next);
});  
*/
   

app.get("/login.html", function (req, res) {
  //res.send('Hello World!')
  console.log("login.html 55555",req.isAuthenticated(),req.user)
  res.sendFile(path.join(__dirname + '/login.html'));
})

//http.listen(process.env.PORT || pjson.port, function(){
//  console.log('listening on *:',process.env.PORT || pjson.port);
//});   

app.listen(3000);     