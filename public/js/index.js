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
                '<button type="button" class="remove_field btn btn-danger"><i class="fa fa-remove"></i> Remove</button></div>'
            );
        }
    });
    
    $(wrapper).on("click",".remove_field", function(e){ //user click on remove text
        e.preventDefault(); $(this).parent('div').remove(); x--;
    })
});


$(document).on("change",".select",function() { 
    var cate = $(this).val();
    $("#final-category").val(cate);
});

$(document).on("keyup","#cat-write",function() { 
    var cate = $(this).val();
    $("#final-category").val(cate);
});

$(document).on("change",".file",function() { 
    var file = $(this).val();
    var ext = file.split('.').pop();
    var count = 0;
    $(this).next('input').val(ext);
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
            appendItems = '<div><p class="itemname">'+items[i].name+'</p><input type="hidden" value="'+items[i].frame+'"></div>'+ appendItems;
        }

        $("#items").html(appendItems);
        $("#load").html('');
    })
})

$(document).on("click",".itemname", function(){
    var frame = $(this).next('input').val();
    $("#load1").html('<img src="images/load.gif">');
    setTimeout(function(){
        $("#iframediv").html(frame);
        $("#load1").html('');
    },500);
})

