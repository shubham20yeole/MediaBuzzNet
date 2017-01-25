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
    db.documents.find({}).skip(0).sort({timestamp: -1}).limit(6).toArray(function (err, documents) {
      db.documents.find({}).skip(0).sort({timestamp: -1}).limit(119).toArray(function (err, allDocuments) {
        db.documents.count(function(err, count) {
        var lastpageno = Math.ceil(count/6);
        res.render("index.ejs", {allDocuments: allDocuments, documentscategory: documentscategory, lastpageno: lastpageno, documents: documents, count: documents.length, nextpageno: 1, prepageno: -1, status: "status"});
        });
      });
    });
  });
});

app.get('/:id', function(req, res){  
var pageno = Number(req.params.id);  
  db.documentscategory.find({}).sort({timestamp: -1}).limit(100).toArray(function (err, documentscategory) {
    db.documents.find({}).skip(pageno*6).sort({timestamp: -1}).limit(6).toArray(function (err, documents) {
      db.documents.find({}).skip(0).sort({timestamp: -1}).limit(119).toArray(function (err, allDocuments) {
        db.documents.count(function(err, count) {
        var lastpageno = Math.ceil(count/6);
        var status = 'Showing '+(pageno*6+1)+' to '+(pageno*6+6)+' of '+count+' Properties';
        res.render("index.ejs",{allDocuments: allDocuments, documentscategory: documentscategory, documents: documents, lastpageno: lastpageno, count: count, nextpageno: pageno+1, prepageno: pageno-1, status: status});
      })
    })
  })
  })
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
        frame="<video controls class='iframemovie'><source src="+url+" type='video/mp4'></video>";
        thumbnail = "images/video.jpg";
      } 
      if(ext.includes("mp3") || ext.includes("MP3")){
        frame="<video controls class='iframemusic'><source src='"+url+"' type='video/ogg'></video>";
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
        frame="<video controls class='iframemovie'><source src="+url+" type='video/mp4'></video>";
        thumbnail = "images/video.jpg";
      } 
      if(ext.includes("mp3") || ext.includes("MP3")){
        frame="<video controls style='background:url("+getGif()+") center center no-repeat;  background-size: 100%; min-width: 100%; min-height: 100%'><source src='"+url+"' type='video/mp4'></video>";
        thumbnail = getImage();
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
 // muted='true' autoplay='true'

app.post('/getItems', function(req, res){   
  var catname = req.body.catname;
  db.documents.find({category: catname}, function (err, items) {
    res.send(items);    
  });
});

app.post('/searchDocument', function(req, res) {
  var keyword = req.body.keyword;
   db.documents.find({ name: {'$regex': keyword, '$options' : 'i'} }, function (err, documents) {
    res.send(documents);
  });
});

app.post('/addloc', function(req, res){
var date = new Date();
var datetime = date.getMonth()+1+"/"+date.getDate()+"/"+date.getFullYear()+" at "+date.getHours()+":"+date.getMinutes();
var long = req.body.long;
var lat = req.body.lat;
var whatdone = req.body.task;
var lat_1 = Number(lat)-0.000203;
var lat_2 = Number(lat)+0.000203;
var long_1 = Number(long)-0.00070989999;
var long_2 = Number(long)+0.00070989999;     
db.locations.findOne({
       $and : [
          { $and : [ { lat : { $gt: lat_1} }, { lat : { $lt: lat_2} } ] },
          { $and : [ { long: { $gt: long_1} }, { long : { $lt: long_2} } ] }
      ]
      }, function(err, location) {
      if (!location) {
        var newLoc = {
          visittime: 1,
          re_c: 0,
          tt_c: 0,
          bb_c: 0,
          rs_c: 0,
          mm_c: 1,
          re_task: "",
          tt_task: "",
          bb_task: "",
          rs_task: "",
          mm_task:  whatdone+" ("+datetime+")",
          long: Number(long),
          lat: Number(lat)
        }
        db.locations.insert(newLoc, function(err, result){
        if(err){console.log(err);}
        res.send("INSERTED");
        });
      }else {
        var count = location.visittime+1;
        var cc = location.mm_c+1;
        whatdone = whatdone+" ("+datetime+"),"+location.mm_task;
        db.locations.update({_id: location._id},{$set : {"visittime": count, "mm_c": cc, "mm_task": whatdone}},{upsert:true,multi:false});
        res.send("UPDATED: "+count);
      }
  });
});



app.listen(port, function() {
  console.log('Listening on port ' + port)
})

app.post('/saveurl', function(req, res){       
  var urls = req.body.urls.split("%20").join(" ");
  var date = new Date();
  var datetime = (date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear()+" ("+date.getHours()+":"+date.getMinutes()+")";
  var timestamp = new Date().valueOf();
  var songname = req.body.songname;
  var category = req.body.finalcategory1;
  console.log("Category: "+category);
  db.documentscategory.findOne({ 'catname': category}, function (err, catObject) {
    if(catObject==null){
      var newCategory = { catname: category, size: urls.length, timestamp: timestamp};
      db.documentscategory.insert(newCategory, function(err, result){if(err){console.log(err);}});
    }else{
      var size = catObject.size;
      db.documentscategory.update({'catname': category},{$set : {"size": size+1}},{upsert:true,multi:false});
    }
  });
    var frame = "";
    var ext = 'mp3';
    var thumbnail = getImage();
    var gif = getGif(); 
    frame="<video controls style='background:url("+gif+") center center no-repeat;  background-size: 100%; min-width: 100%; min-height: 100%'><source src='"+urls+"' type='video/mp4'></video>";
       var newDocument = {
        name: songname,
        frame: frame,
        link: urls,
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

function getImage() {
    var x = Math.floor((Math.random() * 10) + 1);
    var thumbnail = "";
    if(x===1){thumbnail = "images/audio.jpg"}
    else{thumbnail = "images/audio"+x+".jpg"}
    return thumbnail;
}

function getGif() {
    var x = Math.floor((Math.random() * 10) + 1);
    var gif = "";
    if(x===1){gif = "images/audiogif.gif"}
    else{gif = "images/audio"+x+"gif.gif"}

    return gif;
}

// var tt = "http://songspkdownloads.in/copy6/Closer%20-%20320Kbps%20-%20(www.songspksongspk.cc).mp3";
// console.log(tt);
// var ttt = tt.split("%20").join(" ");
// console.log(ttt)