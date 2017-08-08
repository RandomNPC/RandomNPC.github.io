$(document).ready(function(){

  $("#input td:nth-child(3) input").change(function(){
    var index = $.inArray(this,$("#input td:nth-child(3) input"));
    var content = $(this).val();

    $("#output tr:eq("+index*2+") td:eq(2)").text((content === "") ? "" : " via " +content);
    UpdateLink();
  });

  $("#post").click(function(){

  });
});

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
