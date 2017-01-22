$(document).ready(function() {
    $("#postButton").show();
    $("#viewButton").hide();
    $("#viewPage").show();
    $("#uploadPage").hide();
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
    $("#add-cat").show();
    $("#sel-cat").hide();
    $("#sel-hide-cat").show();
    $("#add-hide-cat").hide();
});
$(document).on("click","#add-cat",function() {
    $("#add-cat").hide();
    $("#sel-cat").show();
    $("#sel-hide-cat").hide();
    $("#add-hide-cat").show();
});

$(document).on("click",".cat-p-tag", function(){
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
    var frame = $(this).next('input').val();
    frame = frame.replace("muted='true'", "");
    var datetime = $(this).next('input').next('input').val();
    var category = $(this).next().next().next().val();
    var name = $(this).next().next().next().next().val();
    var link = $(this).next().next().next().next().next().val();
    $("#load1").html('<img src="images/load.gif">');
    setTimeout(function(){
        var appendString = frame+'<div class="mediasec"><p><span><b>Category:</b> '+category+' </span>'+
              '<span style="float: right;"><b>Date&Time:</b> '+datetime+'</span></p>'+
              '<p><b>Media Name:</b> '+name+'</p>'+
            '<a href="'+link+'" target="_blank"><b>View in next Tab?</b></a></div>';
        $("#iframediv").html(appendString);
        $("#infodiv").html();
        $("#load1").html('');

    },500);
})

