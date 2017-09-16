var express = require('express');
var router = express.Router();
var fs = require('fs');
var xmlreader = require('xmlreader');
var levenshtein = require('fast-levenshtein');

router.get('/', function(req, res, next) {
  res.render('response', { title: 'Change Tracker', version: 'v0.1', data: data});
});

module.exports = router;
