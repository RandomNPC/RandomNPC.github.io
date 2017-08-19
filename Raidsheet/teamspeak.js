$(document).ready(function(){
  $("#content-teamspeak .form-control").change(function(){
    UpdateTeamspeakDisplay();
  });

});

function UpdateTeamspeakDisplay()
{
  var display = '[table]' +"\n"+
                '[tr]'+"\n"+
                '[th][center]'+ GetDate() +'[/center][/th]'+"\n"+
                '[td][center]Hosted by '+ $("#content-home .text:eq(0)").text() +'[/center][/td]'+"\n"+
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

  $.each($("#content-home .card"),(index, value)=>{
    var $card = $(value);
    var role_list = $card.find(".card-block .btn");

    //What index does Beastmaster roles stop?
    var divide_index = $($card.find(".card-block").children()[2]).children(".btn").length;

    //Get Roles
    var player_roles = $.map($card.find(".list").children(),(role)=>{return parseInt(role.classList[3]);});

    var yaka_role = "DPS";
    var bm_role = "DPS";

    //Append Roles
    $.map(player_roles,(v)=>{
      if(v >= 0)
      {
        var text = $(role_list[v]).text();
        if(v < divide_index)
        {
          if(bm_role === "DPS")
          {
            bm_role = text;
          }
          else {
            bm_role += " + " + text;
          }
        }
        else{
          if(yaka_role === "DPS")
          {
            yaka_role = text;
          }
          else {
            yaka_role += " + " + text;
          }
        }
      }
    })

    display += "[tr]"  + "\n" +
               "[td][center]" + $($card.find(".text")[0]).text() + "[/center][/td]"  + "\n" +
               "[td][center]"+ yaka_role +"[/center][/td]"  + "\n" +
               "[td][center]"+ bm_role +"[/center][/td]"  + "\n" +
               "[/tr]"  + "\n";
  });

  display += "[/table]";
  $("#output-teamspeak").val(display);
}

function GetDate()
{
  var day_of_week = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  var date = new Date();
  return day_of_week[date.getDay()] + ", " + months[date.getMonth()] + " " + date.getDate();

}
