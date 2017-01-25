var express = require('express');
var SparkPost = require('sparkpost');
var sp = new SparkPost('*************');
var port = process.env.PORT || 3000
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs')
var mongodb = require('mongodb')
var collections = ["users", "blog", "comments", "property", "images", "notification", "bookmark", "messages","timetable", "timetablecategory", "timetablequestion", "resume", "skills", "locations"]
var db = mongojs('mongodb://*************:*************@*************.mlab.com:*************/*************', collections)
var app = express();
var ObjectId = mongojs.ObjectId;
var passport = require("passport")
var JSFtp = require("jsftp");
var fs = require('fs');
var config = {
  host: 'ftp.*************.com',
  port: 21,
  user: '*************',
  password: '*************'
}

          <span id="selCatSelect">
            <select class="select">
              <option value="default">Select Category</option>
                <% documentscategory.forEach(function(documentscategory){%>
                  <option value="<%= documentscategory.catname %>"><%= documentscategory.catname %></option>
                <%})%>
            </select>
          </span>
          <button type="button" id="addCatButton" class="btn">Add New Category</button>


          <span id="addCatInput"><input type="text" name="category" id="cat-write" placeholder="Enter category name" autocomplete="off"></span>
          <button type="button" id="selCatButton" class="btn">Select Category</button>