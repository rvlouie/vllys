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

    , tempNode

    , controlsReady = false
    , controlsTO;

  
  currentSlideIndex = (function(){
    if (window.location.hash) {
      var matchedSlideIndex = _.indexOf(slides, window.location.hash.replace('#', ''));
      if (matchedSlideIndex != -1) return matchedSlideIndex;
    }
    return 0;
  }());


	slideLoop("slide-2");
	slideLoop("slide-9");


  // set up slides / backgrounds
  $('.slide').each(function(i) {
    var el = $(document.createElement('div'));
        el.attr('id', $(this).attr('id')+'-background');
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

  $slides.on('onwheel mousewheel onmousewheel DOMMouseScroll', onScroll);

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


  Mousetrap.bind('?', function(e) {
    if ($('.controls').is(':visible')) {
      hideControlsAndWait();
    } else {
      $('.controls').fadeIn(250);
    }
    return false;
  });

  $('.controls .close').click(function() { $('.controls').fadeToggle(100); });
  
  $('.controls').hide().delay(2000).fadeToggle(500, function(){
    controlsReady = true;
  });


  setSize();



  var $prevSlide
    , $currentSlide;


  function goToNextSlide() {
    scrollToSlide(currentSlideIndex + 1);
  }

  function goToPreviousSlide() {
    scrollToSlide(currentSlideIndex - 1);
  }

  function updateSlideIndicator() {
    $('.slide-indicator').finish();
    $('.slide-indicator').text( (currentSlideIndex + 1) + " / " + slides.length );
    $('.slide-indicator').delay(500).fadeIn().delay(3000).fadeOut();
  }

  var updateSlideIndicatorDebounced = _.debounce(updateSlideIndicator, 300, true);

  function hideControlsAndWait() {
    if (!controlsReady) return;
    $('.controls').fadeOut(250);
    if (controlsTO) clearTimeout(controlsTO);
    controlsTO = setTimeout(function() {
      $('.controls').fadeIn(500);
    }, 10 * 1000);
  }

  function scrollToSlide(index, speed) {
    var slide = slides[index];
    if (slide) {
      hideControlsAndWait();

      if (currentSlideIndex && currentSlideIndex !== index) $prevSlide = $('#'+slides[currentSlideIndex]);

      currentSlideIndex = index;

      $currentSlide = $('#'+slides[currentSlideIndex]);

      updateHash(slide);

      $backgrounds.stop();
      $('body').stop();

      if (animatingTO) clearTimeout(animatingTO);
      isAnimating = true;

      $('.slide-indicator').finish();

      $('body').animate({
        scrollTop: slidePositions[_.indexOf(slides, slide)]
      }, {
        duration: typeof(speed) != 'undefined' ? speed : transitionFactor * 1400,
        easing: 'easeOutCubic',
        complete: function() {
          if ($prevSlide) $prevSlide.trigger('leave');
          $currentSlide.trigger('enter');
          updateSlideIndicatorDebounced();
          animatingTO = setTimeout(function() {
            isAnimating = false;
          }, 500);
        }
      });

      $backgrounds.animate({ nonExistentProperty: slidePositions[_.indexOf(slides, slide)] }, {
        duration: typeof(speed) != 'undefined' ? speed : transitionFactor * 1700,
        easing: 'easeOutCubic',        
        step: function(now, fx) {
          $(this).css({
            '-webkit-transform': 'translate3d(0px, '+(-1 * now)+'px, 0px)',
                '-ms-transform': 'translate3d(0px, '+(-1 * now)+'px, 0px)',
                    'transform': 'translate3d(0px, '+(-1 * now)+'px, 0px)'
          });
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
    if (isAnimating) return;

    var moveX,
        moveY;
    
    if (e.type == 'mousewheel') {
      moveY = (e.originalEvent.wheelDelta * -1);
    }
    else if (e.type == 'onmousewheel') {
      moveY = (e.originalEvent.wheelDelta * -1);
    }
    else if (e.type == 'DOMMouseScroll') {
      moveX = 0;
      moveY = e.originalEvent.detail * 40;
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
      $('body').css('overflow', 'hidden');
      $('.controls').css('left', 'initial');
      setTimeout(function() {
        $('.slide > .container').each(function(){
          $(this).css({
            marginTop: parallax ? (windowHeight / 2 - $(this).outerHeight() / 2) : (windowHeight * 0.2)
          });
        });
      }, 100);
    } else {
      $('body').css('overflow', 'initial');
      $('.controls').css('left', '-1000px');
    }

    slidePositions = getSlidePositions(slides);
    scrollToSlide(currentSlideIndex);
  }

});
