$(document).ready(function(){

  var $slides = $('.slides')
  
    , animatingTO
    , isAnimating = false
    , scrollSpeed
    , parallax

    , slides = _.collect($('.slide'), function(el){ return el.getAttribute('id'); })
    , slidePositions

    , currentSlide
    , nextSlide
    , previousSlide

    , $currentSlide
    , $nextSlide
    , $previousSlide

    , currentOffset = 0
    , nextOffset = 0
    , previousOffset = 0

    , pos = $(window).scrollTop()
    , windowWidth = $(window).width()
    , windowHeight = $(window).height()

    , tempNode;

  
  currentSlide = (function(){
    if (window.location.hash) {
      var matchedSlideIndex = _.indexOf(slides, window.location.hash.replace('#', ''));
      if (matchedSlideIndex != -1) return slides[matchedSlideIndex];
    }
    return slides[0];
  }());

  $currentSlide = $('#'+currentSlide);


  $(window).resize(setSize);

  $slides.on('onwheel mousewheel DOMMouseScroll', onScroll);

  Mousetrap.bind(['home'], function(e) {
    scrollToSlide(0);
    return false;
  });

  Mousetrap.bind(['end'], function(e) {
    scrollToSlide(slides.length - 1);
    return false;
  });  

  Mousetrap.bind(['up', 'left', 'pageup', 'shift+space'], function(e) {
    goToPreviousSlide();
    return false;
  });
  
  Mousetrap.bind(['down', 'right', 'pagedown', 'space'], function(e) {
    goToNextSlide();
    return false;
  });


  setSize();



  function goToNextSlide() {
    var curIndex = _.indexOf(slides, currentSlide);
    if (curIndex != -1) scrollToSlide(curIndex + 1);
  }

  function goToPreviousSlide() {
    var curIndex = _.indexOf(slides, currentSlide);
    if (curIndex != -1) scrollToSlide(curIndex - 1);
  }

  function scrollToSlide(index) {
    var slide = slides[index];
    if (slide) {
      currentSlide  = slide;
      nextSlide     = slides[index + 1];
      previousSlide = slides[index - 1];

      $currentSlide   = $('#'+currentSlide);
      $nextSlide      = $('#'+nextSlide);
      $previousSlide  = $('#'+previousSlide);

      updateHash(slide);

      var $slide = slide;
      $('body, html').stop();
      if (animatingTO) clearTimeout(animatingTO);
      isAnimating = true;

      var options = {
        duration: 400,
        complete: function() {
          animatingTO = setTimeout(function() {
            isAnimating = false;
          }, 500);
        }
      };

      if (parallax) options.progress = updateParallax

      $('body, html').animate({
        scrollTop: slidePositions[_.indexOf(slides, slide)]
      }, options);
    }
  }

  function updateHash(hash) {
    tempNode = $('#'+hash);
    if (tempNode) tempNode.attr('id', '');
    window.location.hash = hash;
    if (tempNode) tempNode.attr('id', hash);
    tempNode = undefined;
  }

  var stopScroll,
      onScrollTO;

  function onScroll(e) {
    if (e) e.preventDefault();
    if (stopScroll) return;

    var moveX,
        moveY;
    
    if (e.type == 'mousewheel') {
      moveX = (e.originalEvent.wheelDeltaX * -1);
      moveY = (e.originalEvent.wheelDeltaY * -1);
    }
    else if (e.type == 'DOMMouseScroll') {
      moveX = 0;
      moveY = e.originalEvent.detail;
    }
    else if (e.type == 'onwheel') {
      moveX = e.originalEvent.deltaX;
      moveY = e.originalEvent.deltaY;
    }

    if (moveY > 40) {
      goToNextSlide();
    } else if (moveY < -40) {
      goToPreviousSlide();
    } else if (moveX > 40) {
      goToNextSlide();
    } else if (moveX < -40) {
      goToPreviousSlide();
    } else {
      moveX = false;
      moveY = false;
    }

    if (moveX || moveY) {
      if (onScrollTO) clearTimeout(onScrollTO);
      stopScroll = true;
      onScrollTO = setTimeout(function(){
        stopScroll = false;
      }, 1000);
    }
  }

  function updateParallax() {

    pos = $(window).scrollTop();

    if (parallax) {

      if ($currentSlide && $currentSlide.length) {
        currentOffset = ( windowHeight / 2 - ( $currentSlide.offset().top - pos ) ) / windowHeight - 0.5;
        if (currentOffset >= -1 && currentOffset <= 1) {
          $currentSlide.find('.container').css({ marginTop: scrollSpeed * currentOffset });
        }
      }
      
      if ($nextSlide && $nextSlide.length) {
        nextOffset = ( windowHeight / 2 - ( $nextSlide.offset().top - pos ) ) / windowHeight - 0.5;
        if (nextOffset >= -1 && nextOffset <= 1) {
          $nextSlide.find('.container').css({ marginTop: scrollSpeed * nextOffset });
        }
      }

      if ($previousSlide && $previousSlide.length) {
        previousOffset = ( windowHeight / 2 - ( $previousSlide.offset().top - pos ) ) / windowHeight - 0.5;
        if (previousOffset >= -1 && previousOffset <= 1) {
          $previousSlide.find('.container').css({ marginTop: scrollSpeed * previousOffset });
        }
      }

    }
  }
  
  function getSlidePositions(as) {
    return _.unique(_.collect(as, function(slide) {
      if (slide) {
        return $('#'+slide).offset().top;
      } else {
        return 0;
      }
    }));
  }

  function setSize() {
    windowWidth = $(window).width();
    windowHeight = $(window).height();

    $('.slide').css({
      width: windowWidth,
      height: windowHeight
    });
    $('.slide > .container').each(function(){
      $(this).css({
        position: 'absolute',
        top: windowHeight / 2 - $(this).height() / 2
      });
    });

    scrollSpeed = windowHeight < 800 ? 120 : 240;
    parallax = windowWidth > 800;

    slidePositions = getSlidePositions(slides);

    scrollToSlide(_.indexOf(slides, currentSlide));
  }


});
