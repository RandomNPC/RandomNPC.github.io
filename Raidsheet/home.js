var YAKAMARU_DPS = 20;
var BEASTMASTER_DPS = 7;

$(document).ready(()=>{

  $("#content-home .btn").click(function(){

    //Reference to the button clicked
    var $target_button = $(this);

    //List of roles
    var $roles_list = $($target_button.parents()[1]).find(".btn");

    //Which role has been selected
    var role_index = parseInt($target_button[0].classList[3]);

    //Reference to the card
    var $target_card = $target_button.parents()[3];

    //Card Index
    var target_index = $.inArray($target_card,$("#content-home .card"));

    //list reference
    var $list = $($($target_card).find(".list")[0]);

    var list_indices = $.map($list.children(),(v)=>{
                          var value = parseInt(v.classList[3]);
                          if($.isNumeric(value))
                          {
                            return value;
                          }
                       });
    var index = list_indices.indexOf(role_index);

    if(index < 0)
    {
      list_indices.push(role_index);
    }
    else {
      list_indices.splice(index,1);
    }

    if(list_indices.length <= 0)
    {
      list_indices.push(-1);
    }

    var format = "";
    $.each(list_indices,(k,v)=>{
      if(k > 0)
      {
        format += ","+v;
      }
      else {
        format = v;
      }
    });

    var db = firebase.database().ref(DATABASE+"/"+target_index);
    db.update({
      "roles": format
    });
  });

  $("#content-home .form-control").keydown(function(event){
      if(event.keyCode == 13) {
        event.preventDefault();
        return false;
      }
    });

  $("#content-home .form-control").change(function(){
    var $target_box = $(this);
    var $target_card = $target_box.parents()[3];

    //Card Index
    var target_index = $.inArray($target_card,$("#content-home .card"));

    var db = firebase.database().ref(DATABASE+"/"+target_index);

    db.update({
      "name": $target_box.val()
    });

  });

});
