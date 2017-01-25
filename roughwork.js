var express = require('express');
var SparkPost = require('sparkpost');
var sp = new SparkPost('*************');
var port = process.env.PORT || 3000
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs')
var mongodb = require('mongodb')
var collections = ["locations", "documentscategory", "documents"]
var db = mongojs('mongodb://********:***********@ds163387.mlab.com:*******/***********', collections)
var app = express();
var ObjectId = mongojs.ObjectId;
var passport = require("passport")
var JSFtp = require("jsftp");
var fs = require('fs');
var config = {
  host: 'ftp.******.com',
  port: 21,
  user: '**********',
  password: '*************'
}