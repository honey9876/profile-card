var express = require('express');
var router = express.Router();
const userModel = require("./users");
const passport = require('passport');


const localStrategy = require("passport-local");

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index'); 
});

router.get('/profile', isLoggedIn,function(req, res, next) {
  res.render('profile');
});
 //user authecation 
router.post('/register',function(req, res){
  var userdata = new userModel({
    username: req.body.username,
    secret: req.body.secret
  });
     userModel.register(userdata, req.body.password)
       .then(function(registereduser) {
        passport.authenticate("local")(req, res, function() {
            res.redirect('/profile');
        });
    })
    .catch(function(err) {
        // Handle any potential error here
        console.error(err);
        // Respond with an error message or redirect appropriately
    });
  });

router.post("/login",passport.authenticate("local", {
  successRedirect:"/profile",
  failureRedirect:"/login"
}), function(req, res){ })

router.get("/logout" , function(req, res, next){
  req.logout(function(err){
    if(err) { return next(err); }
    res.redirect('/');  
  });
});
// jab use login ho toh 

function isLoggedIn(req, res,next){
  if(req.isAuthenticated())  return next();
    res.redirect("/login")
}

module.exports = router;
