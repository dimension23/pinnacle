var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var xmlreader = require('xmlreader');
var levenshtein = require('fast-levenshtein');
var stats = require("cb-fast-stats").Stats;
var statsArray = require('stats-array');

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
  var distArray = new Array();
  var faultSegments = 0;

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
       faultSegments = faultSegments + 1;
       distArray.push(distance);
       jsonArray.push(jsonObject);
     }
  }

  // some statistics on distances
  var avgDistance = distArray.mean();
  var minDistance = distArray.min();
  var maxDistance = distArray.max();
  var totalSegments = idArray.length;

  // distribution
  var statsObj = new stats({buckets:[[minDistance, avgDistance].mean(), avgDistance, [avgDistance, maxDistance].mean()]}).push(distArray);
  var d = statsObj.distribution();
  var trivialChanges = d[0].count;
  var minorChanges = d[1].count;
  var majorChanges = d[2].count;
  var criticalChanges = d[3].count;

  var results = jsonArray;

  res.render('response', {data: results, total: totalSegments, faults: faultSegments,
    trivial: trivialChanges, minor: minorChanges, major: majorChanges, critical: criticalChanges});

});

module.exports = router;
