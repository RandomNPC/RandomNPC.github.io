function UpdateVideoDisplay()
{
  $.each($("#content-home .card"),function(index,value){
    var $list = $(value).find(".list");
    var name = $(value).find(".text").text().replace(/^\s+|\s+$/g,"");

    var yaka_role = "DPS";
    var bm_role = "DPS";

    $.each($list.children(),function(i,v){
      var role_id = $(v).attr("class").split(' ')[3].match(/\d+/g)[0];
      var role_name = $(v).text();
    });

  });

}
