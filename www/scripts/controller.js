var globalUrl = 'http://52.3.29.145/gohere/rest';
var imgurl = "http://52.3.29.145/gohere/admin/uploads/setting";

$(window).load(function() { 
	$("#status").fadeOut(); // will first fade out the loading animation
	$("#preloader").delay(100).fadeOut("slow"); // will fade out the white DIV that covers the website.
});

var GoHereApp = angular.module('mainApp', [
  'ngRoute',
  'ngAnimate',
  'pascalprecht.translate',
  'ngSanitize'
]);

GoHereApp.value('snapper');

GoHereApp.config(function ($translateProvider) {
  $translateProvider.translations('en', {
    ABOUT_BUTTON	: 'About GoHere',
	FIND_BUTTON		: 'Find Washroom',
	ENG_BUTTON		: 'English',
	FR_BUTTON		: 'French',
	CURRENT_LOCATION: 'My Current Location',
	MAP				: 'Map',
	ADD_LOCATION	: 'Add a Location',
	ACCESS_CARD		: 'Washroom Access Card',
	FAVOURITE		: 'My Favourites',
  });
  $translateProvider.translations('fr', {
    ABOUT_BUTTON	: 'A propos de GoHere',
	FIND_BUTTON		: 'Trouver salle d\'eau',
	ENG_BUTTON		: 'English',
	FR_BUTTON		: 'French',
	CURRENT_LOCATION: 'Ma position actuelle',
	MAP				: 'Carte',
	ADD_LOCATION	: 'Ajouter un lieu',
	ACCESS_CARD		: 'Buanderie Access Card',
	FAVOURITE		: 'Mes préférés',
  });
  if(localStorage.SelectedLanguage!==undefined){
  	$translateProvider.preferredLanguage(localStorage.SelectedLanguage);
  } else {
	  $translateProvider.preferredLanguage('en');
  }
});
  
GoHereApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
		controller:  'LanguageController',   
        templateUrl: 'main.html',
      }).
	  when('/selection', {
		controller:  'SelectController',   
		templateUrl: 'selection.html',
      }).
	  when('/about', {
		controller:  'aboutController',   
        templateUrl: 'about.html',
      }).
	  when('/find', {
		controller:  'mapController',   
        templateUrl: 'map.html',
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
  GoHereApp.controller('LanguageController', ['$scope','$location', '$translate', function($scope,$location,$translate) {
	//localStorage.removeItem('SelectedLanguage');
	$(".custom-header").css("display","none");
	GoHereApp.snapper.disable();
	if(localStorage.SelectedLanguage!==undefined){
		$location.path("/selection");
	} else {
		$scope.selectLanguage = function($Selection) {
			$translate.use($Selection);
			localStorage.SelectedLanguage = $Selection;
			$location.path("/selection");
		};
	}
  }]);
  GoHereApp.controller('SelectController', ['$scope', function($scope) {
	$(".custom-header").css("display","none");
	GoHereApp.snapper.disable();
  }]);
  
  GoHereApp.controller('aboutController', ['$scope', '$rootScope', '$http', '$sce', function($scope,$rootScope, $http,$sce) {
	$(".custom-header").css("display","block");  
	$http.get(globalUrl+"/pages/view/2.json").then(function(response) {
		$rootScope.PageName = response.data.response.page.name;
		$scope.PageContent = $sce.trustAsHtml(response.data.response.page.description);
	});
  	
  }]);
  
  GoHereApp.directive('menu', function () {
    return {
        restrict: 'A', //This menas that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
        replace: true,
        templateUrl: "menu.html",
        controller: ['$scope', '$filter', function ($scope, $filter) {
        	GoHereApp.snapper = new Snap({
				element: document.getElementById('content'),
				elementMirror: document.getElementById('header-fixed'),
				elementMirror2: document.getElementById('footer-fixed'),
				disable: 'right',
				tapToClose: true,
				touchToDrag: true,
				maxPosition: 266,
				minPosition: -266
			});  
			$(document).on("click",'.close-sidebar', function() {GoHereApp.snapper.close();});
			$(document).on("click",'.open-left-sidebar', function() {
				//$(this).toggleClass('remove-sidebar');
				if( GoHereApp.snapper.state().state=="left" ){
					GoHereApp.snapper.close();
				} else {
					GoHereApp.snapper.open('left');
				}
				return false;
			});	
        	//snapper.on('open', function(){$('.back-to-top-badge').removeClass('back-to-top-badge-visible');});
        }]
    }
  });
  GoHereApp.directive('header', function () {
    return {
        restrict: 'A', //This menas that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
        replace: true,
        templateUrl: "header.html",
        controller: ['$scope', '$filter', '$location', function ($scope, $filter,$location) {
			var hash = $location.hash();
			$scope.pageClass = 'page-code';
			$scope.backToPages = function(event) {
				event.preventDefault();
				window.history.back();
			};
        }]
    }
  });