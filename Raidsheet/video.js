function UpdateVideoDisplay()
{

  var video_list = Array.apply(null,Array(19)).map(function(){ return "";});
  var role_list = Array.apply(null,Array(19)).map(function(){ return "";});

  $.each($("#content-home .card"),function(index,value){
    var $list = $(value).find(".list");
    var name = $(value).find(".text").text().replace(/^\s+|\s+$/g,"");

    $.each($list.children(),function(i,v){
      var role_id = $(v).attr("class").split(' ')[3].match(/\d+/g)[0];
      var role_name = $(v).text();
      video_list[role_id-1] = name;
      role_list[role_id-1] = role_name;
    });

  });

  //subset of the six bm roles
  var bm_list = video_list.slice(0,5);

  //get all the player Names
  var bmNames = $.map($("#content-home .text"),function(value){
    var name = $(value).text().replace(/^\s+|\s+$/g,"");
    if(!bm_list.includes(name))
    {
      return name;
    }
  });

  video_list[6] = bmNames.toString();

  //subset of the yaka roles
  var yaka_list = video_list.slice(7,18);

  //get all the player Names
  var yakaNames = $.map($("#content-home .text"),function(value){
    var name = $(value).text().replace(/^\s+|\s+$/g,"");
    if(!yaka_list.includes(name))
    {
      return name;
    }
  });

  video_list[19] = yakaNames.toString();
  role_list.splice(6,1,"DPS");
  role_list.splice(19,0,"DPS");

  $.each(role_list,function(index,value){
    video_list[index] = value + ": " + video_list[index];
  });


  video_list.splice(0,0,"Beastmaster");
  video_list.splice(1,0,"");
  video_list.splice(2,0,"Roles in this video:");
  video_list.splice(10,0,"");
  video_list.splice(11,0,"Yakamaru");
  video_list.splice(12,0,"");
  video_list.splice(13,0,"Roles in this video:");


  var content = "";
  $.each(video_list,function(index,value){ content += value + "\n";});
  $("#output-video").val(content);
}
