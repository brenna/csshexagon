var hexagonApp = angular.module('hexagonApp', ['ngSanitize']);
 
hexagonApp.controller('HexGenCtrl', ['$scope', function ($scope) {

  // tan(30deg) is magic scale factor for smushing
  // a square into a rhombus that fits the top of 
  // a hexagon
  $scope.scaleFactor = Math.tan(30 * Math.PI/180);
  
  //default values
  $scope.borderWidth = 0;
  $scope.userBorderWidth = 5;
  // $scope.height = $scope.size/Math.sqrt(3);
  // $scope.capWidth = $scope.size/Math.sqrt(3);

  $scope.initBorder = function(){
    if ($scope.hasBorder) {
      $scope.borderWidth = $scope.userBorderWidth;
    } else {
      $scope.userBorderWidth = $scope.borderWidth;
      $scope.borderWidth = 0;
    }
  }
  
  $scope.generateMarkup = function() {
      if ($scope.fillType == 'image') {
        return '<div class="hexagon">\n  <div class="hexTop"></div>\n  <div class="hexBottom"></div>\n</div>'
      } else if($scope.hasShadow) {
        return '<div class="hexagon"><span></span></div>';
      } else {
        return '<div class="hexagon"></div>';
      }
  }

  $scope.getHeight = function(width){
    return width/Math.sqrt(3);
  }

  $scope.getOffset = function(width){
    return width/Math.sqrt(2)/2;
  }

  $scope.getCapWidth = function(width){
    return width/Math.sqrt(2);
  }

  $scope.getBorderOffset = function(borderWidth){
    return borderWidth/Math.sqrt(3);
  }

  $scope.hexToRgb = function(hex){
    //strip off hash character
    hex = hex.substring(1);
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return r + "," + g + "," + b;
  }

  $scope.shadowRule = function(){
    if ($scope.hasShadow){
      var shadowRule = '\n  box-shadow: 0 0 ' 
        + $scope.shadowBlur + "px " 
        + 'rgba(' 
        + $scope.hexToRgb($scope.shadowColor) 
        + ',' + $scope.shadowAlpha + ');';
      return shadowRule;
    } else {
      return;
    }
  }

  $scope.borderRule = function(){
    if ($scope.hasBorder){
      var borderRule = '\n  border-left: solid ' 
        + $scope.borderWidth + "px " 
        + $scope.borderColor + ";\n  "
        + 'border-right: solid '
        + $scope.borderWidth + "px " 
        + $scope.borderColor + ";";
      return borderRule;
    } else {
      return;
    }
  }

  $scope.borderRuleTop = function(){
    if ($scope.hasBorder){
      var borderRule = '\n  border-top: solid ' 
        + ($scope.borderWidth * Math.sqrt(2)).toFixed(4) + "px " 
        + $scope.borderColor + ";\n  "
        + 'border-right: solid '
        + ($scope.borderWidth * Math.sqrt(2)).toFixed(4) + "px " 
        + $scope.borderColor + ";";
      return borderRule;
    } else {
      return;
    }
  }

  $scope.borderRuleBottom = function(){
    if ($scope.hasBorder){
      var borderRule = '\n  border-bottom: solid ' 
        + ($scope.borderWidth * Math.sqrt(2)).toFixed(4) + "px " 
        + $scope.borderColor + ";\n  "
        + 'border-left: solid '
        + ($scope.borderWidth * Math.sqrt(2)).toFixed(4) + "px " 
        + $scope.borderColor + ";";
      return borderRule;
    } else {
      return;
    }
  }

  $scope.coverRule = function(){

    if ($scope.hasShadow){
      var coverRule = '/*cover up extra shadows*/'
      + '\n.hexagon span {'
      + '\n  display: block;'
      + '\n  position: absolute;'
      + '\n  top:' +  ($scope.borderWidth * $scope.scaleFactor) + 'px;'
      + '\n  left: 0;'
      + '\n  width:' + ($scope.size - ($scope.borderWidth * 2)) + 'px;'
      + '\n  height:' + ($scope.getHeight($scope.size) - ($scope.borderWidth * $scope.scaleFactor * 2)).toFixed(4) + 'px;'
      + '\n  z-index: 2;'
      + '\n  background: inherit;'
      + '\n}'
      return coverRule;
    } else {
      return;
    }
  }

  $scope.makeBorder = function(){
    $scope.borderRules = 'border-left: solid'
    + $scope.borderWidth;
    $scope.borderRulesTop = '';
    $scope.borderRulesBottom = ''; 
    $scope.border = 'solid ' + $scope.borderWidth + 'px ' + $scope.borderColor;
  }

  $scope.makeCapBorder = function(){
    $scope.capBorder = 'solid ' + $scope.borderWidth * Math.sqrt(2) + 'px ' + $scope.borderColor;
  }

  $scope.chooseTemplate = function(){
    if ($scope.hasImage) {
      return 'css-image.html'
    } else {
      return 'css-shadow.html'
    }
  }

  $scope.HEXCODE_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

  //Modernizr type test for input type=color support

  $scope.inputColorSupport = function(){
      var inputElem = document.createElement('input'), bool, docElement = document.documentElement, smile = ':)';

      inputElem.setAttribute('type', 'color');
      bool = inputElem.type !== 'text';

      // We first check to see if the type we give it sticks..
      // If the type does, we feed it a textual value, which shouldn't be valid.
      // If the value doesn't stick, we know there's input sanitization which infers a custom UI
      if (bool) {

          inputElem.value         = smile;
          inputElem.style.cssText = 'position:absolute;visibility:hidden;';

          // chuck into DOM and force reflow for Opera bug in 11.00
          // github.com/Modernizr/Modernizr/issues#issue/159
          docElement.appendChild(inputElem);
          docElement.offsetWidth;
          bool = inputElem.value != smile;
          docElement.removeChild(inputElem);
      }

      return bool;
  }

}]);

hexagonApp.directive('myCss', function(){
  return {
    templateUrl: function chooseTpl(tElement, tAttr){
      return tAttr.template;
    }
  }
});

/* custom checkbox and radio buttons:
   https://gist.github.com/myguidingstar/5469101 */

hexagonApp.directive('checkbox', function(){
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: function (tElement, tAttrs) {
      var custom_true  = tAttrs.true  ? ' ng-true-value="'  + tAttrs.true  + '"' : '';
      var custom_false = tAttrs.false ? ' ng-false-value="' + tAttrs.false + '"' : '';
      var more_class = tAttrs.class ? ' '+tAttrs.class : '';
      return '<label ng-transclude><input type="checkbox" ng-model="' + tAttrs.model + '"'+ custom_true + custom_false
            + '><div class="custom-checkbox'+ more_class +'"></div>'
      }
    }
  });

hexagonApp.directive('radio', function(){
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: function (tElement, tAttrs) {
      var more_class = tAttrs.class ? ' '+tAttrs.class : '';
      return '<label ng-transclude><input type="radio" ng-model="' + tAttrs.model
            + '" value="' + tAttrs.value + '"><div class="custom-radio'+ more_class +'"></div>'
      }
    }
  });