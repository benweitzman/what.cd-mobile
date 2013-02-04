var whatMobile = angular.module("what-mobile", []);

whatMobile.config(function($routeProvider, $locationProvider){
	$routeProvider
		.when("/", {templateUrl: "templates/login.html", controller: "LoginCtrl"})
		.when("/index", {templateUrl: "templates/home.html", controller: "IndexCtrl"})
		.when("/forums", {templateUrl: "templates/forums.html", controller: "ForumCtrl"})
		.otherwise({redirectTo: "/"});
});

whatMobile.controller("IndexCtrl", function ($scope, $location, User, WhatAPI, NavBar){
	$scope.announcements = [];
	$scope.user = User.response;
	NavBar.active = "index";
	//Forward set/get functions for NavBar service
	$scope.getNavClass = NavBar.getClass;
	$scope.setActive = NavBar.setActive;

	//Redirect to index if not logged in
	if (!User.loggedIn)
		$location.path("/");

	else {
		//Load up announcements
		//What to do about escaping html encoded characters? such as &#39; for ' 
		WhatAPI.announcements({}, function (data){
			console.log(data);
			$scope.announcements = data.response.announcements;
		});
	}

	$scope.logout = function (){
		User.logout(function (){
			$location.path("/");
			$scope.$apply();
		});
	};	
})

whatMobile.controller("ForumCtrl", function ($scope, $location, WhatAPI, NavBar){
	NavBar.active = "forums";
	//Forward set/get functions for NavBar service
	$scope.getNavClass = NavBar.getClass;
	$scope.setActive = NavBar.setActive;

	WhatAPI.forum({type: "main"}, function (data){
		console.log(data);
	});
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
