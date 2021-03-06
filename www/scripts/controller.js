//var globalUrl = 'http://mba.gohere-api.com';
var globalUrl = 'http://52.4.100.3/gohere/rest';
var imgurl = "http://52.4.100.3/gohere/admin/uploads/setting";
//var globalUrl = 'http://52.3.29.145/gohere/rest';
//var imgurl = "http://52.3.29.145/gohere/admin/uploads/setting";

$(window).load(function() { 
	$("#status").fadeOut(); // will first fade out the loading animation
	$("#preloader").fadeOut("fast"); // will fade out the white DIV that covers the website.
});

var GoHereApp = angular.module('mainApp', [
  'ngRoute',
  'ngAnimate',
  'pascalprecht.translate',
  'ngSanitize',
  'ngCordova',
  'uiGmapgoogle-maps',
  'ngScrollbars',
  'satellizer',
  'google.places',
]);

GoHereApp.value('snapper');

GoHereApp.config(function ($translateProvider, $httpProvider, $cordovaInAppBrowserProvider, uiGmapGoogleMapApiProvider, ScrollBarsProvider) {
  $translateProvider.translations('en', LangEn);
  $translateProvider.translations('fr', LangFr);
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
  	
	uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyA810mJouG3HV-YTwitCLbqxktdPC_0t60',
        v: '3.23',
        libraries: 'weather,geometry,visualization'
    });
	ScrollBarsProvider.defaults = {
		autoHideScrollbar: false,
		setHeight: $( window ).height() - 390,
		scrollInertia: 0,
		axis: 'y',
		advanced: {
			updateOnContentResize: true
		},
		scrollButtons: {
			scrollAmount: 'auto', // scroll amount when button pressed
			enable: true // enable scrolling buttons by default
		}
	};
	$cordovaInAppBrowserProvider.setDefaultOptions(defaultOptions);
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

GoHereApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
		controller:  'splashController',   
        templateUrl: 'splash.html',
      }).
	  when('/language', {
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
	  when('/forget-password', {
		controller:  'forgetController',   
        templateUrl: 'forget.html',
      }).
	  when('/fblogin', {
		controller:  'fbloginController', 
		templateUrl: 'login.html',
      }).
	  when('/create-account', {
		controller:  'signupController', 
		templateUrl: 'signup.html',
      }).
	  when('/map', {
		controller:  'mapController',   
        templateUrl: 'map.html',
      }).
	  when('/map/:source/:destination', {
		controller:  'mapController',   
        templateUrl: 'map.html',
      }).
	  when('/detail/:id', {
		controller:  'detailController',   
        templateUrl: 'detail.html',
      }).
	  when('/direction/:lat/:long', {
		controller:  'directionController',   
        templateUrl: 'direction.html',
      }).
	   when('/add-location', {
		controller:  'locationController',   
        templateUrl: 'location.html',
      }).
	  when('/my-access-card', {
		controller:  'accessController',   
        templateUrl: 'access.html',
      }).
	  when('/saved-routes', {
		controller:  'routesController',   
        templateUrl: 'routes.html',
      }).
	  when('/favourite', {
		controller:  'favouriteController',   
        templateUrl: 'favourite.html',
      }).
	  when('/logout', {
		controller:  'logoutController',   
        templateUrl: 'login.html',
      }).
	  when('/404', {
		controller:  '404Controller',   
        templateUrl: '404.html',
      }).
	  otherwise({
        redirectTo: '/'
      });
  }]);
  
  GoHereApp.controller('splashController', ['$scope','$location', '$translate', function($scope,$location,$translate) {
	  if(localStorage.hasSplashed!==undefined){
	  	$location.path("/language");
	  } else {

		  $(".custom-header").css("display","none");
		  GoHereApp.snapper.disable();
		  align_cover_elements(); 
		  $('.coverpage-slider').owlCarousel({
			  loop:false,
			  margin:-2,
			  nav:false,
			  dots:true,
			  items:1
		  });

// Listen to owl events:
		  $('.coverpage-slider').on('changed.owl.carousel', function(event) {

		  })
	  }
  }]);
  GoHereApp.controller('LanguageController', ['$scope','$location', '$translate', function($scope,$location,$translate) {
	//localStorage.removeItem('SelectedLanguage');
	$(".custom-header").css("display","none");
	localStorage.hasSplashed = 1;
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
  
  GoHereApp.controller('404Controller', ['$scope', function($scope) {
	$(".custom-header").css("display","none");
	GoHereApp.snapper.disable();
	align_cover_elements();
  }]);
  
  
  GoHereApp.controller('aboutController', ['$scope', '$rootScope', '$http', '$sce', '$cordovaInAppBrowser', function($scope,$rootScope, $http,$sce,$cordovaInAppBrowser) {
	GoHereApp.snapper.close();
	$(".menu-item").removeClass('menu-item-active');  
	$("#active-about").addClass('menu-item-active');  
	$(".custom-header").css("display","block");  
	$("#status").fadeIn(); // will first fade out the loading animation
	$("#preloader").fadeIn("fast");
	$http.get(globalUrl+"/pages/view/2.json").then(function(response) {
		$rootScope.PageName = response.data.response.page.name;
		$scope.PageContent = $sce.trustAsHtml(response.data.response.page.description);
		//$cordovaInAppBrowser.open('http://ngcordova.com', '_blank')
		$("#status").fadeOut(); // will first fade out the loading animation
		$("#preloader").fadeOut("fast");
	});
	
  }]);
  
  GoHereApp.controller('sponcersController', ['$scope', '$rootScope', '$http', '$sce', '$translate', function($scope,$rootScope, $http,$sce, $translate) {
	GoHereApp.snapper.close();
	$(".menu-item").removeClass('menu-item-active');  
	$(".custom-header").css("display","block");  
	$("#status").fadeIn(); // will first fade out the loading animation
	$("#preloader").fadeIn("fast");
	$http.get(globalUrl+"/supporters/index/1.json").then(function(response) {
		$rootScope.PageName = 'SUPPORTERS';
		var htmls = "";
		angular.forEach(response.data.response, function(value, key) {
			if(key!="image_url"){
				//console.log(response.data.response.image_url+value.Supporter.image);
				htmls+= '<a href="javascript:void(0)" class="user-list-item"><div class="col-xs-12 text-center"><img src="'+response.data.response.image_url+value.Supporter.image+'" alt="img"></div><strong class="col-xs-12 text-center">'+value.Supporter.name+'<br/></strong></a><div class="decoration"></div>';
			}
		});
		$scope.PageContent = $sce.trustAsHtml(htmls);
		$("#status").fadeOut(); // will first fade out the loading animation
		$("#preloader").fadeOut("fast");
	});
  }]);

  GoHereApp.controller('logoutController', ['$scope', '$rootScope', '$location', '$http', '$sce', '$cordovaInAppBrowser', function($scope,$rootScope, $location, $http,$sce, $cordovaInAppBrowser) {
	  	localStorage.removeItem('currentUser');
		$rootScope.currentUser = '';
		$location.path("/login");
		$("#active-logout").addClass("hide");
		$("#active-login").removeClass("hide");
  }]);
  GoHereApp.controller('forgetController', ['$scope', '$rootScope', '$location', '$http', '$sce', '$cordovaInAppBrowser', '$translate', function($scope,$rootScope, $location, $http,$sce, $cordovaInAppBrowser, $translate) {
	  GoHereApp.snapper.close();
	  $(".menu-item").removeClass('menu-item-active');
	  $("#active-login").addClass('menu-item-active');
	  $(".custom-header").css("display","block");
	  $rootScope.PageName = 'RESET_PASSWORD';
	  align_cover_elements();
	  $scope.resetpass = function(){
		if ($scope.userForm.$valid) {
			$("#status").fadeIn(); // will first fade out the loading animation
			$("#preloader").fadeIn("fast");
			$(".alert-danger").addClass("hide");
			$(".alert-success").addClass("hide");
			var request = $http({
				method: "post",
				url: globalUrl+"/users/forgot.json",
				data: {
					email		: $scope.Email,
				}
			});
			request.success(
				function( data ) {
					if(data.response.status == true){
						$(".alert-success").removeClass("hide");
						$(".alert-success").html('<span class="fa fa-user" aria-hidden="true"></span><span class="sr-only">Success:</span> A reset password link has been sent to your email. Please check your email.');
					} else {
						$(".alert-danger").removeClass("hide");
						$(".alert-danger").html('<span class="fa fa-user" aria-hidden="true"></span><span class="sr-only">Error:</span> Email not registered.');
					}
					$("#status").fadeOut(); // will first fade out the loading animation
					$("#preloader").fadeOut("fast");
				}
			);
		} else {
			$(".alert-danger").removeClass("hide");
			$(".alert-danger").html('<span class="fa fa-user" aria-hidden="true"></span><span class="sr-only">Error:</span> Please enter valid email address.');
		}
	  }
  }]);
  GoHereApp.controller('loginController', ['$scope', '$rootScope', '$location', "$cordovaOauth", '$http', '$sce',  '$cordovaInAppBrowser', '$translate', function($scope,$rootScope, $location, $cordovaOauth, $http,$sce, $cordovaInAppBrowser, $translate) {
	GoHereApp.snapper.close();
	$(".menu-item").removeClass('menu-item-active');
	$("#active-login").addClass('menu-item-active');
	$(".custom-header").css("display","block");
	$rootScope.PageName = 'LOGIN';
	align_cover_elements();

	displayData = function ($http, access_token){
		$http.get("https://graph.facebook.com/v2.2/me", {params: {access_token: access_token, fields: "name,email,gender,location,picture", format: "json" }}).then(function(result) {
			var request = $http({
				method: "post",
				url: globalUrl+"/users/add.json",
				data: {
					username	: result.data.name,
					email		: result.data.email,
					password	: "",
					postal_code	: "",
					year		: "",
					regtype		: 'facebook',
					registerId	: result.data.id,
				}
			});
			request.success(
				function( data ) {
					if(data.response.status == true){
						localStorage.currentUser = data.response.user_id;
						$rootScope.currentUser = data.response.user_id;
						$("#active-login").addClass("hide");
						$("#active-logout").removeClass("hide");
						if(localStorage.SetRedirect!==undefined && localStorage.SetRedirect!=""){
							var paths = localStorage.SetRedirect;
							localStorage.removeItem('SetRedirect');
							$location.path(paths);
						} else {
							$location.path("/map");
						}
					}
				}
			);
		});
	}
	$scope.fblogin = function() {
		$cordovaOauth.facebook("1621553258106847", ["email", "public_profile"], {redirect_uri: "http://localhost/callback"}).then(function(result){
			displayData($http, result.access_token);
		});
	}
	$scope.checkLogin = function(){
		if ($scope.userForm.$valid) {
			$("#status").fadeIn(); // will first fade out the loading animation
			$("#preloader").fadeIn("fast");
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
					if(html.response.status == true){
						localStorage.currentUser = html.response.user_id;
						$rootScope.currentUser = html.response.user_id;
						$("#active-login").addClass("hide");
						$("#active-logout").removeClass("hide");
						if(localStorage.SetRedirect!==undefined && localStorage.SetRedirect!=""){
							var paths = localStorage.SetRedirect;
							localStorage.removeItem('SetRedirect');
							$("#status").fadeOut(); // will first fade out the loading animation
							$("#preloader").fadeOut("fast");
							$location.path(paths);
						} else {
							$location.path("/map");
						}
					} else {
						$(".alert-danger").removeClass("hide");
						$(".alert-danger").html('<span class="fa fa-user" aria-hidden="true"></span><span class="sr-only">Error:</span> Invalid email or password.');
						$("#status").fadeOut(); // will first fade out the loading animation
						$("#preloader").fadeOut("fast");
					}
				}
			);
		} else {
			$(".alert-danger").removeClass("hide");
			$(".alert-danger").html('<span class="fa fa-user" aria-hidden="true"></span><span class="sr-only">Error:</span> All fields are required.');
		}
	}
  }]);

  
  GoHereApp.controller('signupController', ['$scope', '$rootScope', '$location', '$http', '$sce', '$cordovaInAppBrowser', '$translate', function($scope,$rootScope, $location, $http,$sce, $cordovaInAppBrowser, $translate) {
	GoHereApp.snapper.close();
	$(".menu-item").removeClass('menu-item-active');
	$("#active-login").addClass('menu-item-active');
	$(".custom-header").css("display","block");
	  $('.pageapp-signup').on('scroll touchmove mousewheel', function(e){
		  e.preventDefault();
		  e.stopPropagation();
		  return false;
	  })
	$rootScope.PageName = 'SIGNUP';
	align_cover_elements();
	$scope.checkRegister = function(){
		if ($scope.userForm.$valid) {
			$("#status").fadeIn(); // will first fade out the loading animation
			$("#preloader").fadeIn("fast");
			var request = $http({
				method: "post",
				url: globalUrl+"/users/add.json",
				data: {
					username	: $scope.Name,
					email		: $scope.Email,
					password	: $scope.Password,
					postal_code	: $scope.Postcode,
					regtype		: 'normal'
				}
			});
			request.success(
				function( data ) {
					if(data.response.status == true){
						localStorage.currentUser = data.response.user_id;
						$rootScope.currentUser = data.response.user_id;
						$("#active-login").addClass("hide");
						$("#active-logout").removeClass("hide");
						if(localStorage.SetRedirect!==undefined && localStorage.SetRedirect!=""){
							var paths = localStorage.SetRedirect;
							localStorage.removeItem('SetRedirect');
							$location.path(paths);
						} else {
							$location.path("/map");
						}
					} else {
						$(".alert-danger").removeClass("hide");
						$(".alert-danger").html('<span class="fa fa-user" aria-hidden="true"></span><span class="sr-only">Error:</span> User already registered.');
						align_cover_elements();
						$("#status").fadeOut(); // will first fade out the loading animation
						$("#preloader").fadeOut("fast");
					}

				}
			);
		} else {
            $(".alert-danger").removeClass("hide");
            $(".alert-danger").html('<span class="fa fa-user" aria-hidden="true"></span><span class="sr-only">Error:</span> All fields are required.');
		}
	}
  }]);

  GoHereApp.controller('mapController', ['$scope', '$rootScope', '$http', '$sce', '$cordovaGeolocation',  'uiGmapGoogleMapApi', 'uiGmapIsReady', '$routeParams', '$translate', function($scope,$rootScope, $http,$sce, $cordovaGeolocation, uiGmapGoogleMapApi,uiGmapIsReady,$routeParams, $translate) {
	GoHereApp.snapper.close();
	$(".menu-item").removeClass('menu-item-active');  
	$("#active-map").addClass('menu-item-active');  
	$(".custom-header").css("display","block");  
	$("#status").fadeIn(); // will first fade out the loading animation
	$("#preloader").fadeIn("fast");
	$rootScope.PageName = 'FIND_A_WASHROOM';
	$scope.map = Array();
	$scope.map.markers = Array();

	$scope.gpsSuccess = 0;
	var posOptions = {timeout: 10000, enableHighAccuracy: true};

	getSetMapPageForSearch = function(loc1,loc2){
		var html ='';
		var thedecal = $("#Decal").val();
		var geocoder = new google.maps.Geocoder();
		var bounds = new google.maps.LatLngBounds();
		var path = Array();
		geocoder.geocode( { 'address': loc1}, function(results, status) {
			lat = results[0].geometry.location.lat();
			lng = results[0].geometry.location.lng();
			$scope.map = { center: { latitude: lat, longitude: lng }, markers:[], zoom: 10 };		
		});
		var request = {
			origin : loc1,
			destination : loc2,
			travelMode : google.maps.TravelMode.DRIVING
		};
		var html ='';
		var directionsService = new google.maps.DirectionsService();
		directionsService.route(request, function(response, status){
			if(status == google.maps.DirectionsStatus.OK){
				pointsArray = response.routes[0].overview_path;
                for (j = 0; j < pointsArray.length; j++)
                {
					temppath = {
                        latitude: pointsArray[j].lat(),
                        longitude: pointsArray[j].lng()
                    };
					path.push(temppath);
                }
				
			}
		});
		$scope.polylines = [
            {
                path: path,
				stroke: {
                    color: '#59a7ff',
                    weight: 3
                }
            },
            
        ];
		//$scope.polylines = path;
		//console.log(path);
	   	var request = $http({
			method: "post",
			url: globalUrl+"/washrooms/locations.json",
			data: {
				loc1	: loc1,
				loc2	: loc2,
				records	: 0,
				decal	: thedecal
			}
		});
		request.success(
			  function( data ) {
				  var markers = Array();
				  var inarrayid = Array();
				  if(data.response!="No record found"){
					  $.each(data.response,function(i,val){
						  if($.inArray(val.Washroom.id,inarrayid)==-1){
							  inarrayid.push(val.Washroom.id);	
							  var marker = {
								  id: val.Washroom.id,
								  name: val.Washroom.name,
								  icon: 'images/map-pin-active.png',
								  coords: {
									  latitude	: val.Washroom.lat,
									  longitude	: val.Washroom.log
								  }
							  };
							  markers.push(marker);
							  var distances = parseFloat(val.Washroom.distance);
							  html = html + '<div class="decoration"></div><a href="#/detail/'+val.Washroom.id+'" class="user-list-item2"><div class"row"><div class="col-xs-8"><strong>'+val.Washroom.name+'<br/></strong><em>'+val.Washroom.address+'</em></div><div class="col-xs-4 vcenter"> <i class="fa fa-chevron-right"></i></div></div></a>';
						  }
					  });
					  //console.log(markers);
					  $scope.map.markers = markers;
					  $('.mapinfo').html(html);
				  } else {
					  $('.mapinfo').html("");
				  }
				  $scope.scrollbarConfig = {
					  theme: 'dark',
					  scrollInertia: 500
				  }
				  
				  $("#status").fadeOut(); // will first fade out the loading animation
				  $("#preloader").fadeOut("fast"); 
			  }
		);
	}
	getSetMapPage = function(lat,long){
		var html ='';
		var thedecal = $("#Decal").val();
		$scope.map = { center: { latitude: lat, longitude: long }, markers:[], zoom: 12 };
		//uiGmapIsReady.promise(1).then(function(instances) {
		  var request = $http({
			  method: "post",
			  url: globalUrl+"/washrooms/index_distance.json",
			  data: {
				  lat		: lat,
				  long		: long,
				  records	: 0,
				  decal		: thedecal
			  }
		  });
		  request.success(
			  function( data ) {
				  var markers = Array();
				  if(data.response!="No record found"){
					  $.each(data.response,function(i,val){
						  var marker = {
							  id: val.Washroom.id,
							  name: val.Washroom.name,
							  icon: 'images/map-pin-active.png',
							  coords: {
								  latitude	: val.Washroom.lat,
								  longitude	: val.Washroom.log
							  }
						  };
						  markers.push(marker);	
						  var distances = parseFloat(val.Washroom.distance);
						  html = html + '<div class="decoration"></div><a href="#/detail/'+val.Washroom.id+'" class="user-list-item2"><div class"row"><div class="col-xs-8"><strong>'+val.Washroom.name+'<br/></strong><em>'+val.Washroom.address+'</em></div><div class="col-xs-4 vcenter">'+distances.toFixed(2)+'KM <i class="fa fa-chevron-right"></i></div></div></a>';
					  });
					  $scope.map.markers = markers;
					  $('.mapinfo').html(html);
				  } else {
					  $('.mapinfo').html("");
				  }
				  
				  
				  $scope.windowOptions = {
						visible: false
					};
					$scope.onClick = function(marker, eventName, model) {
						$(".gm-style-iw").parent().hide();
					};
				  $scope.scrollbarConfig = {
					  theme: 'dark',
					  scrollInertia: 1500
				  }


	  //$(".angular-google-map-container").css("height", 300);
				  //$scope.map.center = { latitude: lat, longitude: long };
				  //if(!$scope.$$phase) {
				  	//$scope.$apply();
				  //}

				  $("#status").fadeOut(); // will first fade out the loading animation
				  $("#preloader").fadeOut("fast"); 
			  }
		  );
	  //});
	}
	$scope.mylocation = function(){
		$scope.map.center = { latitude: $scope.Currentlats , longitude: $scope.Currentlongs };

	}


	PositionError = function(position){
		$(".gocurrentpostiton").css("display","none");
		navigator.geolocation.clearWatch($rootScope.watchID);
		$rootScope.watchID = navigator.geolocation.watchPosition(PositionSuccess, PositionError, { enableHighAccuracy: true, timeout: 10000 });
	}
	PositionSuccess = function(position){
		if($rootScope.PageName == 'FIND_A_WASHROOM'){
			$(".gocurrentpostiton").css("display","");
			var Watchlat  = position.coords.latitude;
			var Watchlong = position.coords.longitude;
			uiGmapGoogleMapApi.then(function(maps) {
			if($scope.map.homemarker==undefined){
				
				$scope.map.homemarker = {
					markid: 'homemarker',
				  	name: "Current Location",
				  	icon: 'images/gpss.gif',
				  	coords: {
					 	latitude	: Watchlat,
					  	longitude	: Watchlong
				  	}
			  	};
			  	//$scope.$apply();
				
				if($scope.gpsSuccess == 0){
					$("#status").fadeIn(); // will first fade out the loading animation
						$("#preloader").fadeIn("fast");
	
					$scope.Currentlats  = Watchlat;
					$scope.Currentlongs = Watchlong;
					
					$scope.map = { center: { latitude: Watchlat, longitude: Watchlong }, markers:[], zoom: 8 };
					
					
					var geocoder = new google.maps.Geocoder();
					
					var latlng = new google.maps.LatLng(Watchlat, Watchlong);
					geocoder.geocode({ 'latLng': latlng }, function (results, status) {
					  if (status == google.maps.GeocoderStatus.OK) {
						$scope.FromAddress = results[0].formatted_address;
					  }
					});
					$scope.autocompleteOptions = {
						componentRestrictions: { country: 'ca' },
						types: ['address']
					}
					$('.switch-1').click(function(){
					   $(this).toggleClass('switch-1-on'); 
						return false;
					});
					$scope.gpsSuccess = 1;
					getSetMapPage(Watchlat,Watchlong);
				}
			  	
			  //$scope.map.control.refresh();
			} else {
				//alert("zello");
				$scope.map.homemarker.coords = {
					latitude: Watchlat,
					longitude: Watchlong
			  	};
				if(!$scope.$$phase) {
					$scope.$apply();
				}
				//$scope.map.control.refresh();
				//$scope.map.refresh = true;
 			//home.setPosition(latlng);
			}
			});
		} else {	
			navigator.geolocation.clearWatch($rootScope.watchID);
		}
		//alert(currPage);
	}
	$(document).ready(function(){
        $(document).on("click",".myfavs", function (e) {
            var washrooms = $(this).data("washroom");
            if($rootScope.currentUser == '' || $rootScope.currentUser == undefined){
                alert("Please login to make this washroom as favourite.");
                return false;
            }
            var request = $http({
                method: "post",
                url: globalUrl+"/favourites/add.json",
                data: {
                    user_id		: $rootScope.currentUser,
                    washroom_id	: washrooms,
                }
            });
            request.success(
                function( result ) {
                    $(".favid").html('<i class="fa fa-star"></i>');
                }
            );
        });
		$(".hidetext").css("display","none");
		var WindowHeight = $( window ).height() - 130;
		$('.direction-controls .btn-icon').click(function(){
			$('.direction-controls').hide();
		});
		$(".angular-google-map-container").css({height: WindowHeight});
		//var WindowHeight = $( window ).height() - 60;
		//$(".angular-google-map-container").css("height", WindowHeight);
		uiGmapGoogleMapApi.then(function(maps) {
			$rootScope.watchID = navigator.geolocation.watchPosition(PositionSuccess, PositionError, { enableHighAccuracy: true, timeout: 10000 });
			$cordovaGeolocation.getCurrentPosition(posOptions)
			.then(function (position) {
				$scope.gpsSuccess = 1;
				var lat  = position.coords.latitude;
				var long = position.coords.longitude;
				
				$scope.Currentlats  = lat;
				$scope.Currentlongs = long;
				
				$scope.map = { center: { latitude: lat, longitude: long }, markers:[], zoom: 12 };
				//alert($routeParams.source);
				if($routeParams.source && $routeParams.destination && $routeParams.source!="" && $routeParams.destination!=""){
					$scope.FromAddress = $routeParams.source;
					$scope.ToAddress = $routeParams.destination;
					getSetMapPageForSearch($routeParams.source,$routeParams.destination);
				} else {
					var geocoder = new google.maps.Geocoder();
					
					var latlng = new google.maps.LatLng(lat, long);
					geocoder.geocode({ 'latLng': latlng }, function (results, status) {
					  if (status == google.maps.GeocoderStatus.OK) {
						$scope.FromAddress = results[0].formatted_address;
					  }
					});
					$scope.autocompleteOptions = {
						componentRestrictions: { country: 'ca' },
						types: ['address']
					}
					$('.switch-1').click(function(){
					   $(this).toggleClass('switch-1-on'); 
						return false;
					});
					getSetMapPage(lat,long);			
				}
			}, function(err) {
				
				$('.simple-modal-content4').modal();
				
				var lat  = 43.6888092;
				var long = -79.393413;
				
				$scope.Currentlats  = lat;
				$scope.Currentlongs = long;
				
				$scope.map = { center: { latitude: lat, longitude: long }, markers:[], zoom: 12 };
				
				
				var geocoder = new google.maps.Geocoder();
				
				var latlng = new google.maps.LatLng(lat, long);
				geocoder.geocode({ 'latLng': latlng }, function (results, status) {
				  if (status == google.maps.GeocoderStatus.OK) {
					$scope.FromAddress = results[0].formatted_address;
				  }
			  	});
				$scope.autocompleteOptions = {
					componentRestrictions: { country: 'ca' },
					types: ['address']
				}
				$('.switch-1').click(function(){
				   $(this).toggleClass('switch-1-on'); 
					return false;
				});
				
				getSetMapPage(lat,long);
			});
			
    	});
	});
	$("#FromAddress").keydown(function(e){
		if($(this).val().length>0){
			$("#FromCross").css("display","block");
		} else {
			$("#FromCross").css("display","none");
		}
	});
	$("#ToAddress").keydown(function(e){
		if($(this).val().length>0){
			$("#ToCross").css("display","block");
		} else {
			$("#ToCross").css("display","none");
		}
	});
	$scope.showsearch = function(){
		if(!$('.searchs').is(':visible')){
			$(".searchs").css("display","block");
		} else {
			$(".searchs").css("display","none");
		}
		
	}
	$scope.clearFrom = function(){
		$scope.FromAddress = "";
		$("#FromCross").css("display","none");
	}
	$scope.clearTo = function(){
		$scope.ToAddress = "";
		$("#ToCross").css("display","none");
	}
	$scope.getdecal = function(){
		if($('.isDecals').hasClass('switch-1-on')){
			$('#Decal').val(0);
		} else {
			$('#Decal').val(1);
		}
		$scope.searchzip();
	}
	$scope.closeMap = function(){
		$(".angular-google-map-container").animate({height: 300}, 500);
		$(".expandicon").css("display","none");
		$(".searchmap").css("display","block");	
		$(".hidetext").css("display","block");
		$("#location-list-toggle-down").show();
		$("#location-list-toggle-up").hide();
		$(".searchs").hide();
		$("#search-decal").animate({top: 85}, 500);


	}

      $scope.expandMap = function(){
		var WindowHeight = $( window ).height() - 130;
		$(".angular-google-map-container").animate({height: WindowHeight}, 500);
		//$scope.map.visualRefresh = true;
		//$scope.map.control.refresh();
		//$scope.map.control.refresh();
		$(".searchmap").css("display","none");
		$(".expandicon").css("display","block");	
		//$(".angular-google-map-container").height(WindowHeight);	
		$(".hidetext").css("display","none");
		$("#location-list-toggle-down").hide();
		$("#location-list-toggle-up").show();
		$(".searchs").show();
		$("#search-decal").animate({top: 150}, 500);
	}
	$scope.saveUserRoutes = function(){
		//$('.simple-modal-content').modal('hide');
		$.modal.close();
		if(typeof $scope.FromAddress === 'object' ){
			$scope.FromAddress = $scope.FromAddress.formatted_address;
		}
		if(typeof $scope.ToAddress === 'object' ){
			$scope.ToAddress = $scope.ToAddress.formatted_address;
		} 
		var request = $http({
			method: "post",
			url: globalUrl+"/routes/add.json",
			data: {
				name : $scope.RouteName,
				user_id : $rootScope.currentUser,
				source : $scope.FromAddress,
				distination : $scope.ToAddress,
			}
		});
		request.success(
			function( result ) {
			}
		);
	}

      $(document).on("click","#showPopups", function () {
          $("#boxforroute").click();
      });
      $scope.saveRoutesBox = function() {
          if ($rootScope.currentUser == '' || $rootScope.currentUser == undefined) {
              $('.simple-modal-content3').modal();
              return;
          }
          if ($.trim($scope.FromAddress) != "" && $.trim($scope.ToAddress) != "") {
              if (typeof $scope.FromAddress === 'object') {
                  $scope.FromAddress = $scope.FromAddress.formatted_address;
              }
              if (typeof $scope.ToAddress === 'object') {
                  $scope.ToAddress = $scope.ToAddress.formatted_address;
              }
              $('.simple-modal-content').modal();
              return;
          } else {
              $('.simple-modal-content2').modal();
              return;
          }
      }
      $scope.saveRoutes = function() {
        $('.simple-modal-content10').modal();
    }
      $scope.showdirectionsMap = function(){
		if($.trim($scope.FromAddress)!="" && $.trim($scope.ToAddress)!=""){
			if(typeof $scope.FromAddress === 'object' ){
				$scope.FromAddress = $scope.FromAddress.formatted_address;
			}
			if(typeof $scope.ToAddress === 'object' ){
				$scope.ToAddress = $scope.ToAddress.formatted_address;
			} 
			window.location.href = "https://www.google.ca/maps/dir/"+$scope.FromAddress+"/"+$scope.ToAddress;
		} else {
			alert("From and To Address both are required.");
		}
	}
	$scope.searchzip = function(){
		if(typeof $scope.FromAddress === 'object' ){
			$scope.FromAddress = $scope.FromAddress.formatted_address;
		}
		if(typeof $scope.ToAddress === 'object' ){
			$scope.ToAddress = $scope.ToAddress.formatted_address;
		}
		if($.trim($scope.FromAddress)!="" && $.trim($scope.ToAddress)!=""){
			$("#status").fadeIn(); // will first fade out the loading animation
			$("#preloader").fadeIn("fast");
			getSetMapPageForSearch($.trim($scope.FromAddress),$.trim($scope.ToAddress));
			$('.direction-controls').fadeIn();
		} else if($.trim($scope.FromAddress)!=""){
			$("#status").fadeIn(); // will first fade out the loading animation
			$("#preloader").fadeIn("fast");
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode( { 'address': $scope.FromAddress}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					lat = results[0].geometry.location.lat();
				 	lng = results[0].geometry.location.lng();
					getSetMapPage(lat,lng);
				}
			});
		} else {
			alert("Please enter valid From Address.");
		}
	}
  }]);
  GoHereApp.controller('directionController', ['$scope', '$rootScope', '$http', '$sce', '$cordovaGeolocation',  'uiGmapGoogleMapApi', '$routeParams', '$translate', function($scope,$rootScope, $http,$sce, $cordovaGeolocation, uiGmapGoogleMapApi, $routeParams, $translate) {
  	$rootScope.PageName = 'DETAIL_ROUTE';
	$("#status").fadeIn(); // will first fade out the loading animation
	$("#preloader").fadeIn("fast");
	uiGmapGoogleMapApi.then(function(maps) {
		$cordovaGeolocation.getCurrentPosition({timeout: 10000, enableHighAccuracy: true}).then(function (position) {
			var originlat  = position.coords.latitude;
			var originlong = position.coords.longitude;
			var Destlat = $routeParams.lat;
			var Destlong = $routeParams.long;
			var request = {
				origin : new google.maps.LatLng(originlat,originlong),
				destination : new google.maps.LatLng(Destlat,Destlong),
				travelMode : google.maps.TravelMode.DRIVING
			};
			var html ='';
			var directionsService = new google.maps.DirectionsService();
			directionsService.route(request, function(response, status){
				if(status == google.maps.DirectionsStatus.OK){
					$scope.maps = { center: { latitude: Destlat, longitude: Destlong }, markers:[], zoom: 12 };
					
					var marker = {
						id: '1',
						icon: 'images/map-pin_.png',
						coords: {
							latitude	: originlat,
							longitude	: originlong
						}
					};
					$scope.maps.markers.push(marker);
					var marker = {
						id: '2',
						icon: 'images/map-pin_.png',
						coords: {
							latitude	: Destlat,
							longitude	: Destlong
						}
					};
					$scope.maps.markers.push(marker);
					var myRoute = response.routes[0].legs[0];
					//console.log(myRoute);
					html = '<div class="row"><div class="col-xs-12"><strong>'+myRoute.start_address+'</strong></div></div>';
					$.each(myRoute.steps,function(i,val){
						if($.trim(val.maneuver)!=""){
							var resdata = val.maneuver.replace("turn-","");
							var turnlocation = '<i class="fa fa-hand-o-'+resdata+'"></i>';
						} else {
							var turnlocation = "&nbsp;";
						}
						html = html + '<div class="decoration"></div><div class="row"><div class="col-xs-1">'+turnlocation+'</div><div class="col-xs-1">'+(i+1)+'</div><div class="col-xs-7">'+val.instructions+'</div><div class="col-xs-2">'+val.distance.text+'</div></div>';
					});
					html = html + '<div class="decoration"></div><div class="row"><div class="col-xs-12"><strong>'+myRoute.end_address+'</strong></div></div>';
					
					$('.mapinfo').html(html);
					$scope.scrollbarConfig = {
						theme: 'dark',
						scrollInertia: 500,
					}
					$("#status").fadeOut(); // will first fade out the loading animation
					$("#preloader").fadeOut("fast"); 
				}
			});
		});
	});
  }]);
  GoHereApp.controller('detailController', ['$scope', '$rootScope', '$http', '$sce', '$cordovaGeolocation',  'uiGmapGoogleMapApi', '$routeParams',function($scope,$rootScope, $http,$sce, $cordovaGeolocation, uiGmapGoogleMapApi, $routeParams) {
	  	GoHereApp.snapper.close();
		$(".menu-item").removeClass('menu-item-active');
		$(".custom-header").css("display","block");  
		$("#status").fadeIn(); // will first fade out the loading animation
		$("#preloader").fadeIn("fast");
		$("#OverallRating").rating();
		
		$("#Cleanness").rating();
		$('#Cleanness').on('rating.change', function(event, value, caption) {
			$scope.Cleanness = value;
		});
		$("#EaseAccess").rating();
		$('#EaseAccess').on('rating.change', function(event, value, caption) {
			$scope.EaseAccess = value;
		});
		$("#AvailableHours").rating();
		$('#AvailableHours').on('rating.change', function(event, value, caption) {
			$scope.AvailableHours = value;
		});

	  	$scope.Feedback = '';
		$cordovaGeolocation.getCurrentPosition({timeout: 10000, enableHighAccuracy: true}).then(function (position) {
			$scope.Currentlats  = position.coords.latitude;
			$scope.Currentlongs = position.coords.longitude;
		});

		$http.get(globalUrl+"/washrooms/view/"+$routeParams.id+".json").then(function(response) {
			var collectComment = '';
			var requester = $http({
				method: "post",
				url: globalUrl+"/comments/index/"+$routeParams.id+".json",
			});
			requester.success(
				function( result ) {
					if(result.response.length == 0){
						collectComment = '<div class="static-notification bg-red-dark tap-dismiss"><p><i class="fa fa-times"></i>No comments have been posted.</p></div> ';
					} else {
						$.each(result.response,function(i,data){
							if(i%2==0){
								var BubbleType = "left";
								var BubbleColor = "blue-bubble";
							} else {
								var BubbleType = "right";
								var BubbleColor = "";
							}
							collectComment = collectComment+'<em class="speach-'+BubbleType+'-title">'+data.Comment.username+' <i class="fa fa-clock-o"></i> '+data.Comment.created+' :</em><p class="speach-'+BubbleType+' '+BubbleColor+'">'+data.Comment.name+'</p><div class="clear"></div>';
						});
					}
					
					$(".addcomments").html(collectComment);
				}
			); 
			
			
			$scope.lats = response.data.response.Washroom.lat;
			$scope.longs = response.data.response.Washroom.log;
			$scope.map = { center: { latitude: response.data.response.Washroom.lat, longitude: response.data.response.Washroom.log }, markers:[], zoom: 15 };
			var marker = {
				id: response.data.response.Washroom.id,
				icon: 'images/map-pin_.png',
				coords: {
					latitude	: response.data.response.Washroom.lat,
					longitude	: response.data.response.Washroom.log
				}
			};
			$scope.map.markers.push(marker);
			$scope.WashroomName 	= $sce.trustAsHtml(response.data.response.Washroom.name);
                $rootScope.PageName = $scope.WashroomName ;
			var addresstext = response.data.response.Washroom.address;
			addresstext = addresstext.replace(",", ", ");
			$scope.WashroomAddress 	= $sce.trustAsHtml(addresstext);
			$scope.WashroomDesc 	= $sce.trustAsHtml(response.data.response.Washroom.description);
			$scope.showRatings = response.data.response.Washroom.show_ratings;
			$scope.showComments = response.data.response.Washroom.show_comments;
			$scope.showFeedback = response.data.response.Washroom.show_feedback;
			$scope.keyRequired = response.data.response.Washroom.key_required;
			$scope.website = response.data.response.Washroom.website;

			if(response.data.response.Washroom.rating==null){
				var washroomrating = 0;
			} else {
				var washroomrating = response.data.response.Washroom.rating;
			}
			$('#OverallRating').rating('update', washroomrating);
			// if($.trim(response.data.response.Washroom.from)==""){
			// 	var FromTime = "9:00 AM";
			// } else {
			// 	var FromTime = response.data.response.Washroom.from;
			// }
			// if($.trim(response.data.response.Washroom.to)==""){
			// 	var ToTime = "6:00 PM";
			// } else {
			// 	var ToTime = response.data.response.Washroom.to;
			// }
			// $scope.WashroomTiming 	= $sce.trustAsHtml(FromTime+" To "+ToTime);

			if (response.data.response.Washroom.weekday_text) {
				$scope.WashroomSchedule	= angular.fromJson(response.data.response.Washroom.weekday_text);
			} else {
				$scope.WashroomSchedule	= false;
			}
			$scope.WashroomPhone	= response.data.response.Washroom.phone;

			if($rootScope.currentUser == '' || $rootScope.currentUser == undefined){
				$scope.loggedIn = false;
				//console.log("current user is undefined or blank");
			} else {
				//console.log("current user is:", $rootScope.currentUser);
				$scope.loggedIn = true;
			}


			if (response.data.response.Washroom.analytics_enabled == 1 && $scope.loggedIn) {
				console.log("analytics are enabled. sending ping");
				var feedbackData = {
					user_id		: $rootScope.currentUser,
					washroom_id	: $routeParams.id,
					feedback		: ""
				};
				var request = $http({
					method: "post",
					url: globalUrl+"/analytics/add.json",
					data: feedbackData
				}).success(function(responseData) {
						console.log("analytics ping sent");
					}
				).error(function(responseData) {
						console.log("analytics ping CANNOT be sent: ", responseData);
					}
				);
			}


			$('.tap-dismiss').click(function(){
			   $(this).slideUp(200); 
				return false;
			});
			
			$("#status").fadeOut(); // will first fade out the loading animation
			$("#preloader").fadeOut("fast");
		});
		
		$scope.submitRating = function(){
			$(".alert-danger").addClass("hide");
			$(".alert-success").addClass("hide");
			
			if(angular.isUndefined($scope.Cleanness) || angular.isUndefined($scope.EaseAccess) || angular.isUndefined($scope.AvailableHours)){
				$(".alert-danger").removeClass("hide");
				$(".alert-danger").html('<span class="fa fa-user" aria-hidden="true"></span><span class="sr-only">Error:</span> Please select all 3 ratings.');
				return;
			}
			var request = $http({
				method: "post",
				url: globalUrl+"/ratings/add_all.json",
				data: {
					user_id		: $rootScope.currentUser,
					washroom_id	: $routeParams.id,
					rating		: {0: $scope.Cleanness,1: $scope.EaseAccess,2: $scope.AvailableHours},
				}
			});
			request.success(
				function( result ) {
					$('#Cleanness').rating('update', 0);
					$('#EaseAccess').rating('update', 0);
					$('#AvailableHours').rating('update', 0);
					$http.get(globalUrl+"/ratings/viewAvgByWashroomId/"+$routeParams.id+".json").then(function(response) {
						$('#OverallRating').rating('update', response.data.response.avg_rate);
					});
					$(".alert-success").removeClass("hide");
					$(".alert-success").html('<p><i class="fa fa-times"></i>No comments have been posted.</p>');
				}
			);
		}
		$scope.checkFavorites = function(){
			if($rootScope.currentUser == '' || $rootScope.currentUser == undefined){
				alert("Please login to make this washroom as favourite.");
				return false;
			}
			var request = $http({
				method: "post",
				url: globalUrl+"/favourites/add.json",
				data: {
					user_id		: $rootScope.currentUser,
					washroom_id	: $routeParams.id,
				}
			});
			request.success(
				function( result ) {
					$(".favid").html('<i class="fa fa-star"></i>');
				}
			);		
		}
		$scope.setComment = function(){
            $(".comment-danger").addClass("hide");
            $(".comment-danger").html('');
            var comments = $("#currentComment").val();
            if ($.trim(comments)!="") {
                var request = $http({
                    method: "post",
                    url: globalUrl+"/comments/add.json",
                    data: {
                        user_id		: $rootScope.currentUser,
                        washroom_id	: $routeParams.id,
                        name		: comments
                    }
                });
                request.success(
                    function( result ) {
                        if(result.response.status == true){
                            $("#currentComment").val("");
                            $(".commentsuccess").removeClass("hide");
                            var collectComment = '';
                            var requester = $http({
                                method: "post",
                                url: globalUrl+"/comments/index/"+$routeParams.id+".json",
                            });
                            requester.success(
                                function( result ) {
                                    if(result.response.length == 0){
                                        collectComment = '<div class="static-notification bg-red-dark tap-dismiss"><p><i class="fa fa-times"></i>Be the first to comment...</p></div> ';
                                    } else {
                                        $.each(result.response,function(i,data){
                                            if(i%2==0){
                                                var BubbleType = "left";
                                                var BubbleColor = "blue-bubble";
                                            } else {
                                                var BubbleType = "right";
                                                var BubbleColor = "";
                                            }
                                            collectComment = collectComment+'<em class="speach-'+BubbleType+'-title">'+data.Comment.username+' <i class="fa fa-clock-o"></i> '+data.Comment.created+' :</em><p class="speach-'+BubbleType+' '+BubbleColor+'">'+data.Comment.name+'</p><div class="clear"></div>';
                                        });
                                    }

                                    $(".addcomments").html(collectComment);
                                }
                            );
                        }
                    }
                );
            } else {
                $(".comment-danger").removeClass("hide");
                $(".comment-danger").html('<span class="sr-only">Error:</span> Please add comment.');
            }
            
		};
	  	$scope.setFeedback = function() {
			if ($scope.feedbackForm.$valid) {

				var request = $http({
					method: "post",
					url: globalUrl + "/feedback/add.json",
					data: {
						user_id: $rootScope.currentUser,
						washroom_id: $routeParams.id,
						feedback: $scope.Feedback
					}
				});
				request.success(
					function (result) {
						if (result.response.status == true) {
							$scope.Feedback = "";
							$(".feedbacksuccess").removeClass("hide");
						}
					}
				);
			}
			;
		}
  }]);	  
  GoHereApp.controller('locationController', ['$scope', '$rootScope', '$http', '$sce', '$cordovaGeolocation',  'uiGmapGoogleMapApi', '$routeParams', '$location', '$translate', function($scope,$rootScope, $http,$sce, $cordovaGeolocation, uiGmapGoogleMapApi, $routeParams, $location, $translate) {
  	GoHereApp.snapper.close();
	if($rootScope.currentUser == '' || $rootScope.currentUser == undefined){
		
		localStorage.SetRedirect = '/add-location';
		$location.path("/login");
	}
	$(".menu-item").removeClass('menu-item-active');  
	$("#active-location").addClass('menu-item-active'); 
	$(".custom-header").css("display","block");  
	$rootScope.PageName = 'ADD_LOCATION';
	$("#Cleanness").rating();
	$('#Cleanness').on('rating.change', function(event, value, caption) {
		$scope.Cleanness = value;
	});
	$("#EaseAccess").rating();
	$('#EaseAccess').on('rating.change', function(event, value, caption) {
		$scope.EaseAccess = value;
	});
	$("#AvailableHours").rating();
	$('#AvailableHours').on('rating.change', function(event, value, caption) {
		$scope.AvailableHours = value;
	});
	$('.switch-1').click(function(){
       $(this).toggleClass('switch-1-on'); 
        return false;
    });
	$('.isDecals').click(function(){
		if($('.isDecals').hasClass('switch-1-on')){
			$('#Decal').val(1);
		} else {
			$('#Decal').val(0);
		}
    });
	
	$(".getlocation").click(function(e){
		$cordovaGeolocation.getCurrentPosition({timeout: 10000, enableHighAccuracy: true})
		.then(function (position) {
			var lat  = position.coords.latitude;
			var long = position.coords.longitude;
			var geocoder = new google.maps.Geocoder();
            var latlng = new google.maps.LatLng(lat, long);
			
			$scope.lat = lat;
			$scope.long = long;
					
			geocoder.geocode({ 'latLng': latlng }, function (results, status) {
			  if (status == google.maps.GeocoderStatus.OK) {
				var addresses = results[0].formatted_address;
				var getLength = results[0].address_components.length-1;
                postalCode = results[0].address_components[getLength].long_name;
                $scope.Address = results[0].formatted_address;
				$scope.Postcode = postalCode;
				$("#Addresses").val(results[0].formatted_address);
				$("#PostCode").val(postalCode);
			  }
		  });
		});
	});
	$scope.addLocation = function(){
		$(".alert-danger").addClass("hide");
		$(".alert-success").addClass("hide");
		if(angular.isUndefined($scope.BusinessName) || angular.isUndefined($scope.Address) || angular.isUndefined($scope.Postcode)){
			$(".alert-danger").removeClass("hide");
			$(".alert-danger").html('<span class="fa fa-user" aria-hidden="true"></span><span class="sr-only">Error:</span> Business Name, Address and Postcode are required field.');
			return;
		}
		$("#status").fadeIn(); // will first fade out the loading animation
		$("#preloader").fadeIn("fast");
		//if ($scope.userForm.$valid) {
			if($scope.lat=="" || $scope.long==""){
				var geocoder = new google.maps.Geocoder();
				geocoder.geocode( { 'address': $scope.Address}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						$scope.lat = results[0].geometry.location.lat();
						$scope.long = results[0].geometry.location.lng();
					}
				});	
			}
			var request = $http({
				method: "post",
				url: globalUrl+"/washrooms/add.json",
				data: {
					name				: $scope.BusinessName,
					description			: $scope.Comment,
					physically_disable	: $scope.Decal,
					address				: $scope.Address,
					postal_code			: $scope.Postcode,
					lat					: $scope.lat,
					log					: $scope.long,
					rating				: {0: $scope.Cleanness, 1: $scope.EaseAccess, 2: $scope.AvailableHours},
					user_id				: $rootScope.currentUser
				}
			});
			request.success(
				function( data ) {
					if(data.response.status == false){
						$(".alert-danger").removeClass("hide");
						$(".alert-danger").html('<span class="fa fa-user" aria-hidden="true"></span><span class="sr-only">Error:</span> This location already exist.');
					} else {
						$scope.BusinessName = "";
						$scope.Comment = "";
						$scope.Address = "";
						$scope.Postcode = "";
						$scope.lat = "";
						$scope.long = "";
						
						$(".alert-success").removeClass("hide");
						$(".alert-success").html('<span class="fa fa-user" aria-hidden="true"></span><span class="sr-only">Success:</span> Location added succeesfully.');
					}
					$("#status").fadeOut(); // will first fade out the loading animation
					$("#preloader").fadeOut("fast"); 
				}
			);	
		//}
	}
  }]);
  GoHereApp.controller('favouriteController', ['$scope', '$rootScope', '$http', '$sce', '$cordovaGeolocation',  'uiGmapGoogleMapApi', '$routeParams', '$location', '$translate', function($scope,$rootScope, $http,$sce, $cordovaGeolocation, uiGmapGoogleMapApi, $routeParams, $location, $translate) {
	  	GoHereApp.snapper.close();
		if($rootScope.currentUser == '' || $rootScope.currentUser == undefined){
			localStorage.SetRedirect = '/my-access-card';
			$location.path("/login");
		}
		$(".menu-item").removeClass('menu-item-active');  
		$(".custom-header").css("display","block");  
		$("#status").fadeIn(); // will first fade out the loading animation
		$("#preloader").fadeIn("fast");
		$rootScope.PageName = 'FAVOURITE';
		var html = "";
		$http.get(globalUrl+"/favourites/index_favourite/"+$rootScope.currentUser+".json").then(function(response) {
			if(response.data.response.length>0){
				$.each(response.data.response,function(i,val){
					html = html + '<a href="#/detail/'+val.Favourite.washroom_id+'" class="user-list-item2"><div class"row"><div class="col-xs-12"><strong>'+val.Washroom.name+'<br/></strong><em>'+val.Washroom.address+'</em></div></div></a><div class="decoration"></div>';
				});
			} else {
				html = html + '<div class="row"><div class="col-xs-12">You don\'t have any favourite washroom locations</div><div class="decoration"></div>';
			}
			$('.mapinfo').html(html);
			$("#status").fadeOut(); // will first fade out the loading animation
			$("#preloader").fadeOut("fast");
		});
  }]);  
  GoHereApp.controller('routesController', ['$scope', '$rootScope', '$http', '$sce', '$cordovaGeolocation',  'uiGmapGoogleMapApi', '$routeParams', '$location', '$translate', function($scope,$rootScope, $http,$sce, $cordovaGeolocation, uiGmapGoogleMapApi, $routeParams, $location, $translate) {
	  	GoHereApp.snapper.close();
		if($rootScope.currentUser == '' || $rootScope.currentUser == undefined){
			localStorage.SetRedirect = '/saved-routes';
			$location.path("/login");
		}
		$(".menu-item").removeClass('menu-item-active');  
		$("#active-routes").addClass('menu-item-active');  
		$(".custom-header").css("display","block");  
		$("#status").fadeIn(); // will first fade out the loading animation
		$("#preloader").fadeIn("fast");
		$rootScope.PageName = 'ROUTES';
		var html = '<div class="decoration"></div>';
		$http.get(globalUrl+"/routes/index/"+$rootScope.currentUser+".json").then(function(response) {
			if(response.data.response.length>0){
				$.each(response.data.response,function(i,val){
					html = html + '<div class="row"><div class="col-xs-6 route-title" style="text-transform: capitalize">'+val.Route.name+'</div><div class="col-xs-3 route-controls">' +
						'<a class="btn btn-small btn-default" href="https://www.google.ca/maps/dir/'+val.Route.source+'/'+val.Route.distination+'">Google Directions</a></div><div class="col-xs-3 route-controls">' +
						'<a class="btn btn-small btn-default" href="#/map/'+val.Route.source+'/'+val.Route.distination+'">Washrooms on this Route</a></div></div><div class="decoration"></div>';
					//html = html + '<a href="#/detail/'+val.Favourite.washroom_id+'" class="user-list-item2"><div class"row"><div class="col-xs-12"><strong>'+val.Washroom.name+'<br/></strong><em>'+val.Washroom.address+'</em></div></div></a><div class="decoration"></div>';
				});
			} else {
				html = html + '<div class="row"><div class="col-xs-12">You don\'t have any saved routes</div><div class="decoration"></div>';
			}
			$('.mapinfo').html(html);
			$("#status").fadeOut(); // will first fade out the loading animation
			$("#preloader").fadeOut("fast");
		});
  }]);  
  
  GoHereApp.controller('accessController', ['$scope', '$rootScope', '$http', '$sce', '$cordovaGeolocation',  'uiGmapGoogleMapApi', '$routeParams', '$location', '$translate', function($scope,$rootScope, $http,$sce, $cordovaGeolocation, uiGmapGoogleMapApi, $routeParams, $location, $translate) {
  	GoHereApp.snapper.close();
	if($rootScope.currentUser == '' || $rootScope.currentUser == undefined){
		
		localStorage.SetRedirect = '/my-access-card';
		$location.path("/login");
	}
	$(".menu-item").removeClass('menu-item-active');  
	$("#active-location").addClass('menu-item-active'); 
	$(".custom-header").css("display","block");  
	$rootScope.PageName = 'MY_ACCESS_CARD';
	align_cover_elements(); 
	$http.get(globalUrl+"/users/access_card/"+$rootScope.currentUser+".json").then(function(response) {
		$scope.UserName = response.data.response.User.username;
	});
  }]);	
  GoHereApp.directive('menu', function () {
    return {
        restrict: 'A', //This menas that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
        replace: true,
		scope: {
			currentUser: '='
        },
        templateUrl: "menu.html",
		controller: ['$scope', '$rootScope', '$filter', function ($scope, $rootScope, $filter) {
			GoHereApp.snapper = new Snap({
				element: document.getElementById('content'),
				elementMirror: document.getElementById('header-fixed'),
				elementMirror2: document.getElementById('footer-fixed'),
				disable: 'left',
				tapToClose: true,
				touchToDrag: true,
				maxPosition: 266,
				minPosition: -266
			});  
			
			if(localStorage.currentUser!=undefined){
				$rootScope.currentUser = localStorage.currentUser;
				$("#active-login").addClass("hide");
				$("#active-logout").removeClass("hide");
			} else {
				$rootScope.currentUser = '';	
				$("#active-logout").addClass("hide");
				$("#active-login").removeClass("hide");
			}
			
			$(document).on("click",'.close-sidebar', function() {GoHereApp.snapper.close();});
			$(document).on("click",'.open-right-sidebar', function() {
				//$(this).toggleClass('remove-sidebar');
				if( GoHereApp.snapper.state().state=="right" ){
					GoHereApp.snapper.close();
				} else {
					GoHereApp.snapper.open('right');
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
			$scope.backToPages = function() {
				window.history.back();
			};
        }]
    }
  });
function onSuccess(position) {
  // your callback here 
}
function onError(error) { 
 /*var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
 if(deviceType!="Android"){
 	alert("Geolocation errors");	
	window.location.href = "#/404";
 } else {
	alert("Geolocation error");	
 }*/
}
$(function(){
  document.addEventListener("deviceready", onDeviceReady, false);
})  
function onDeviceReady() {
  navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 10000 });     
}
$(document).on('click', 'a[href^=http], a[href^=https]', function(e){
	e.preventDefault();
	var $this = $(this); 
	var target = $this.data('inAppBrowser') || '_blank';

	window.open($this.attr('href'), target, 'location=no');
});
function align_cover_elements(){
		var cover_width = $(window).width();
        var cover_height = $(window).height() + 60;
        //var cover_vertical = -($('.cover-center').height())/2;
        //var cover_horizontal = -($('.cover-center').width())/2;
        var cover_vertical = -253;
		var cover_horizontal = -150;
		
        $('.cover-screen').css('width', cover_width);
        $('.cover-screen').css('height', cover_height);
        $('.cover-screen .overlay').css('width', cover_width);
        $('.cover-screen .overlay').css('height', cover_height);
        
        $('.cover-center').css('margin-left', cover_horizontal);      
        $('.cover-center').css('margin-top', cover_vertical + 30);     
        $('.cover-left').css('margin-top', cover_vertical);   
        $('.cover-right').css('margin-top', cover_vertical);           
    };

