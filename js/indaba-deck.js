$(document).ready(function(){

  $(function() {
    $("a").click(function() {
       if(this.hash) {
        var hash = this.hash.substr(1);
        var jQuerytoElement = jQuery("div[id="+hash+"]");
        var toPosition = jQuerytoElement.position().top;
        jQuery("body,html").animate({
            scrollTop : toPosition
        }, 800);
        return false;            
       }
    });
    if(location.hash) {
        var hash = location.hash;
        window.scroll(0,0);
        jQuery("a[href="+hash+"]").click();
    }
  })

  $('.link-box').hover(
    function() {
      $(this).css("background-color" , "#186895")}, 
    function() {
      $(this).css("background-color", "#1d7db3")
    } );

})