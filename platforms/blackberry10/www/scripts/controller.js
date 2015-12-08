var globalUrl = 'http://52.4.100.3/gohere/rest';
var imgurl = "http://52.4.100.3/gohere/admin/uploads/setting";

$(window).load(function() { 
	$("#status").fadeOut(); // will first fade out the loading animation
	$("#preloader").delay(100).fadeOut("slow"); // will fade out the white DIV that covers the website.
});

var GoHereApp = angular.module('mainApp', [
  'ngRoute',
  'ngAnimate',
  'pascalprecht.translate',
  'ngSanitize',
  'ngCordova'
]);

GoHereApp.value('snapper');

GoHereApp.config(function ($translateProvider, $httpProvider, $cordovaInAppBrowserProvider) {
  $translateProvider.translations('en', {
    ABOUT_BUTTON	: 'About GoHere',
	FIND_BUTTON		: 'Find Washroom',
	ENG_BUTTON		: 'English',
	FR_BUTTON		: 'French',
	CURRENT_LOCATION: 'My Current Location',
	MAP				: 'Map',
	LOGIN			: 'Login',
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
	LOGIN			: 'Login',
	ADD_LOCATION	: 'Ajouter un lieu',
	ACCESS_CARD		: 'Buanderie Access Card',
	FAVOURITE		: 'Mes préférés',
  });
  if(localStorage.SelectedLanguage!==undefined){
  	$translateProvider.preferredLanguage(localStorage.SelectedLanguage);
  } else {
	  $translateProvider.preferredLanguage('en');
  }
  var defaultOptions = {
    location: 'no',
    clearcache: 'no',
    toolbar: 'no'
  };
	$cordovaInAppBrowserProvider.setDefaultOptions(defaultOptions);
	
	$httpProvider.defaults.headers.common['Access-Control-Allow-Orign'] = "*";
	$httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = "Content-Type";
	$httpProvider.defaults.headers.common['Access-Control-Allow-Methods'] = "GET, POST, OPTIONS";
	
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
	  when('/sponcers', {
		controller:  'sponcersController',   
        templateUrl: 'sponcers.html',
      }).
	  when('/login', {
		controller:  'loginController',   
        templateUrl: 'login.html',
      }).
	  when('/fblogin', {
		controller:  'fbloginController', 
		templateUrl: 'login.html',
      }).
	  when('/map', {
		controller:  'mapController',   
        templateUrl: 'map.html',
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
	//navigator.geolocation.getCurrentPosition(onSuccess, onError);
	GoHereApp.snapper.disable();
  }]);
  
  
  
  GoHereApp.controller('aboutController', ['$scope', '$rootScope', '$http', '$sce', function($scope,$rootScope, $http,$sce) {
	GoHereApp.snapper.close();
	$(".menu-item").removeClass('menu-item-active');  
	$("#active-about").addClass('menu-item-active');  
	$(".custom-header").css("display","block");  
	$("#status").fadeIn(); // will first fade out the loading animation
	$("#preloader").delay(100).fadeIn("slow");
	$http.get(globalUrl+"/pages/view/2.json").then(function(response) {
		$rootScope.PageName = response.data.response.page.name;
		$scope.PageContent = $sce.trustAsHtml(response.data.response.page.description);
		$("#status").fadeOut(); // will first fade out the loading animation
		$("#preloader").delay(100).fadeOut("slow");
	});
  }]);
  
  GoHereApp.controller('sponcersController', ['$scope', '$rootScope', '$http', '$sce', function($scope,$rootScope, $http,$sce) {
	GoHereApp.snapper.close();
	$(".menu-item").removeClass('menu-item-active');  
	$(".custom-header").css("display","block");  
	$("#status").fadeIn(); // will first fade out the loading animation
	$("#preloader").delay(100).fadeIn("slow");
	$http.get(globalUrl+"/supporters/index/1.json").then(function(response) {
		$rootScope.PageName = "Supporters";
		var htmls = "";
		angular.forEach(response.data.response, function(value, key) {
		  	if(key!="image_url"){
				htmls+= '<a href="javascript:void(0)" class="user-list-item"><img src="images/pictures/1s.jpg" alt="img"><strong>'+value.Supporter.name+'<br/></strong><em>United States, New York, NY </em></a><div class="decoration"></div>';
			}
		});
		$scope.PageContent = $sce.trustAsHtml(htmls);
		$("#status").fadeOut(); // will first fade out the loading animation
		$("#preloader").delay(100).fadeOut("slow");
	});
  }]);
  
  GoHereApp.controller('fbloginController', ['$scope', '$rootScope', '$http', '$sce', '$cordovaOauth', function($scope,$rootScope, $http,$sce, $cordovaOauth) {
  	alert("Hi");
	$cordovaOauth.facebook("1621553258106847", ["email"]).then(function(result) {
		// results
	}, function(error) {
		alert(error);
		// error
	});
  }]);	
	
  GoHereApp.controller('loginController', ['$scope', '$rootScope', '$http', '$sce', '$cordovaOauth', '$cordovaInAppBrowser', function($scope,$rootScope, $http,$sce, $cordovaOauth, $cordovaInAppBrowser) {
	GoHereApp.snapper.close();
	$(".menu-item").removeClass('menu-item-active');  
	$("#active-login").addClass('menu-item-active');  
	$(".custom-header").css("display","block");  
	$rootScope.PageName = "Login";
	$scope.facebookLogin = function(){
		$cordovaInAppBrowser.open('#/fblogin', '_blank').then(function(event) {
			
		  })
		  .catch(function(event) {
			// error
		  });
	
	};
	$scope.checkLogin = function(){
		var request = $http({
			method: "post",
            url: globalUrl+"/users/login.json",
            data: {
            	email	: $scope.Email,
                password: $scope.Password
			}
		});
        request.success(
        	function( html ) {
            	alert(html);
			}
		);
	}
  }]);
  
  GoHereApp.controller('mapController', ['$scope', '$rootScope', '$http', '$sce', function($scope,$rootScope, $http,$sce) {
	GoHereApp.snapper.close();
	$(".menu-item").removeClass('menu-item-active');  
	$("#active-login").addClass('menu-item-active');  
	$(".custom-header").css("display","block");  
	$rootScope.PageName = "Find a Washroom";
	var mapDiv = document.getElementById("map_canvas");
	const GORYOKAKU_JAPAN = new plugin.google.maps.LatLng(41.796875,140.757007);
	
	var map = plugin.google.maps.Map.getMap(mapDiv,{
	  'backgroundColor': 'white',
	  'mapType': plugin.google.maps.MapTypeId.HYBRID,
	  'controls': {
		'compass': true,
		'myLocationButton': true,
		'indoorPicker': true,
		'zoom': true
	  },
	  'gestures': {
		'scroll': true,
		'tilt': true,
		'rotate': true,
		'zoom': true
	  },
	  'camera': {
		'latLng': GORYOKAKU_JAPAN,
		'tilt': 30,
		'zoom': 15,
		'bearing': 50
	  }
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
  var onSuccess = function(position) {
    alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
};

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}