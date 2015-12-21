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
  'ngCordova',
  'uiGmapgoogle-maps',
  'ngScrollbars',
]);

GoHereApp.value('snapper');

GoHereApp.config(function ($translateProvider, $httpProvider, $cordovaInAppBrowserProvider, uiGmapGoogleMapApiProvider, ScrollBarsProvider) {
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
	LOGOUT			: 'Logout',
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
	LOGOUT			: 'Se déconnecter',
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
	  when('/detail/:id', {
		controller:  'detailController',   
        templateUrl: 'detail.html',
      }).
	   when('/add-location', {
		controller:  'locationController',   
        templateUrl: 'location.html',
      }).
	  when('/logout', {
		controller:  'logoutController',   
        templateUrl: 'login.html',
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
			  dots:false,
			  items:1
		  });
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
  
  
  
  GoHereApp.controller('aboutController', ['$scope', '$rootScope', '$http', '$sce', '$cordovaInAppBrowser', function($scope,$rootScope, $http,$sce,$cordovaInAppBrowser) {
	GoHereApp.snapper.close();
	$(".menu-item").removeClass('menu-item-active');  
	$("#active-about").addClass('menu-item-active');  
	$(".custom-header").css("display","block");  
	$("#status").fadeIn(); // will first fade out the loading animation
	$("#preloader").delay(100).fadeIn("slow");
	$http.get(globalUrl+"/pages/view/2.json").then(function(response) {
		$rootScope.PageName = response.data.response.page.name;
		$scope.PageContent = $sce.trustAsHtml(response.data.response.page.description);
		//$cordovaInAppBrowser.open('http://ngcordova.com', '_blank')
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
  GoHereApp.controller('logoutController', ['$scope', '$rootScope', '$location', '$http', '$sce', '$cordovaOauth', '$cordovaInAppBrowser', function($scope,$rootScope, $location, $http,$sce, $cordovaOauth, $cordovaInAppBrowser) {
	  	localStorage.removeItem('currentUser');
		$rootScope.currentUser = '';
		$location.path("/login");
		$("#active-logout").addClass("hide");
		$("#active-login").removeClass("hide");
  }]);
  GoHereApp.controller('loginController', ['$scope', '$rootScope', '$location', '$http', '$sce', '$cordovaOauth', '$cordovaInAppBrowser', function($scope,$rootScope, $location, $http,$sce, $cordovaOauth, $cordovaInAppBrowser) {
	GoHereApp.snapper.close();
	$(".menu-item").removeClass('menu-item-active');  
	$("#active-login").addClass('menu-item-active');  
	$(".custom-header").css("display","block");  
	$rootScope.PageName = "Login";
	align_cover_elements(); 
	$scope.facebookLogin = function(){
		$cordovaInAppBrowser.open('#/fblogin', '_blank').then(function(event) {
			
		  })
		  .catch(function(event) {
			// error
		  });
	
	};
	$scope.checkLogin = function(){
		if ($scope.userForm.$valid) {
			$("#status").fadeIn(); // will first fade out the loading animation
			$("#preloader").delay(100).fadeIn("slow");
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
							$location.path(paths);
							
						} else {
							$location.path("/map");
						}
					} else {
						$(".alert-danger").removeClass("hide");
						$(".alert-danger").html('<span class="fa fa-user" aria-hidden="true"></span><span class="sr-only">Error:</span> Invalid email or password.');
						$("#status").fadeOut(); // will first fade out the loading animation
						$("#preloader").delay(100).fadeOut("slow");
					}
				}
			);
		} else {
			$(".alert-danger").removeClass("hide");
			$(".alert-danger").html('<span class="fa fa-user" aria-hidden="true"></span><span class="sr-only">Error:</span> All fields are required.');
		}
	}
  }]);
  
  
  GoHereApp.controller('signupController', ['$scope', '$rootScope', '$http', '$sce', '$cordovaOauth', '$cordovaInAppBrowser', function($scope,$rootScope, $http,$sce, $cordovaOauth, $cordovaInAppBrowser) {
	GoHereApp.snapper.close();
	$(".menu-item").removeClass('menu-item-active');  
	$("#active-login").addClass('menu-item-active');  
	$(".custom-header").css("display","block");  
	$rootScope.PageName = "Signup";
	align_cover_elements();
	$scope.checkRegister = function(){
		if ($scope.userForm.$valid) {
			$("#status").fadeIn(); // will first fade out the loading animation
			$("#preloader").delay(100).fadeIn("slow");
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
					} else {
						$(".alert-danger").removeClass("hide");
						$(".alert-danger").html('<span class="fa fa-user" aria-hidden="true"></span><span class="sr-only">Error:</span> User already registered.');
						$("#status").fadeOut(); // will first fade out the loading animation
						$("#preloader").delay(100).fadeOut("slow");
					}
					
				}
			);
		} else {
			
		}
	}
  }]);
  
  GoHereApp.controller('mapController', ['$scope', '$rootScope', '$http', '$sce', '$cordovaGeolocation',  'uiGmapGoogleMapApi', 'uiGmapIsReady', function($scope,$rootScope, $http,$sce, $cordovaGeolocation, uiGmapGoogleMapApi,uiGmapIsReady) {
	GoHereApp.snapper.close();
	$(".menu-item").removeClass('menu-item-active');  
	$("#active-map").addClass('menu-item-active');  
	$(".custom-header").css("display","block");  
	$("#status").fadeIn(); // will first fade out the loading animation
	$("#preloader").delay(100).fadeIn("slow");
	$rootScope.PageName = "Find a Washroom";
	var posOptions = {timeout: 10000, enableHighAccuracy: true};
	var html ='';
	$(document).ready(function(){
		uiGmapGoogleMapApi.then(function(maps) {
			$cordovaGeolocation.getCurrentPosition(posOptions)
			.then(function (position) {
				var lat  = position.coords.latitude;
				var long = position.coords.longitude;
				$scope.map = { center: { latitude: lat, longitude: long }, markers:[], zoom: 12 };
				uiGmapIsReady.promise(1).then(function(instances) {
					var request = $http({
						method: "post",
						url: globalUrl+"/washrooms/index_distance.json",
						data: {
							lat		: lat,
							long	: long,
							records	: 0,
						}
					});
					request.success(
						function( data ) {
							var marker = {
								id: 'home',
								icon: 'images/map-pin-active.png',
								coords: {
									latitude	: lat,
									longitude	: long
								}
							};
							$scope.map.markers.push(marker);
							
							$.each(data.response,function(i,val){
								var marker = {
									id: val.Washroom.id,
									icon: 'images/map-pin_.png',
									coords: {
										latitude	: val.Washroom.lat,
										longitude	: val.Washroom.log
									}
								};
								$scope.map.markers.push(marker);
								var distances = parseFloat(val.Washroom.distance);
								html = html + '<div class="decoration"></div><a href="#/detail/'+val.Washroom.id+'" class="user-list-item2"><div class"row"><div class="col-xs-8"><strong>'+val.Washroom.name+'<br/></strong><em>'+val.Washroom.address+'</em></div><div class="col-xs-4 vcenter">'+distances.toFixed(2)+'KM <i class="fa fa-chevron-right"></i></div></div></a>';
							});
							$('.mapinfo').html(html);
							$scope.scrollbarConfig = {
								theme: 'dark',
								scrollInertia: 500
							}
							$("#status").fadeOut(); // will first fade out the loading animation
							$("#preloader").delay(100).fadeOut("slow"); 
						}
					);
				});
			}, function(err) {
				var lat  = 43.6888092;
				var long = -79.393413;
				$scope.map = { center: { latitude: lat, longitude: long }, markers:[], zoom: 12 };
				
				var request = $http({
					method: "post",
					url: globalUrl+"/washrooms/index_distance.json",
					data: {
						lat	: lat,
						long: long,
					}
				});
				request.success(
					function( data ) {
						$.each(data.response,function(i,val){
							var marker = {
								id: val.Washroom.id,
								icon: 'images/map-pin_.png',
								coords: {
									latitude	: val.Washroom.lat,
									longitude	: val.Washroom.log
								}
							};
							$scope.map.markers.push(marker);
						})
						$("#status").fadeOut(); // will first fade out the loading animation
						$("#preloader").delay(100).fadeOut("slow"); 
					}
				);
			});
    	});
	});

  }]);
  GoHereApp.controller('detailController', ['$scope', '$rootScope', '$http', '$sce', '$cordovaGeolocation',  'uiGmapGoogleMapApi', '$routeParams',function($scope,$rootScope, $http,$sce, $cordovaGeolocation, uiGmapGoogleMapApi, $routeParams) {
	  	GoHereApp.snapper.close();
		$(".menu-item").removeClass('menu-item-active');  
		$(".custom-header").css("display","block");  
		$("#status").fadeIn(); // will first fade out the loading animation
		$("#preloader").delay(100).fadeIn("slow");
		$rootScope.PageName = "Washroom Detail";
		$http.get(globalUrl+"/washrooms/view/"+$routeParams.id+".json").then(function(response) {
			var collectComment = '';
			var requester = $http({
				method: "post",
				url: globalUrl+"/comments/index/"+$routeParams.id+".json",
			});
			requester.success(
				function( result ) {
					if(result.response.length == 0){
						collectComment = '<div class="static-notification bg-red-dark tap-dismiss"><p><i class="fa fa-times"></i>No Comments has been posted.</p></div> ';
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
			
			var addresstext = response.data.response.Washroom.address;
			addresstext = addresstext.replace(",", ", ");
			$scope.WashroomAddress 	= $sce.trustAsHtml(addresstext);
			$scope.WashroomDesc 	= $sce.trustAsHtml(response.data.response.Washroom.description);
			if($.trim(response.data.response.Washroom.from)==""){
				var FromTime = "9:00 AM";
			} else {
				var FromTime = response.data.response.Washroom.from;
			}
			if($.trim(response.data.response.Washroom.to)==""){
				var ToTime = "6:00 PM";
			} else {
				var ToTime = response.data.response.Washroom.to;
			}
			$scope.WashroomTiming 	= $sce.trustAsHtml(FromTime+" To "+ToTime);
			if($rootScope.currentUser == '' || $rootScope.currentUser == undefined){
				$(".pleaselogin").removeClass("hide");
				$(".pleasecomment").addClass("hide");
			} else {
				$(".pleaselogin").addClass("hide");
				$(".pleasecomment").removeClass("hide");
			}
			$(".commentsuccess").addClass("hide");
			
			$('.tap-dismiss').click(function(){
			   $(this).slideUp(200); 
				return false;
			});
			$("#status").fadeOut(); // will first fade out the loading animation
			$("#preloader").delay(100).fadeOut("slow");
		});
		$scope.setComment = function(){
			if ($scope.userForm.$valid) {
				var request = $http({
					method: "post",
					url: globalUrl+"/comments/add.json",
					data: {
						user_id		: $rootScope.currentUser,
						washroom_id	: $routeParams.id,
						name		: $scope.Comment
					}
				});
				request.success(
					function( result ) {
						if(result.response.status == true){
							$scope.Comment = "";
							$(".commentsuccess").removeClass("hide");
							var collectComment = '';
							var requester = $http({
								method: "post",
								url: globalUrl+"/comments/index/"+$routeParams.id+".json",
							});
							requester.success(
								function( result ) {
									if(result.response.length == 0){
										collectComment = '<div class="static-notification bg-red-dark tap-dismiss"><p><i class="fa fa-times"></i>No Comments has been posted.</p></div> ';
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
			}
		};
  }]);	  
  GoHereApp.controller('locationController', ['$scope', '$rootScope', '$http', '$sce', '$cordovaGeolocation',  'uiGmapGoogleMapApi', '$routeParams', '$location', function($scope,$rootScope, $http,$sce, $cordovaGeolocation, uiGmapGoogleMapApi, $routeParams, $location) {
  	GoHereApp.snapper.close();
	if($rootScope.currentUser == '' || $rootScope.currentUser == undefined){
		
		localStorage.SetRedirect = '/add-location';
		$location.path("/login");
	}
	$(".menu-item").removeClass('menu-item-active');  
	$("#active-location").addClass('menu-item-active'); 
	$(".custom-header").css("display","block");  
	$rootScope.PageName = "Add a Location";
	$("#Cleanness").rating();
	$("#EaseAccess").rating();
	$("#AvailableHours").rating();
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
		$("#status").fadeIn(); // will first fade out the loading animation
		$("#preloader").delay(100).fadeIn("slow");
		//if ($scope.userForm.$valid) {
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
					
					$("#status").fadeOut(); // will first fade out the loading animation
					$("#preloader").delay(100).fadeOut("slow"); 
				}
			);	
		//}
	}
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
				disable: 'right',
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
$(function(){
  document.addEventListener("deviceready", onDeviceReady, false);
})  
function onDeviceReady() {
  navigator.geolocation.getCurrentPosition(onSuccess, onError);     
}
function onSuccess(position) {
  // your callback here 
}

function onError(error) { 
  // your callback here
}
function align_cover_elements(){
		var cover_width = $(window).width();
        var cover_height = $(window).height() + 60;
        var cover_vertical = -($('.cover-center').height())/2;
        var cover_horizontal = -($('.cover-center').width())/2;
        
        $('.cover-screen').css('width', cover_width);
        $('.cover-screen').css('height', cover_height);
        $('.cover-screen .overlay').css('width', cover_width);
        $('.cover-screen .overlay').css('height', cover_height);
        
        $('.cover-center').css('margin-left', cover_horizontal);      
        $('.cover-center').css('margin-top', cover_vertical + 30);     
        $('.cover-left').css('margin-top', cover_vertical);   
        $('.cover-right').css('margin-top', cover_vertical);           
    };