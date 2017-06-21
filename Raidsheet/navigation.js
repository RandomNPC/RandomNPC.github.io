$(document).ready(()=>{
  $("#content-teamspeak, #content-video, #content-settings").toggle(false);


  $("#link-home").click(()=>{
    $("#content-home, #content-teamspeak, #content-video, #content-settings").toggle(false);
    $("#content-home").toggle();
    $(".navbar-collapse").collapse("hide");
  });

  $("#link-teamspeak").click(()=>{
    $("#content-home, #content-teamspeak, #content-video, #content-settings").toggle(false);
    $("#content-teamspeak").toggle();
    $(".navbar-collapse").collapse("hide");
  });

  $("#link-video").click(()=>{
    $("#content-home, #content-teamspeak, #content-video, #content-settings").toggle(false);
    $("#content-video").toggle();
    $(".navbar-collapse").collapse("hide");
  });

  $("#link-settings").click(()=>{
    $("#content-home, #content-teamspeak, #content-video, #content-settings").toggle(false);
    $("#content-settings").toggle();
    $(".navbar-collapse").collapse("hide");
  });
});
