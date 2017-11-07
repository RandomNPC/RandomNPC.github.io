$(document).ready(function(){
  $('.landing-page .navbar-nav>li>a').on('click', function(){
    $('.navbar-collapse').collapse('hide');
    //$(document).scrollTop( $($(this).attr("id")).offset().top );
  });
});
