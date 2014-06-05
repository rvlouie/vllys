function slideLoop(slideId, interval) {

  var $images = $("#" + slideId +" img.carousel-image");
  var currentIndex
  var slideInterval 

  $images.each(function(i, image) {
    var $image = $(image) 
    $image.addClass(i);
    if ($image.hasClass("top-carousel")) {
      currentIndex = i 
    }
  })

  function nextImage() {
    currentIndex += 1
    if (currentIndex >= $images.length) {
      currentIndex = 0 
    }
    $("#" + slideId + " .carousel-image.top-carousel").removeClass("top-carousel").addClass("bottom-carousel");
    $($images[currentIndex]).removeClass("bottom-carousel").addClass("top-carousel");
  }

  function startCarousel() {
    if (slideInterval) {
      clearInterval(slideInterval);
    };
    slideInterval = setInterval(nextImage, interval || 3000);
  }
  
  function stopCarousel() { 
    if (slideInterval) {
      clearInterval(slideInterval);
    };
  }

  $("#" + slideId + " .carousel-play").click(function(){
    $("#" + slideId + " .carousel-play").removeClass();
    startCarousel();
  })	

  $("#" + slideId).on("enter", startCarousel);

  $("#" + slideId).on("leave", stopCarousel); 

}
