var whatMobile = angular.module("what-mobile", []);

whatMobile.config(function($routeProvider, $locationProvider){
	$routeProvider
		.when("/", {templateUrl: "templates/login.html", controller: "LoginCtrl"})
		.when("/index", {templateUrl: "templates/home.html", controller: "IndexCtrl"})
		.otherwise({redirectTo: "/"});
});

whatMobile.controller("IndexCtrl", function ($scope, $location, User, WhatAPI, NavBar){
	$scope.announcements = [];
	NavBar.active = "index";

	//Make sure logged in
	if (!User.loggedIn){
		console.log("You aren't logged in!");
		$location.path("/");
	}

	$scope.user = User.response;
	$scope.logout = function (){
		User.logout(function (){
			$location.path("/");
			$scope.$apply();
		});
	};

	//What to do about escaping html encoded characters? such as &#39; for ' 
	$scope.showAnnouncements = function (){
		WhatAPI.announcements({}, function (data){
			console.log(data);
			$scope.announcements = data.response.announcements;
		});
	}

	//Forward set/get functions for NavBar service
	$scope.getNavClass = NavBar.getClass;
	$scope.setActive = NavBar.setActive;
})

whatMobile.controller("LoginCtrl", function ($scope, $location, User){
	$scope.login = function (username, password){
		User.login(username, password, function(){
			console.log('redirect to index!');
			$location.path("/index");
			//We must force a scope update b/c when changing stuff from
			//external lib (jQuery) sometimes Angular won't notice
			$scope.$apply();
		},
		function (){
			alert("failed to login");
		});
	}
})

whatMobile.directive("navbar", function (){
	return {
		restrict: "E",
		replace: true,
		templateUrl: "templates/navbar.html"
	};
})