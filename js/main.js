$(document).ready(function(){

  var $slides = $('.slides')
    , $backgrounds = $('.backgrounds')
  
    , animatingTO
    , isAnimating = false
    , transitionFactor = 1
    , parallax

    , slides = _.collect($('.slide'), function(el){ return el.getAttribute('id'); })
    , slidePositions
    
    , currentSlideIndex

    , pos = $(window).scrollTop()
    , windowWidth = $(window).width()
    , windowHeight = $(window).height()

    , tempNode;

  
  currentSlideIndex = (function(){
    if (window.location.hash) {
      var matchedSlideIndex = _.indexOf(slides, window.location.hash.replace('#', ''));
      if (matchedSlideIndex != -1) return matchedSlideIndex;
    }
    return 0;
  }());


  // set up slides / backgrounds
  $('.slide').each(function(i) {
    var el = $(document.createElement('div'));
        el.attr('id', $(this).attr('id') + '-background');
        el.addClass('background');
        el.css({
          'backgroundImage': $(this).css('background-image'),
          'height': windowHeight,
          'width': windowWidth
        });
    $backgrounds.append(el);
    $(this).css("background", "none");
  });

  $(window).resize(setSize);

  $slides.on('onwheel mousewheel DOMMouseScroll', onScroll);

  Mousetrap.bind(['home'], function(e) {
    scrollToSlide(0, 0);
    return false;
  });

  Mousetrap.bind(['end'], function(e) {
    scrollToSlide(slides.length - 1, 0);
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



  var $prevSlide
    , $currentSlide
    , $nextSlide
    , $prevSlideBackground
    , $currentSlideBackground
    , $nextSlideBackground
    , prevSlideOffset
    , currentSlideOffset
    , nextSlideOffset;

  function goToNextSlide() {
    scrollToSlide(currentSlideIndex + 1);
  }

  function goToPreviousSlide() {
    scrollToSlide(currentSlideIndex - 1);
  }

  function updateSlides(index) {
  }

  function scrollToSlide(index, speed) {
    var slide = slides[index];
    if (slide) {
      currentSlideIndex = index;

      $prevSlide     = $('#slide-'+(currentSlideIndex)    );
      $currentSlide  = $('#slide-'+(currentSlideIndex + 1));
      $nextSlide     = $('#slide-'+(currentSlideIndex + 2));

      prevSlideOffset     = $prevSlide.length ? $prevSlide.offset().top : null;
      currentSlideOffset  = $currentSlide.length ? $currentSlide.offset().top : null;
      nextSlideOffset     = $nextSlide.length ? $nextSlide.offset().top : null;
      
      $prevSlideBackground     = $('#slide-'+(currentSlideIndex)    +'-background');
      $currentSlideBackground  = $('#slide-'+(currentSlideIndex + 1)+'-background');
      $nextSlideBackground     = $('#slide-'+(currentSlideIndex + 2)+'-background');

      updateHash(slide);

      $backgrounds.stop();
      $('body, html').stop();

      if (animatingTO) clearTimeout(animatingTO);
      isAnimating = true;

      $('body, html').animate({
        scrollTop: slidePositions[_.indexOf(slides, slide)]
      }, {
        duration: typeof(speed) != 'undefined' ? speed : transitionFactor * 1400,
        easing: 'easeOutCubic',
        complete: function() {
          animatingTO = setTimeout(function() {
            isAnimating = false;
          }, 500);
        }
      });

      $backgrounds.animate({ nonExistentProperty: slidePositions[_.indexOf(slides, slide)] }, {
        duration: typeof(speed) != 'undefined' ? speed : transitionFactor * 1700,
        easing: 'easeOutCubic',        
        step: function(now, fx) {
          $(this).css('-webkit-transform', 'translate3d(0px, '+(-1 * now)+'px, 0px)');
        }
      });
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
    if (!parallax) return;
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

    parallax = windowWidth > 800;
    transitionFactor = Math.max(1.5 - (windowHeight / 1024), 0.75);

    $('.slide').css({
      width: windowWidth,
      height: parallax ? windowHeight : 'auto'
    });

    $('.background').css({
      width: windowWidth,
      height: windowHeight
    });

    if (parallax) {
      setTimeout(function() {
        $('.slide > .container').each(function(){
          $(this).css({
            marginTop: parallax ? (windowHeight / 2 - $(this).outerHeight() / 2) : (windowHeight * 0.2)
          });
        });
      }, 100);
    }

    slidePositions = getSlidePositions(slides);
    scrollToSlide(currentSlideIndex);
  }

});
