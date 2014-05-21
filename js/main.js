$(document).ready(function(){

  var $slides = $('.slides')
  
    , animatingTO
    , isAnimating = false
    , scrollSpeed
    , parallax

    , anchors = _.collect($('.slide'), function(el){ return el.getAttribute('id'); })
    , anchorPositions
    , visibleAnchor
    , currentAnchor
    , nextAnchor
    , previousAnchor
    , currentOffset = 0
    , nextOffset = 0
    , previousOffset = 0

    , pos = $(window).scrollTop()
    , windowWidth = $(window).width()
    , windowHeight = $(window).height()

    , tempNode;


  currentAnchor = (function(){
    if (window.location.hash) {
      var matchedAnchorIndex = _.indexOf(anchors, window.location.hash.replace('#', ''));
      if (matchedAnchorIndex != -1) return anchors[matchedAnchorIndex];
    }
    return anchors[0];
  }());


  $slides.on('onwheel mousewheel DOMMouseScroll', onScroll);

  setSize()
  $(window).resize(setSize);


  Mousetrap.bind(['home'], function(e) {
    scrollToSlide(anchors[0], 1);
    return false;
  });

  Mousetrap.bind(['end'], function(e) {
    scrollToSlide(anchors[anchors.length - 1], 1);
    return false;
  });  

  Mousetrap.bind(['up', 'left', 'pageup', 'shift+space'], function(e) {
    var curIndex = _.indexOf(anchors, currentAnchor);
    if (curIndex != -1) scrollToSlide(anchors[curIndex - 1]);
    return false;
  });
  
  Mousetrap.bind(['down', 'right', 'pagedown', 'space'], function(e) {
    var curIndex = _.indexOf(anchors, currentAnchor);
    if (curIndex != -1) scrollToSlide(anchors[curIndex + 1]);
    return false;
  });


  function scrollToSlide(slide, speed) {
    if (slide) {
      $('body, html').stop();
      if (animatingTO) clearTimeout(animatingTO);
      isAnimating = true;
      $('body, html').animate({
        scrollTop: $('#'+slide).offset().top
      }, {
        duration: speed || 1000,
        complete: function() {
          animatingTO = setTimeout(function() {
            isAnimating = false;
          }, 500);
        },
        progress: function() {
          onScroll();
        }
      });
    }
  }

  function updateHash(hash) {
    tempNode = $('#'+hash);
    if (tempNode) tempNode.attr('id', '');
    window.location.hash = hash;
    if (tempNode) tempNode.attr('id', currentAnchor);
    tempNode = undefined;
  }

  function onScroll(e) {

    if (e && isAnimating) {
      e.preventDefault();
      return false;
    }

    pos = $(window).scrollTop();

    visibleAnchor = _.find(anchors, function(anchor, i){
      if ( anchor && (pos <= anchorPositions[i]) ) {
        previousAnchor = anchors[i - 1];
        nextAnchor = anchors[i + 1];
        return true;
      } else {
        return false;
      }
    });

    if (currentAnchor != visibleAnchor) {
      currentAnchor = visibleAnchor;
      updateHash(currentAnchor);
    }
    
    if ($(window).width() >= 800) {

      if ($('#'+currentAnchor).length) {
        currentOffset = ( windowHeight / 2 - ( $('#'+currentAnchor).offset().top - pos ) ) / windowHeight - 0.5;
        if (currentOffset >= -1 && currentOffset <= 1) {
          $('#'+currentAnchor+' .container').css({ marginTop: scrollSpeed * currentOffset });
        }
      }
      
      if ($('#'+nextAnchor).length) {
        nextOffset = ( windowHeight / 2 - ( $('#'+nextAnchor).offset().top - pos ) ) / windowHeight - 0.5;
        if (nextOffset >= -1 && nextOffset <= 1) {
          $('#'+nextAnchor+' .container').css({ marginTop: scrollSpeed * nextOffset });
        }
      }

      if ($('#'+previousAnchor).length) {
        previousOffset = ( windowHeight / 2 - ( $('#'+previousAnchor).offset().top - pos ) ) / windowHeight - 0.5;
        if (previousOffset >= -1 && previousOffset <= 1) {
          $('#'+previousAnchor+' .container').css({ marginTop: scrollSpeed * previousOffset });
        }
      }

    }
  }
  
  function getAnchorPositions(as) {
    return _.unique(_.collect(as, function(anchor) {
      if (anchor) {
        return $('#'+anchor).offset().top;
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

    scrollSpeed = windowHeight < 800 ? 100 : 200;
    parallax = windowWidth > 800;

    anchorPositions = getAnchorPositions(anchors);
    
    scrollToSlide(currentAnchor);
  }


});
