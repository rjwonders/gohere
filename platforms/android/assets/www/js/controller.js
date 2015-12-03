
var sampleApp = angular.module('mainApp', []);
  
sampleApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'login.html',
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
  