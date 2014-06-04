$(document).ready(function(){

	function slideLoop(slideId) {

		var $images = $("#" + slideId +" img.carousel-image");
		var currentIndex
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

		$("#" + slideId + ' .carousel').click(function(){
			$("#" + slideId + " .carousel-play").removeClass();
			setInterval(nextImage, 3000);
		})	

	}

	slideLoop("slide-2");
	slideLoop("slide-9");

})