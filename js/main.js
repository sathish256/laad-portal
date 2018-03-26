!function(a){var b=!1;a(function(){

  a(".menu-trigger").click(function(){b===!1?(jQuery(".full").finish(),
    a(".full").animate({right:"0px"},900),a(".toggle a").animate({left:"-100px"},900),b=!0):b===!0&&(jQuery(".full").finish(),
    a(".full").animate({right:"-300px"},700),a(".toggle a").animate({right:"0px"},700),b=!1)})})}(jQuery);





!function(a){var b=!1;a(function(){

  a(".butn").click(function(){b===!1?(jQuery(".side-nav").finish(),

    a(".side-nav").animate({left:"10px"},900),a(".butn").animate({right:"-20px"},900),$( ".butn" ).addClass("butn-close"),b=!0):b===!0&&(jQuery(".side-nav").finish(),

    a(".side-nav").animate({left:"-250px"},700),a(".butn").animate({right:"-64px"},700),$( ".butn" ).removeClass("butn-close"),b=!1)
  })
})
}(jQuery);


$(document).ready(function(){
$( ".butn").mouseover(function() {
  $( ".nav-title").fadeIn();
});
$( ".butn").mouseout(function() {
  $( ".nav-title").fadeOut();
});

});