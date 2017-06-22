$(document).ready(()=>{

  var YAKAMARU_DPS = 20;
  var BEASTMASTER_DPS = 7;

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
    }
    else {
      AddRoleToPlayer(GetClassProperties($(this)),$($(this).parents()[3]));
    }

  });

  $("#content-home .form-control").change(function(){
    var text = $(this).val();
    var $textbox = $($($(this).parents()[3]).find(".text"));
    $textbox.text(text);
  });

});


function AddRoleToPlayer(className,$card)
{
  var $list = $card.find(".list");
  var $role = $card.find("."+className);

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
}

function GetClassProperties($ref)
{
  return $ref.attr("class").split(' ')[3];
}
