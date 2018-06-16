const express = require('express');
const router = express.Router();
let Settings = require('../models/settings');




router.get('/Settings/edit/:id', function(req, res) {
    Settings.findById(req.params.id, function(err, settings) {
        if (err) {
            console.log(err);
        }
        res.render('pages/editSettings', {
            title: 'SATMATRAT',
            setting: settings
        });
    });
})
router.get('/Settings', function(req, res) {

    Settings.find({}, function(err, settings) {
        if (err) {
            console.log(err);
        } else {
            res.render('pages/Settings', {
                title: 'SAT MAT RAT- Settings',
                settings: settings
            });
        }
    });


});
router.post('/Settings', function(req, res) {
    let settings = new Settings();
    settings.message = req.body.message;
    settings.title = req.body.title;



    settings.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            {

                res.redirect('/Settings');
            }
        }
    });
});
router.delete('/Settings/:id', function(req, res) {
    let query = { _id: req.params.id }

    setting.remove(query, function(err) {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    })
});


router.post('/Settings/edit/:id', function(req, res) {
    let setting = {};
    setting.title = req.body.title;
    setting.message = req.body.message;



    let query = { _id: req.params.id }
    Settings.update(query, setting, function(err) {
        if (err) {
            console.log(err);
        } else {
            {

                res.redirect('/Settings');
            }
        }
    })

})
module.exports = router;