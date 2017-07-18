function UpdateVideoDisplay()
{

  var roles = $.map($("#content-home .card:eq(0) .card-block .btn"), (role)=>{
    return $(role).text();
  });

  var divide_index = $("#content-home .card:eq(0) .card-block>:eq(2) > .btn").length;

  var data = $.map($("#content-home .card:eq(0) .card-block .btn"),(index)=>{return "";});
  data.push("");
  data.push("");

  $.each($("#content-home .card"),(index,value)=>{
    var $card = $(value);
    var name = $card.find(".text").text();

    //Get players roles
    var card_roles = $.map($card.find(".list >"),(child)=>{ return parseInt(child.classList[3]);});

    var bm_role = $.map(card_roles,(filter)=>{if(filter < divide_index){return filter;}});

    $.map(bm_role,(role)=>{data.splice(role, 1, roles[role] + ": " + name);});

    if(bm_role.length <= 0)
    {
      if(data[18]==="")
      {
        data[18] = "DPS: " + name;
      }
      else {
        data[18] += ", " + name;
      }
    }

    var yaka_role = $.map(card_roles,(filter)=>{if(filter >= divide_index){return filter;}});

    $.map(yaka_role,(role)=>{data.splice(role, 1, roles[role] + ": " + name);});

    if(yaka_role.length <= 0)
    {
      if(data[19]==="")
      {
        data[19] = "DPS: " + name;
      }
      else {
        data[19] += ", " + name;
      }
    }

  });
  console.log(data)
}
