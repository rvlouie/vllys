$(document).ready(function(){

	function slideLoop(slideId) {

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

		$("#" + slideId + " .carousel-play").click(function(){
			$("#" + slideId + " .carousel-play").removeClass();
			if (slideInterval) {
				clearInterval(slideInterval);
			};
			slideInterval = setInterval(nextImage, 3000);
		})	

		$("#" + slideId).on("enter", function() {
			$("#" + slideId + " .carousel-play").trigger("click");	
		})


		$("#" + slideId).on("leave", function() { 
			if (slideInterval) {
				clearInterval(slideInterval);
			};
		})

	}

	slideLoop("slide-2");
	slideLoop("slide-9");

})