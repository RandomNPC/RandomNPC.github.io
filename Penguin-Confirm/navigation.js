$(document).ready(()=>{
  $("#content-setup, #content-location").toggle(false);

  $("#link-home").click(()=>{
    $("#content-setup, #content-home, #content-location").toggle(false);
    $("#content-home").toggle();
    $(".navbar-collapse").collapse("hide");
  });

  $("#link-setup").click(()=>{
    $("#content-setup, #content-home, #content-location").toggle(false);
    $("#content-setup").toggle();
    $(".navbar-collapse").collapse("hide");
  });

  $("#link-locations").click(()=>{
    $("#content-setup, #content-home, #content-location").toggle(false);
    $("#content-location").toggle();
    $(".navbar-collapse").collapse("hide");
  });
});
