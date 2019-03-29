var express = require('express');
var router = express.Router();
var session = require('cookie-session');
var multer  = require('multer');
var _ = require('underscore');

var mysql = require('mysql');
var pool  = mysql.createPool({
  connectionLimit : 10,
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'CaterersHere'
});
/* GET users listing. */
router.get('/home', function(req, res, next) {
  res.render('customerhome', {message: ''});
});

module.exports = router;
