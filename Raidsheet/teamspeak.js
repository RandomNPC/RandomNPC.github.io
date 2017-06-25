$(document).ready(function(){
  $("#content-teamspeak .form-control").change(function(){
    UpdateTeamspeakDisplay();
  });

});

function UpdateTeamspeakDisplay()
{
  var display = '[table]' +"\n"+
                '[tr]'+"\n"+
                '[th][center]'+ $($("#content-teamspeak .form-control")[1]).val() +' GMT, '+ $($("#content-teamspeak .form-control")[0]).val() +'[/center][/th]'+"\n"+
                '[td][center]Hosted by '+ $($("#content-teamspeak .form-control")[2]).val() +'[/center][/td]'+"\n"+
                '[/tr]'+"\n"+
                '[tr]'+"\n"+
                '[td][/td]'+"\n"+
                '[/tr]'+"\n"+
                '[/table]'+"\n"+
                '(Names marked with a * are people learning roles for the first time.)'+"\n"+
                '[table]'+"\n"+
                '[tr][/tr]'+"\n"+
                '[tr]'+"\n"+
                '[th]Name[/th]'+"\n"+
                '[th]Yakamaru[/th]'+"\n"+
                '[th]Beastmaster[/th]'+"\n"+
                '[/tr]'+"\n";


  $.each($("#content-home .card"),function(index,value){
    var $list = $(value).find(".list");
    var name = $(value).find(".text").text().replace(/^\s+|\s+$/g,"");

    var yaka_role = "DPS";
    var bm_role = "DPS";

    $.each($list.children(),function(i,v){
      var role_id = $(v).attr("class").split(' ')[3].match(/\d+/g)[0];
      var role_name = $(v).text();

      if(role_id <= BEASTMASTER_DPS)
      {
        if(bm_role==="DPS")
        {
          bm_role = role_name;
        }
        else {
          bm_role += " + " + role_name;
        }
      }
      else {
        if(yaka_role==="DPS")
        {
          yaka_role = role_name;
        }
        else {
          yaka_role += " + " + role_name;
        }
      }
    });

    display += "[tr]"  + "\n" +
               "[td][center]" + name + "[/center][/td]"  + "\n" +
               "[td][center]"+ yaka_role +"[/center][/td]"  + "\n" +
               "[td][center]"+ bm_role +"[/center][/td]"  + "\n" +
               "[/tr]"  + "\n";

  });

  display += "[/table]";
  $("#output-teamspeak").val(display);
}
