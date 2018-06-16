const express = require('express');
const router = express.Router();

//Bring article model
let Satta = require('../models/satta');
let Settings = require('../models/settings');



function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'please login');
        res.redirect('/login');
    }
}

router.get('/', ensureAuthenticated, function(req, res) {

    Satta.find({}, function(err, sattas) {
        if (err) {
            console.log(err);
        } else {


            Settings.find({}, function(err, settings) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('pages/index', {
                        title: 'SAT MAT RAT',
                        satta: sattas,
                        settings: settings
                    });
                }
            });



            // res.render('pages/index', {
            //     title: 'SAT MAT RAT',
            //     satta: sattas
            // });
        }
    });


})
router.post('/satta', ensureAuthenticated, function(req, res) {
    let satta = new Satta();
    satta.name = req.body.name;
    satta.number = req.body.number;
    satta.time = req.body.time;
    satta.date = req.body.date;


    satta.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            {

                res.redirect('/');
            }
        }
    });
})

router.get('/satta/edit/:id', ensureAuthenticated, function(req, res) {
    Satta.findById(req.params.id, function(err, sattas) {
        res.render('pages/edit', {
            title: 'SATMATRAT',
            sattan: sattas
        });
    });
})



router.delete('/:id', ensureAuthenticated, function(req, res) {
        let query = { _id: req.params.id }

        Satta.remove(query, function(err) {
            if (err) {
                console.log(err);
            }
            res.redirect('/');
        })
    })
    .post('/satta/edit/:id', ensureAuthenticated, function(req, res) {
        let satta = {};
        satta.name = req.body.name;
        satta.number = req.body.number;
        satta.date = req.body.date;
        satta.time = req.body.time;


        let query = { _id: req.params.id }
        Satta.update(query, satta, function(err) {
            if (err) {
                console.log(err);
            } else {
                {

                    res.redirect('/');
                }
            }
        })

    })
module.exports = router;