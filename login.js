var express  = require('express');
var router = express.Router();
var pjson = require('./package.json');
var passport = require('passport'), 
    LocalStrategy = require('passport-local').Strategy;
var dbConfig = pjson.db;
var soap = require('soap');
var WebServiceURL =  pjson.webServiceURL;
var WebHookBaseURL =  pjson.webHookBaseURL;


passport.serializeUser(function(user, done) {
    //console.log("serializeUser user",user)
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    //console.log("deserializeUser user",user)
    done(null, user);
});
passport.use(new LocalStrategy(
  function(username, password, done) {
      //console.log("username", username)
      var url = WebServiceURL+'loginservice.asmx?WSDL';
      soap.createClient(url, function(err, client) {
        if (err) {
            return done(err);
        }
        client.login({
            userLogin : username,
            password : password,
        }, function(err, result) {
            //console.log("login result", result,result.loginResult.success)
            if (result.loginResult.success) {
                return done(null, {
                    id : result.loginResult.refId,
                    username : username
                });
            } else {
                return done(null, false, { message: result.loginResult.msg });
            }
        });
      });
  },
  function(params, done) {
    // validate nonces as necessary
    console.log("params", params)
    done(null, true)
  }
));
// invoked for any requested passed to this router

router.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:1841');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

router.get('/loginInfo', function(req, res, next) {
    //console.log(req.isAuthenticated())
    res.send('loginInfo'+req.isAuthenticated()+" "+JSON.stringify(req.user))   
})

/*
router.post('/authenticate',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login.html'}));
                                   */

router.post('/authenticate', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        console.log("authenticate",err, user, info)
        if (err) { return next(err); }
        if (!user) { return res.redirect('/login.html?info='+info.message); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/');
        });
    })(req, res, next);    
});   

router.get('/logout', function(req, res, next) {
    //console.log(req.isAuthenticated())
    req.logout();
    res.redirect('/login.html')
})                            
                                   
module.exports = router;                                  