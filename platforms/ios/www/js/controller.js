window.i18n = {
    'About GoHere': 'A propos de GoHere',
    'Find Washroom': 'Trouver salle d\'eau'
};

var sampleApp = angular.module('mainApp', [
  'ngRoute',
  'ngAnimate'
]);
  
sampleApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'main.html',
      }).
	  when('/selection', {
		templateUrl: 'selection.html',
      }).
	  when('/about', {
			controller:  'aboutController',   
        templateUrl: 'about.html',
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
  
  sampleApp.directive('menu', function () {
    return {
        restrict: 'A', //This menas that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
        replace: true,
        templateUrl: "menu.html",
        controller: ['$scope', '$filter', function ($scope, $filter) {
            // Your behaviour goes here :)
        }]
    }
  });
  sampleApp.directive('header', function () {
    return {
        restrict: 'A', //This menas that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
        replace: true,
        templateUrl: "header.html",
        controller: ['$scope', '$filter', function ($scope, $filter) {
            $scope.pageClass = 'page-code';

			$scope.backToPages = function(event) {
				event.preventDefault();
				window.history.back();
			};
        }]
    }
  });
  
  