$(document).ready(()=>{
  $("#content-setup, #content-settings").toggle(false);

  $("#link-home").click(()=>{
    $("#content-setup, #content-settings, #content-home").toggle(false);
    $("#content-home").toggle();
    $(".navbar-collapse").collapse("hide");
  });

  $("#link-setup").click(()=>{
    $("#content-setup, #content-settings, #content-home").toggle(false);
    $("#content-setup").toggle();
    $(".navbar-collapse").collapse("hide");
  });

  $("#link-settings").click(()=>{
    $("#content-setup, #content-settings, #content-home").toggle(false);
    $("#content-settings").toggle();
    $(".navbar-collapse").collapse("hide");
  });
});
