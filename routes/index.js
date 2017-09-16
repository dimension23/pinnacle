var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var xmlreader = require('xmlreader');
var levenshtein = require('fast-levenshtein');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname)
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

router.post('/computeDiff', function(req, res, next){

  var machineArray = new Array();
  var humanArray = new Array();
  var idArray = new Array();
  var jsonArray = new Array();

  var machineFile = fs.readFileSync('./uploads/leftFile','utf8');
  var humanFile = fs.readFileSync('./uploads/rightFile','utf-8');

  machineFile = machineFile.toString();
  humanFile = humanFile.toString();

  xmlreader.read(machineFile, function(err, res){
    if(err) return console.log(err);
    for(var i = 0; i < res.xliff.file.unit.count(); i++){
      machineArray.push(res.xliff.file.unit.at(i).segment.target.text());
      idArray.push(res.xliff.file.unit.at(i).attributes().id);
    }
  });

  xmlreader.read(humanFile, function(err, res){
    if(err) return console.log(err);
    for(var i = 0; i < res.xliff.file.unit.count(); i++){
      humanArray.push(res.xliff.file.unit.at(i).segment.target.text());
    }
  });

  for (var i=0; i < idArray.length; i++) {
     var distance = levenshtein.get(humanArray[i], machineArray[i]);
     if (distance > 0) {
       var jsonObject = {'id': idArray[i], 'original': machineArray[i], 'changed': humanArray[i], score: distance};
       jsonArray.push(jsonObject);
     }
  }

  var results = jsonArray;
  res.render('response', {data: results});

});

module.exports = router;
