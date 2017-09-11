$(document).ready(function(){

  var config = {
    apiKey: "AIzaSyB42PW3MwrtNhxuAVUgGYFdDfjiVCqNpJ0",
    authDomain: "penguin-confirm.firebaseapp.com",
    databaseURL: "https://penguin-confirm.firebaseio.com",
    projectId: "penguin-confirm",
    storageBucket: "penguin-confirm.appspot.com",
    messagingSenderId: "124831971002"
  };

  //Firebase stuff
  firebase.initializeApp(config);

  var ref = firebase.database().ref('penguins');

  ref.on('value',Update,(error)=>{});

  $("#post").click(function(){

    $.ajax({
     url: 'https://api.imgur.com/3/image',
     type: 'POST',
     headers: {
       Authorization: 'Client-ID ' + '2a084be43ea3a8b',
       Accept: 'application/json'
     },
     data: {
       image: localStorage.getItem("image"),
     },
     success: function(result) {
       $("#link-imgur").val("http://www.imgur.com/"+result.data.id);
       $("#link-rs").val("[imgur src="+result.data.id+".png]")
     }
    });

  });

  $("#container").on("change",".via",function(){
    UpdateRoute();
    UpdateLink();
  });

  $("#container ul").sortable({
    update: function(event, ui){
      UpdateRoute();
      UpdateLink();
    }
  });

  //Delegates
  $("#container").on("click",".split", function(){

    var key = $($(this).parents()[2]).find("p:first").text();

    var stops = [];

    $.each($("#container p:contains("+key+")"),(index,value)=>{
      var $ref = $(value).parents()[1];
      stops.push($($ref).find("p:not(:first)")[0].outerHTML);
      $($ref).remove();
    });

    var designation = key.match(/\d+/g)[0];

    var alt = '<li id="'+ (parseInt(designation)-1)+'">'+
    '						<div>'+
    '							<p>'+ designation +'</p>'+
    '						</div>'+
    '						<div>'+
    '							   '+ stops[0] +
    '							   '+ stops[1] +
    '						</div>'+
    '						<div>'+
    '							<input class="via"></input>' +
    '						</div>' +
    '						<div>'+
    '							<a href="#">'+
    '								<i class="fa fa-columns penguin" aria-hidden="true"></i>'+
    '							</a>'+
    '						</div>'+
    '					</li>';

    $("#container div ul").append(alt);

  });

  $("#container").on("click",".penguin",function(){

    var $target = $($(this).parents()[2]).find("p:not(:first)");
    var parent_index = parseInt($($(this).parents()[2]).find("p:first").text())-1;

    $.each($target,(index,value)=>{

      var alt = '<li id="'+parent_index+"-"+index+'">'+
      '						<div>'+
      '							<p><'+ (parent_index+1)+'></p>'+
      '						</div>'+
      '						<div>'+
      '							   ' + $(value)[0].outerHTML +
      '						</div>'+
      '						<div>'+
      '							<input class="via"></input>' +
      '						</div>' +
      '						<div>'+
      '							<a href="#">'+
      '								<i class="fa fa-window-close split" aria-hidden="true"></i>'+
      '							</a>'+
      '						</div>'+
      '					</li>';

      $("#container div ul").append(alt);
    });

    $($(this).parents()[2]).remove();
  });

  $(".polar").click(function(){
    $("#11 p:last").toggleClass("call-at");
    $(this).toggleClass("fa-times");
    $(this).toggleClass("fa-check");
    UpdateRoute();
    UpdateLink();
  });

  function Update(data)
  {
    var list = [];

    var polar_locations = [
      "Varrock Well",
      "Falador Well",
      "Rimmington Well",
      "Musa Point Well",
      "Ardougne Well",
      "Rellekka Well"
    ];

    $("#11 p:last").text(polar_locations[data.val()[data.val().length-1].index]);
    $("#11 p:last").toggleClass("confirm",data.val()[data.val().length-1].confirm);

    $.each(data.val(),function(index,value){

      if(index < (data.val().length-1))
      {
        $("#"+index+", #"+index+"-0").find("p:not(:first):nth-child(1)").text(value.main);
        $("#"+index+", #"+index+"-0").find("p:not(:first):nth-child(1)").toggleClass("confirm",(value.confirm && !value.flip));
        $("#"+index+", #"+index+"-0").find("p:not(:first):nth-child(1)").toggleClass("call-at",(value.confirm && !value.flip));

        $("#"+index+", #"+index+"-1").find("p:last").text(value.alt);
        $("#"+index+", #"+index+"-1").find("p:last").toggleClass("confirm",(value.confirm && value.flip));
        $("#"+index+", #"+index+"-1").find("p:last").toggleClass("call-at",(value.confirm && value.flip));
      }
    });
    UpdateRoute();
    UpdateLink();
  }

  function UpdateRoute()
  {
    var stop_limit = $(".confirm.call-at").length;
    $("#output tr td:nth-child(1)").hide();
    $("#output p").empty();

    $.each($(".confirm.call-at"),(index,value)=>{

      var index_id = parseInt($($(value).parents()[1]).attr("id"));
      var text = $(value).text();

      $("#output tr:even:eq("+index+") > td:nth-child(1)").show();

      $("#output tr:even:eq("+index+") > td:eq(1) p:eq(0)").text(text);

      var via_text = $($($(value).parents()[1]).find(".via")).val();

      $("#output tr:even:eq("+index+") > td:eq(1) p:eq(1)").text(
          (via_text!="") ? via_text : ""
      );

      if(index > 0)
      {
        $("#output tr:odd:eq("+(index-1)+") > td:nth-child(1)").show();
      }

    });

  }

  function UpdateLink()
  {
    html2canvas(document.getElementById("output"),{
      onrendered: function(canvas) {
        localStorage.setItem("image",canvas.toDataURL('image/jpeg', 0.9).split(',')[1]);
      },
      allowTaint:true,
      useCORS: true,
    });
  }

});
