$(document).ready(function(){

  var $slides = $('.slides')

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


  anchors.unshift('');
  currentAnchor = anchors[0];


  $slides.on('onwheel mousewheel DOMMouseScroll', onScroll);

  setSize()
  $(window).resize(setSize);
  


  function onScroll(e) {

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
      tempNode = $('#'+visibleAnchor);
      if (tempNode) tempNode.attr('id', '');
      window.location.hash = currentAnchor = visibleAnchor;
      if (tempNode) tempNode.attr('id', currentAnchor);
      tempNode = undefined;
    }
    
    if ($(window).width() >= 800) {

      if ($('#'+currentAnchor).length) {
        currentOffset = ( windowHeight / 2 - ( $('#'+currentAnchor).offset().top - pos ) ) / windowHeight - 0.5;
        if (currentOffset >= -1 && currentOffset <= 1) {
          $('#'+currentAnchor+' .container').css({ marginTop: 150 * currentOffset });
        }
      }
      
      if ($('#'+nextAnchor).length) {
        nextOffset = ( windowHeight / 2 - ( $('#'+nextAnchor).offset().top - pos ) ) / windowHeight - 0.5;
        if (nextOffset >= -1 && nextOffset <= 1) {
          $('#'+nextAnchor+' .container').css({ marginTop: 150 * nextOffset });
        }
      }

      if ($('#'+previousAnchor).length) {
        previousOffset = ( windowHeight / 2 - ( $('#'+previousAnchor).offset().top - pos ) ) / windowHeight - 0.5;
        if (previousOffset >= -1 && previousOffset <= 1) {
          $('#'+previousAnchor+' .container').css({ marginTop: 150 * previousOffset });
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

    anchorPositions = getAnchorPositions(anchors);
  }


});
