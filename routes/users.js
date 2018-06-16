const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
let User = require('../models/user');
const passport = require('passport');

router.get('/login', function(req, res) {
    res.render('pages/login')
})


router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
)



router.get('/register', function(req, res) {
    res.render('pages/register');
});

router.get('/logout', function(req, res) {

    req.logout();
    req.flash('success', 'Logout Successfully');
    res.redirect('/login');



});
router.post('/register', function(req, res) {

    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;




    let newUser = new User({
        name: name,
        email: email,
        username: username,
        password: password
    });


    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            if (err) {
                console.log('err');
            } else {
                newUser.password = hash;
                newUser.save(function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.redirect('/login');
                    }
                });
            }
        })

    });



});



module.exports = router;