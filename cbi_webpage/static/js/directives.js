(function()
{
  var app = angular.module("test.Directives", []);
  app.directive('animateTab', function()
  {
    var linker = function(scope, element, attrs)
    {
      var timelineLite = new TimelineLite();
      timelineLite.add(TweenLite.to(element.find('.normalMenuButton'), 0.4,
      {
        scaleX: 0.5,
        scaleY: 0.5,
        ease: Power2.easeOut
      }));
      timelineLite.stop();
    }
  });
  /*/ the custom directive for the first depth /*/
})();