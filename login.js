var express  = require('express');
var router = express.Router();
var pjson = require('./package.json');
var passport = require('passport'), 
    utils = require('./utils')
    RememberMeStrategy = require('passport-remember-me').Strategy;
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

passport.use(new RememberMeStrategy(
  function(token, done) {
      consumeRememberMeToken(token, function(err, uid) {
        //console.log("consumeRememberMeToken",uid)
        if (err) { return done(err); }
        //if (!uid) { return done(null, false); }
        //console.log("consumeRememberMeToken",token)
        var url = WebServiceURL+'loginservice.asmx?WSDL';
        soap.createClient(url, function(err, client) {
            if (err) {
                return done(err);
            }
            client.autoLogin({
                agentId : token
            }, function(err, result) {
                //console.log("login result", result,result.autoLoginResult.success)
                if (result.autoLoginResult.success) {
                    return done(null, {
                        id : result.autoLoginResult.refId,
                        username : token
                    });
                } else {
                    return done(null, false, { message: result.autoLoginResult.msg });
                }
            });
        })
      });
  },
  issueToken
));

passport.use(new LocalStrategy(
  function(username, password, done) {
      //console.log("username", username)
      var url = WebServiceURL+'loginservice.asmx?WSDL';
      soap.createClient(url, function(err, client) {
        if (err) {
            return done(err);
        }
        if (password == '@@@@autologin@@@@' && username.indexOf("agentId:") != -1) {
            client.autoLogin({
                agentId : username.substring(8)
            }, function(err, result) {
                //console.log("login result", result,result.loginResult.success)
                if (result.autoLoginResult.success) {
                    return done(null, {
                        id : result.autoLoginResult.refId,
                        username : username
                    });
                } else {
                    return done(null, false, { message: result.autoLoginResult.msg });
                }
            });

        } else {
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
        }
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
        if (req.body.remember_me) {    
            issueToken(user, function(err, token) {
                if (err) { return next(err); }
                //console.log("issueToken",token)
                //res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 });
                res.cookie('remember_me', user.id, { path: '/', httpOnly: true, maxAge: 604800000 });
            });
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/');
        });
    })(req, res, next);    
}); 

router.get('/authenticate', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        console.log("authenticate",err, user, info)
        if (err) { return next(err); }
        if (!user) { return res.redirect('/login.html?info='+info.message); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            if (req.query.page) {
                return res.redirect('/index.html?page='+req.query.page+"&contactId="+req.query.contactId);
            }
            return res.redirect('/');
        });
    })(req, res, next);    
});   

router.get('/logout', function(req, res, next) {
    //console.log(req.isAuthenticated())
    res.clearCookie('remember_me');
    req.logout();
    res.redirect('/login.html')
})                            

/* Fake, in-memory database of remember me tokens */

var tokens = {}

function consumeRememberMeToken(token, fn) {
    //console.log("consumeRememberMeToken",tokens)
  var uid = tokens[token];
  // invalidate the single-use token
  delete tokens[token];
  return fn(null, uid);
}

function saveRememberMeToken(token, uid, fn) {
  tokens[token] = uid;
  return fn();
}
function issueToken(user, done) {
  var token = utils.randomString(64);
  saveRememberMeToken(token, user.id, function(err) {
    if (err) { return done(err); }
    return done(null, token);
  });
}

module.exports = router;                                  