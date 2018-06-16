const express = require('express')
const cool = require('cool-ascii-faces')
const path = require('path')
const crypto = require('crypto')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator');
const expressMessages = require('express-messages');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage')
const config = require('./config/database')

require('./config/passport')(passport);








// function ensureAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     } else {
//         req.flash('danger', 'please login');
//         res.redirect('/login');
//     }
// }







// const URI = 'mongodb://maheshkareeya:mahesh619619Key@ds237610.mlab.com:37610/qcom';
// const URI = 'mongodb://localhost/qcom';
mongoose.connect(config.database)
    .then(db => console.log('Db is connected'));
let gfs;
const conn = mongoose.createConnection(config.database);


conn.once('open', () => {
    //Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
})
const storage = new GridFsStorage({
    url: config.database,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });


let Satta = require('./models/satta');
let satta = require('./routes/satta');
let Settings = require('./models/settings');
let settings = require('./routes/settings');
let Users = require('./models/user');
let users = require('./routes/users');
// let Upimg = require('./models/upimg');
// let upimg = require('./routes/upimg');


require('./config/passport');
express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'pug')
    .use(methodOverride('_method'))
    //Express session middleware
    .use(session({
        secret: 'keyboard cat',
        resave: true,
        saveUninitialized: true

    }))

//Express session

.use(require('connect-flash')())
    .use(function(req, res, next) {
        res.locals.messages = require('express-messages')(req, res);
        next();
    })


// Express Validator Middleware
.use(expressValidator({
        errorFormatter: function(param, msg, value) {
            var namespace = param.split('.'),
                root = namespace.shift(),
                formParam = root;

            while (namespace.length) {
                formParam += '[' + namespace.shift() + ']';
            }
            return {
                param: formParam,
                msg: msg,
                value: value
            };
        }
    }))
    //Passport Config




//Passport middle ware 
.use(passport.initialize())
    .use(passport.session())


.get('*', function(req, res, next) {
    res.locals.user = req.user || null;
    next();
})






.use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())
    .use('/', satta)
    .use('/', settings)
    .use('/', users)
    .get('/Upimg', function(req, res) {
        gfs.files.find().toArray((err, files) => {


            if (!files || files.length === 0) {
                res.render('pages/upimg', { files: false });

            } else {
                files.map(file => {
                    if (file) {
                        if (file.contentType === 'image/jpeg' || file.contentType === 'image/jpg' || file.contentType === 'image/png') {
                            file.isImage = true;
                        } else {
                            file.isImage = false;
                        }
                    }
                })
            }

            res.render('pages/upimg', { files: files });






        })

    })

.post('/Upimg/upload', upload.single('file'), (req, res) => {
        // res.json({ file: req.file });
        req.flash('success', 'File Uploaded Successfully');
        res.redirect('/Upimg');

    })
    .get('/Results', function(req, res) {

        Satta.find({}, function(err, sattas) {
            if (err) {
                console.log(err);
            } else {


                Settings.find({}, function(err, settings) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.render('pages/Results', {
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
    .get('/Upimg/files', (req, res) => {
        gfs.files.find().toArray((err, files) => {
            //Check files

            if (!files || files.length === 0) {
                return res.status(404).json({
                    err: 'No files exit'
                });
            }

            // readstream = gfs.createReadStream(files);

            // readstream.pipe(res);
            return res.json(files);
        })
    })
    .delete('/Upimg/images/:filename', (req, res) => {
        gfs.remove({ filename: req.params.filename, root: 'uploads' }, function(err, gridStore) {
            if (err) {
                return res.status(404).json({ err: err })
            } else {
                req.flash('success', 'File Deleted Successfully');
                res.redirect('/Upimg');
            }

        });
    })
    .get('/Upimg/files/:filename', (req, res) => {
        gfs.files.find({ filename: req.params.filename }).toArray((err, files) => {
            //Check files
            if (!files || files.length === 0) {
                return res.status(404).json({
                    err: 'No files exit'
                });
            }
            return res.json(files);
        })
    })

//Display image
.get('/Upimg/images/:filename', (req, res) => {
    gfs.files.find({ filename: req.params.filename }).toArray((files) => {


        const readstream = gfs.createReadStream(req.params.filename);
        readstream.pipe(res);



    })
})


.get('/Charts', (req, res) => res.render('pages/Charts'))
    .get('/cool', (req, res) => res.send(cool()))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))