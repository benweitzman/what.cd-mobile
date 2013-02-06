var whatMobile = angular.module("what-mobile", []);

whatMobile.config(function($routeProvider, $locationProvider){
	$routeProvider
		.when("/", {templateUrl: "templates/login.html", controller: "LoginCtrl"})
		.when("/index", {templateUrl: "templates/home.html", controller: "IndexCtrl"})
		.when("/forums", {templateUrl: "templates/forumindex.html", controller: "ForumIndexCtrl"})
		.when("/forums/:forumid/:page", {templateUrl: "templates/forum.html", controller: "ForumCtrl"})
		.otherwise({redirectTo: "/404", templateUrl: "templates/404.html"});
});

//This controller manages the index view, ie. the homepage. Shows announcements, notifications
//blog, etc
whatMobile.controller("IndexCtrl", function ($scope, $location, User, WhatAPI, NavBar){
	//Redirect to index if not logged in 
	//This redirect doesn't seem to happen instantly, if you go directly to index
	//without logging in the index will still get logged
	if (!User.loggedIn)
		$location.path("/");

	//Setup navbar
	NavBar.active = "index";
	//Forward set/get functions for NavBar service
	$scope.getNavClass = NavBar.getClass;
	$scope.setActive = NavBar.setActive;

	$scope.announcements = [];
	$scope.user = User.response;
	
	//Load up announcements
	//What to do about escaping html encoded characters? such as &#39; for ' 
	WhatAPI.announcements({}, function (data){
		console.log(data);
		$scope.announcements = data.response.announcements;
	});

	$scope.logout = function (){
		User.logout(function (){
			$location.path("/");
			$scope.$apply();
		});
	};	
})

//This controller manages the forum index view
whatMobile.controller("ForumIndexCtrl", function ($scope, $location, User, WhatAPI, NavBar){
	//Redirect to index if not logged in 
	if (!User.loggedIn)
		$location.path("/");

	//Setup navbar
	NavBar.active = "forums";
	//Forward set/get functions for NavBar service
	$scope.getNavClass = NavBar.getClass;
	$scope.setActive = NavBar.setActive;
	$scope.categories = [];

	WhatAPI.forum({type: "main"}, function (data){
		console.log(data);
		$scope.categories = data.response.categories;
	});
})

//Manages viewing a specific forum
whatMobile.controller("ForumCtrl", function ($scope, $location, $routeParams, User, WhatAPI, NavBar){
	//Redirect to index if not logged in 
	if (!User.loggedIn)
		$location.path("/");

	NavBar.active = "forums";
	//Forward set/get functions for NavBar service
	$scope.getNavClass = NavBar.getClass;
	$scope.setActive = NavBar.setActive;
	$scope.forum = {};

	WhatAPI.forum({type: "viewforum", forumid: $routeParams.forumid, page: $routeParams.page},
		function (data){
			console.log(data);
			$scope.forum = data.response;
		}
	)
})

//Manages logging in to the site
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
