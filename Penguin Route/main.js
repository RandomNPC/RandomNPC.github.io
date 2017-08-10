$(document).ready(function(){

  $.each($("#input li > table td:first-child"),(index,value)=>{
    $(value).text(index+1);
  });

  $("#input li > table td:last-child").change(()=>{
    UpdateRoute();
    UpdateLink();
  });

  $("#input").sortable({
    stop: function(event,ui){
      UpdateRoute();
      UpdateLink();
    }
  });


});

function UpdateRoute(){
  $.each($("#input li > table td:first-child"),(index,value)=>{
    $(value).text(index+1);
  });

  var stop_names = $.map($("#input li > table td:nth-child(2) >"),(value)=>{return $(value).val();});

  $.each($("#output tr:even > :nth-child(2)"),(index,value)=>{
    var current_stop = stop_names[index];

    $(value).text(current_stop);


    var $node = $("#output tr:even:eq("+ index+") td:first-child");


    if(current_stop!="")
    {
      $node.show();
    }
    else {
      $node.hide();
    }

    if(index > 0)
    {
      var $divide = $("#output tr:odd:eq("+ (index-1)+") td:first-child");
      
      if(current_stop!="")
      {
        $divide.show();
      }
      else{
        $divide.hide();
      }
    }

  });

  var via_names = $.map($("#input li > table td:nth-child(3) >"),(value)=>{return $(value).val();});


  $.each($("#output tr:even > :nth-child(3)"),(index,value)=>{
    var current_via = via_names[index];
    var stop_text = $("#input li:nth-child("+(index+1)+") > table td:nth-child(2) >").val();

    if(current_via!="" && stop_text!=""){
      $(value).text("via " + current_via);
    }
    else {
      $(value).text("");
    }
  });
}

function UpdateLink()
{
  html2canvas(document.getElementById("output"),{
    onrendered: function(canvas) {
      var dt = canvas.toDataURL('image/jpeg');
      dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
      dt = dt.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=Canvas.png');

      $("#post").attr("href",dt);
    },
    allowTaint:true,
    useCORS: true,
  });
}
