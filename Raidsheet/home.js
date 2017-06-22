$(document).ready(()=>{

  var YAKAMARU_DPS = 20;
  var BEASTMASTER_DPS = 7;

  $("#content-home .btn").click(function(){

    var $roles = $($($(this).parents()[3]).find(".list"));
    var roles = $.map($roles.children(),(v)=>{
      return $(v).attr("class").split(' ')[3];
    });

    //if this hasn't been added already add to the banner
    if(roles.indexOf($(this).attr("class").split(' ')[3]) > -1){
      //Remove from banner
      $($roles.children()[roles.indexOf($(this).attr("class").split(' ')[3])]).remove();

      //re-enable all other instances of this button
      var $others = $("#content-home ." + $(this).attr("class").split(' ')[3]).not($(this));
      $others.prop("disabled",false);

      var bmCount = 0;
      var yakaCount = 0;

      //if there are zero roles, add DPS
      $.each($roles.children(),function(index,value){
        var role_id = $(value).attr("class").split(' ')[3].match(/\d+/g)[0];
        if(role_id <= BEASTMASTER_DPS)
        {
          bmCount++;
        }
        else if(role_id > BEASTMASTER_DPS && role_id <= YAKAMARU_DPS)
        {
          yakaCount++;
        }
      });

      if(bmCount <= 0){
        $roles.append("<button type=\"button\" class=\"btn btn-primary btn-space role-7\">BM DPS</button>");
      }
      if(yakaCount <= 0)
      {
        $roles.append("<button type=\"button\" class=\"btn btn-success btn-space role-20\">Yaka DPS</button>");
      }

    }
    else {
      //Remove DPS label if exists for respective section
      var role_id = $(this).attr("class").split(' ')[3].match(/\d+/g)[0];
      if(role_id <= BEASTMASTER_DPS)
      {
        $roles.find(".role-7").remove();
      }
      else{
        $roles.find(".role-20").remove();
      }

      //Add to banner
      var $target = $(this).clone();
      $target.appendTo($roles);

      //disable other instances of this button (do not disable the button on the player or the source)
      var $others = $("#content-home ." + $(this).attr("class").split(' ')[3]).not($(this)).not($target);
      $others.prop("disabled", true);
    }

    var $reference = $roles.children();

    $reference.detach().sort(function(a,b){
      var pointA = $(a).attr("class").split(' ')[3].match(/\d+/g)[0];
      var pointB = $(b).attr("class").split(' ')[3].match(/\d+/g)[0];
      return pointA - pointB;
    });

    $roles.append($reference);

  });

  $.each($("#content-home .list"),function(index,value){
    $(value).append("<button type=\"button\" class=\"btn btn-primary btn-space role-7\">BM DPS</button>");
    $(value).append("<button type=\"button\" class=\"btn btn-success btn-space role-20\">Yaka DPS</button>");
  });

  $("#content-home .form-control").change(function(){
    var text = $(this).val();
    var $textbox = $($($(this).parents()[3]).find(".text"));
    $textbox.text(text);
  });

});
