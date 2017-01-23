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
var db = mongojs('mongodb://shubham20.yeole:shubham20.yeole@ds163387.mlab.com:63387/paceteam3', collections)
var app = express();
var ObjectId = mongojs.ObjectId;
var passport = require("passport")
var JSFtp = require("jsftp");
var fs = require('fs');
var config = {
  host: 'ftp.byethost7.com',
  port: 21,
  user: 'b8_19205430',
  password: 'Shubham4194'
}
// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname)));
// body parser middleware
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb',extended: false}));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname)));

var multiparty = require('connect-multiparty'),
  multipartyMiddleware = multiparty();
  app.use(multipartyMiddleware);
    app.use(function(req, res, next){
      fs.appendFile('logs.txt', req.path + "token:" + req.query.access_token+'', 
        function(err){
          next(); 
        });
  });

app.get('/', function(req, res){       
  db.documentscategory.find({}).skip(0).sort({timestamp: -1}).limit(9).toArray(function (err, documentscategory) {
    db.documents.find({}).skip(0).sort({timestamp: -1}).limit(119).toArray(function (err, documents) {
      res.render("index.ejs", {documentscategory: documentscategory, documents: documents});
    });
  });
});

app.post('/uploadsinglefile', function(req, res){       
  var file = req.files.file;
  var date = new Date();
  var datetime = (date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear()+" ("+date.getHours()+":"+date.getMinutes()+")";
  var timestamp = new Date().valueOf();
  var Client = require('ftp');
  var extension = req.body.ext;
  var category = req.body.finalcategory;
  var status = req.body.finalstatus;
  var c = new Client();
  c.on('ready', function() {
      c.put(file.path, 'htdocs/documents/shubham-'+timestamp+'-'+file.originalFilename, function(err) {
        if (err) throw err;
        c.end();
      });        
  });
  c.connect(config);
  db.documentscategory.findOne({ 'catname': category}, function (err, catObject) {
    if(catObject==null){
      var newCategory = { catname: category, size: 1, timestamp: timestamp};
      db.documentscategory.insert(newCategory, function(err, result){if(err){console.log(err);}});
    }else{
      var size = catObject.size;
      db.documentscategory.update({'catname': category},{$set : {size: size+1}},{upsert:true,multi:false});
    }
  });
    var frame = "";
    var ext = extension;
    var thumbnail = "";
    // iframepdf iframedoc iframeimg
    var url = 'http://shubhamyeole.byethost8.com/documents/shubham-'+timestamp+'-'+file.originalFilename;
      if(ext.includes("docx") || ext.includes("doc") || ext.includes("DOCX") || ext.includes("DOC")) {
        frame="<iframe class='iframedoc' src='http://docs.google.com/viewer?url="+url+"?>&embedded=true'></iframe>";
        thumbnail = "images/word.jpg";
      }
      if(ext.includes("jpg") || ext.includes("jpeg") || ext.includes("png") || ext.includes("JPG") || ext.includes("JPEG") || ext.includes("PNG")){
        frame="<img class='iframeimg' src='"+url+"'>";
        thumbnail = url;
      }
      if(ext.includes("pdf") || ext.includes("PDF")){
        frame="<iframe class='iframepdf' src='"+url+"'></iframe>";
        thumbnail = "images/pdf.jpg";
      } 
     if(ext.includes("mp4") || ext.includes("MP4") || ext.includes("webm") || ext.includes("WEBM") || ext.includes("3gp") || ext.includes("3GP")){
        frame="<video controls class='iframemovie' muted='true' autoplay='true'><source src="+url+" type='video/mp4'></video>";
        thumbnail = "images/video.jpg";
      } 
      if(ext.includes("mp3") || ext.includes("MP3")){
        frame="<video controls class='iframemusic' muted='true' autoplay='true'><source src='"+url+"' type='video/ogg'></video>";
        thumbnail = "images/audio.jpg";
      }
      var newDocument = {
        name: file.originalFilename,
        frame: frame,
        link: url,
        datetime: datetime,
        category: category,
        thumbnail: thumbnail,
        timestamp: timestamp
      }
      db.documents.insert(newDocument, function(err, result){
        if(err){console.log(err);}
      });
  
  setTimeout(function(){
    res.redirect("/");
  },10000);
});



app.post('/upload', function(req, res){       
  var file = req.files.file;
  var date = new Date();
  var datetime = (date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear()+" ("+date.getHours()+":"+date.getMinutes()+")";
  var timestamp = new Date().valueOf();
  var Client = require('ftp');
  var extension = req.body.ext;
  var category = req.body.finalcategory;
  var status = req.body.finalstatus;
  var c = new Client();
  c.on('ready', function() {
    for(i=0; i<file.length; i++){
      c.put(file[i].path, 'htdocs/documents/shubham-'+timestamp+'-'+file[i].originalFilename, function(err) {
        if (err) throw err;
        c.end();
      });        
    }
  });
  c.connect(config);
  db.documentscategory.findOne({ 'catname': category}, function (err, catObject) {
    if(catObject==null){
      var newCategory = { catname: category, size: file.length, timestamp: timestamp};
      db.documentscategory.insert(newCategory, function(err, result){if(err){console.log(err);}});
    }else{
      var size = catObject.size;
      db.documentscategory.update({'catname': category},{$set : {"size": size+file.length}},{upsert:true,multi:false});
    }
  });
  for(i=0; i<file.length; i++){
    var frame = "";
    var ext = extension[i];
    var thumbnail = "";
    // iframepdf iframedoc iframeimg
    var url = 'http://shubhamyeole.byethost8.com/documents/shubham-'+timestamp+'-'+file[i].originalFilename;
      if(ext.includes("docx") || ext.includes("doc") || ext.includes("DOCX") || ext.includes("DOC")) {
        frame="<iframe class='iframedoc' src='http://docs.google.com/viewer?url="+url+"?>&embedded=true'></iframe>";
        thumbnail = "images/word.jpg";
      }
      if(ext.includes("jpg") || ext.includes("jpeg") || ext.includes("png") || ext.includes("JPG") || ext.includes("JPEG") || ext.includes("PNG")){
        frame="<img class='iframeimg' src='"+url+"'>";
        thumbnail = url;
      }
      if(ext.includes("pdf") || ext.includes("PDF")){
        frame="<iframe class='iframepdf' src='"+url+"'></iframe>";
        thumbnail = "images/pdf.jpg";
      } 
      if(ext.includes("mp4") || ext.includes("MP4") || ext.includes("webm") || ext.includes("WEBM") || ext.includes("3gp") || ext.includes("3GP")){
        frame="<video controls class='iframemovie' muted='true' autoplay='true'><source src="+url+" type='video/mp4'></video>";
        thumbnail = "images/video.jpg";
      } 
      if(ext.includes("mp3") || ext.includes("MP3")){
        frame="<video controls class='iframemusic' muted='true' autoplay='true'><source src='"+url+"' type='video/ogg'></video>";
        thumbnail = "images/audio.jpg";
      }
       var newDocument = {
        name: file[i].originalFilename,
        frame: frame,
        link: url,
        datetime: datetime,
        category: category,
        thumbnail: thumbnail,
        timestamp: timestamp
      }
      db.documents.insert(newDocument, function(err, result){
        if(err){console.log(err);}
      });
  }
  setTimeout(function(){
    res.redirect("/");
  },10000);
});


app.post('/getItems', function(req, res){   
  var catname = req.body.catname;
  db.documents.find({category: catname}, function (err, items) {
    console.log(items.length);
    res.send(items);    
  });
});

app.post('/searchDocument', function(req, res) {
  var keyword = req.body.keyword;
   db.documents.find({ name: {'$regex': keyword, '$options' : 'i'} }, function (err, documents) {
      console.log(documents.length);
    res.send(documents);
  });
});



app.listen(port, function() {
  console.log('Listening on port ' + port)
})

