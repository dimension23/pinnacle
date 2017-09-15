var express = require('express');
var router = express.Router();
var multer = require('multer');
var app = express();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
  }
});

var upload = multer({storage: storage});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Change Tracker', version: 'v0.1' });
});

router.post('/uploadLeft', upload.single('leftFile'), function(req, res, next){
  res.status(200).send(req.file);
});

router.post('/uploadRight', upload.single('rightFile'), function(req, res, next){
  res.status(200).send(req.file);
});

module.exports = router;
