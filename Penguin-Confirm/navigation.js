$(document).ready(()=>{
  $("#content-setup").toggle(false);

  $("#link-home").click(()=>{
    $("#content-setup, #content-home").toggle(false);
    $("#content-home").toggle();
    $(".navbar-collapse").collapse("hide");
  });

  $("#link-setup").click(()=>{
    $("#content-setup, #content-home").toggle(false);
    $("#content-setup").toggle();
    $(".navbar-collapse").collapse("hide");
  });
});
