var YAKAMARU_DPS = 20;
var BEASTMASTER_DPS = 7;

$(document).ready(()=>{

  $("#content-home .btn").click(function(){

    var $roles = $($($(this).parents()[3]).find(".list"));
    var roles = $.map($roles.children(),(v)=>{
      return GetClassProperties($(v));
    });

    //if this hasn't been added already add to the banner
    if(roles.indexOf(GetClassProperties($(this))) > -1){
      //Remove from banner
      $($roles.children()[roles.indexOf(GetClassProperties($(this)))]).remove();

      //re-enable all other instances of this button
      var $others = $("#content-home ." + GetClassProperties($(this))).not($(this));
      $others.prop("hidden",false);

      var $reference = $roles.children();

      $reference.detach().sort(function(a,b){
        var pointA = GetClassProperties($(a)).match(/\d+/g)[0];
        var pointB = GetClassProperties($(b)).match(/\d+/g)[0];
        return pointA - pointB;
      });

      $roles.append($reference);
      UpdateTeamspeakDisplay();
      UpdateVideoDisplay();
      UpdateDatabase($($($(this).parents()[3])));
    }
    else {
      AddRoleToPlayer(GetClassProperties($(this)),$($(this).parents()[3]),true);
    }

  });

  $("#content-home .form-control").keydown(function(event){
      if(event.keyCode == 13) {
        event.preventDefault();
        return false;
      }
    });

  $("#content-home .form-control").change(function(){
    var text = $(this).val();
    var $textbox = $($($(this).parents()[3]).find(".text"));
    $textbox.text(text);
    UpdateTeamspeakDisplay();
    UpdateVideoDisplay();
    UpdateDatabase($($($(this).parents()[3])));
  });

});


function AddRoleToPlayer(className,$card,update)
{
  var $list = $card.find(".list");
  var $role = $card.find("."+className);

  if($list.find("."+className).length > 0)
  {
    return;
  }

  var $target = $role.clone();

  $target.appendTo($list);

  var $others = $("#content-home ." + className).not($role).not($target);
  $others.prop("hidden", true);

  var $reference = $list.children();

  $reference.detach().sort(function(a,b){
    var pointA = GetClassProperties($(a)).match(/\d+/g)[0];
    var pointB = GetClassProperties($(b)).match(/\d+/g)[0];
    return pointA - pointB;
  });

  $list.append($reference);
  UpdateTeamspeakDisplay();
  UpdateVideoDisplay();
  if(update)
  {
    UpdateDatabase($card);
  }
}

function GetClassProperties($ref)
{
  return $ref.attr("class").split(' ')[3];
}
