$(document)
  .ready(function() {

    $('.masthead')
      .visibility({
        once: false,
        onBottomPassed: function() {
          $('.fixed.menu').transition('fade in');
        },
        onBottomPassedReverse: function() {
          $('.fixed.menu').transition('fade out');
        }
      })
    ;

    $('.ui.sidebar')
      .sidebar('attach events', '.toc.item')
    ;

    $('#showcases .image')
      .dimmer({
        on: 'hover'
      })
    ;

  })
;