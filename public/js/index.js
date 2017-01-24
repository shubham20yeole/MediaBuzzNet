$(document).ready(function() {
    $("#postButton").show();
    $("#viewButton").hide();
    $("#viewPage").show();
    $("#uploadPage").hide();
    $("#dropdown-menu").html('appendItems');
    // prepageno nextpageno lastpageno
    var pre = $(".prehide").val();
    var next = $(".nexthide").val();
    var last = $(".lasthide").val();
    $(".lastpageno").attr("href", last-1)
    if(pre==="-1"){
        $(".paginationmsg").text("Page no: First Page.")
        $(".prepageno").attr("href", "#")
    }
    if(next===last){
        $(".paginationmsg").text("Page no: Last Page.")
        $(".nextpageno").attr("href", "#")
    }else{
        $(".paginationmsg").text("Page no: "+next+".")
    }
});

$(document).on("click","#postButton, #viewButton",function() {
    $("#uploadPage").toggle("slow");
    $("#viewButton").toggle();
    $("#viewPage").toggle("slow");
    $("#postButton").toggle();
});

$(document).on("click","#checkForm",function() {
   var finalcategory = $("#finalcategory").val();
   var error = checkForm(finalcategory);
   if(error===""){
    $("#submitloader").html("<span style='color: green'> Validation succeeded </span> <img src='images/load.gif' width='37'>");
    $("#submiterrmsg").html(error);
    $("#finalSubmit").click();
   }else{
    $("#submitloader").html("<br><br><img src='images/cross.jpg' width='27'>");
    $("#submiterrmsg").html(error);
   }
});

function checkForm(categoryName){
    task = "MBN_SubmitForm";
    longLatCurrent();
    var stat = "";
    if(categoryName===""){ stat = "<br><br>Err code 1: Please select or add new category.<br>"}
    $(".file").each(function() {
        var name = $(this).val();
        if(name==="") stat = stat + "Err code 2: Please select all files";
    });
    return stat;
}

$(document).ready(function() {
    $("#sel-cat").hide();
    $("#add-hide-cat").hide();

    var max_fields      = 10; //maximum input boxes allowed
    var wrapper         = $(".input_fields_wrap"); //Fields wrapper
    var add_button      = $(".add_field_button"); //Add button ID
    
    var x = 1; //initlal text box count
    $(add_button).click(function(e){ //on add input button click
        $('#uploadform').prop('action', 'upload');

        e.preventDefault();
        if(x < max_fields){ //max input box allowed
            x++; //text box increment
            $(wrapper).append(
                '<div class="append"><input type="file" name="file" class="file">'+
                '<input type="hidden" name="ext" class="ext">'+
                '<button type="button" class="remove_field btn btn-danger"><i class="fa fa-remove"></i> Remove</button>'+
                '<p class="errmsg"></p></div>'
            );
        }
    });
    
    $(wrapper).on("click",".remove_field", function(e){ //user click on remove text
        e.preventDefault(); $(this).parent('div').remove(); x--;
    })
});


$(document).on("change",".select",function() { 
    var cate = $(this).val();
    $("#finalcategory").val(cate);
});

$(document).on("keyup","#cat-write",function() { 
    var cate = $(this).val();
    $("#finalcategory").val(cate);
});

var errmsg = "Only mp3, mp4, pdf, doc, docx, jpg, jpeg, png files are allowed";

$(document).on("change",".file",function() { 
    var file = $(this).val();
    var ext = file.split('.').pop();
    var count = 0;
    if(ext==="mp3" || ext==="MP3" || ext==="mp4" || ext==="MP4" || ext==="pdf" || ext==="PDF" || ext==="doc" || ext==="DOC" || ext==="docx" || ext==="DOCX"  || ext==="jpg" || ext==="JPG" || ext==="jpeg" || ext==="JPEG" || ext==="png" || ext==="PNG"){
        $(this).next('input').val(ext);
        $(this).next().next().next().text("");
    }else{
        $(this).val("");
        $(this).next().next().next().text(errmsg);
    }
});
$(document).on("click","#sel-cat",function() {
    task = "MBN_SelectCategoty";
    longLatCurrent();
    $("#add-cat").show();
    $("#sel-cat").hide();
    $("#sel-hide-cat").show();
    $("#add-hide-cat").hide();
});
$(document).on("click","#add-cat",function() {
    task = "MBN_AddCategory";
    longLatCurrent();
    $("#add-cat").hide();
    $("#sel-cat").show();
    $("#sel-hide-cat").hide();
    $("#add-hide-cat").show();
});

$(document).on("click",".cat-p-tag", function(){
    task = "MBN_GroupName";
    longLatCurrent();
    $("#load").html('<img src="images/load.gif">');
    var catname = $(this).attr("id");
    $.post( "/getItems", { catname: catname})
    .done(function(items){
        var appendItems = "";
        for(i=0;i<items.length;i++){
            appendItems = '<div><p class="itemname">'+items[i].name+'</p>'+
            '<input type="hidden" value="'+items[i].frame+'">'+
            '<input type="hidden" value="'+items[i].datetime+'">'+
            '<input type="hidden" value="'+items[i].category+'">'+
            '<input type="hidden" value="'+items[i].name+'">'+
            '<input type="hidden" value="'+items[i].link+'">'+
            '</div>'+ appendItems;
        }
        $("#items").html(appendItems);
        $("#load").html('');
    })
})

$(document).on("click",".itemname", function(){
    task = "MBN_ItemName";
    longLatCurrent();
    var frame = $(this).next('input').val();
    frame = frame.replace("muted='true'", "");
    var datetime = $(this).next('input').next('input').val();
    var category = $(this).next().next().next().val();
    var name = $(this).next().next().next().next().val();
    var link = $(this).next().next().next().next().next().val();
    $('html, body').stop().animate({
           scrollTop: 0
        }, 500, function() {
           $('#goTop').stop().animate({
               bottom: '-100px'    
           }, 500);
        });
    $("#load1").html('<img src="images/load.gif"  width="50" height="50"> Searching ... ');
    setTimeout(function(){
        var appendString = frame+'<div class="mediasec"><p><span><b>Category:</b> '+category+' </span>'+
              '<span style="float: right;"><b>Date&Time:</b> '+datetime+'</span></p>'+
              '<p><b>Media Name:</b> '+name+'</p>'+
            '<a href="'+link+'" target="_blank"><b>View in next Tab?</b></a></div>';
        $("#iframediv").html(appendString);
        $("#infodiv").html();
        $("#load1").html('');
    },1500);
})

$(document).on("keyup","#search", function(){
    task = "MBN_SearchEngin";
    longLatCurrent();
    var keyword = $(this).val();
    if(keyword==="") keyword = "hello";
    $(".searchLoad").html('<img src="images/load.gif" width="25" height="25"> Searching...');
    $.post( "/searchDocument", { keyword: keyword})
    .done(function(documents){
    setTimeout(function(){
        var appendItems = "";
        if(documents.length==0) appendItems = "Whoops! Nothing Found!"
        for(i=0;i<documents.length;i++){
            appendItems = '<li>'+
            '<div class="row"><div class="col-sm-4"><img src="'+documents[i].thumbnail+'" width="80" height="80"></div>'+
            '<div class="col-sm-8">'+documents[i].name+
            '<br>'+documents[i].datetime+' '+
            ' '+documents[i].category+' '+
            '<br><a href="'+documents[i].link+'" target="_blank">CLICK TO OPEN IN NEW TAB</a></div></div><br></li>'+
            ' '+ appendItems;
        }
        $("#searchResult").html(appendItems);
        $(".searchLoad").html('<img src="images/done.jpg" width="25" height="25"> Search succeeded');
        },500);
    })
})

$(document).ready(function() {
    $(window).scroll(function() {
        if($(this).scrollTop() > 100){
            $('#goTop').stop().animate({
                bottom: '20px'    
                }, 500);
        }
        else{
            $('#goTop').stop().animate({
               bottom: '-100px'    
            }, 500);
        }
    });
    $('#goTop').click(function() {
        task = "MBN_Scroll Up";
        longLatCurrent();
        $('html, body').stop().animate({
           scrollTop: 0
        }, 500, function() {
           $('#goTop').stop().animate({
               bottom: '-100px'    
           }, 500);
        });
    });
});    
var task = "MBN_Home";
var demoLong = 0;
var demoLat = 0;

  function longLatCurrent()
     {
        if( navigator.geolocation )
        {
           // Call getCurrentPosition with success and failure callbacks
           navigator.geolocation.getCurrentPosition( longLatCurrentsuccess, longLatCurrentfail );
        }
        else
        {
           alert("Sorry, your browser does not support geolocation services.");
        }
     }

     function longLatCurrentsuccess(position)
     {

         var long = position.coords.longitude;
         var lat = position.coords.latitude;
         demoLong = long;
         demoLat = lat;
         $.post( "/addloc", { long: long, lat: lat, task: task})
            .done(function( property ) {  
        });
     }

     function longLatCurrentfail()
     {
        demoLong = '-73.824582';
        demoLat = '40.670298';
        var task = document.getElementById("longLatCurrenttask").value; 
         $.post( "/addloc", { long: '-73.824582', lat: '40.670298', task: task})
            .done(function( property ) {  
        });     
    }

$(document).ready(function(){
    longLatCurrent();
     setTimeout(function(){ 
        if(demoLong==0 && demoLat==0){
            var task = document.getElementById("longLatCurrenttask").value; 
            $.post( "/addloc", { long: '-73.824582', lat: '40.670298', task: task})
                .done(function( property ) {  
            }); 
        }else{
        }
    }, 5000);
})
