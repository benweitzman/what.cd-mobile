var whatMobile = angular.module("what-mobile", ["ngSanitize"]);

whatMobile.config(function($routeProvider, $locationProvider){
	$routeProvider
		.when("/", {templateUrl: "templates/login.html", controller: "LoginCtrl"})
		.when("/index", {templateUrl: "templates/home.html", controller: "IndexCtrl"})
		.when("/forums", {templateUrl: "templates/forumindex.html", controller: "ForumIndexCtrl"})
		.when("/forums/:forumid/:page", {templateUrl: "templates/forum.html", controller: "ForumCtrl"})
		.when("/thread/:threadid", {templateUrl: "templates/thread.html", controller: "ThreadCtrl"})
		.when("/inbox", {templateUrl: "templates/inbox.html", controller: "InboxCtrl"})
		.otherwise({redirectTo: "/404", templateUrl: "templates/404.html"});
});

//This controller manages the index view, ie. the homepage. Shows announcements, notifications
//blog, etc
whatMobile.controller("IndexCtrl", function ($scope, $location, User, WhatAPI, NavBar){
	//Redirect to index if not logged in 
	if (!User.loggedIn){
		$location.path("/");
		return;
	}

	//Setup navbar
	NavBar.active = "index";
	//Forward set/get functions for NavBar service
	$scope.getNavClass = NavBar.getClass;
	$scope.setActive = NavBar.setActive;
	$scope.announcements = [];
	$scope.user = User.response;

	//Load up announcements
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
	if (!User.loggedIn){
		$location.path("/");
		return;
	}

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
	if (!User.loggedIn){
		$location.path("/");
		return;
	}

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

	//Testing post api
	$scope.createThread = function (title, body){
		WhatAPI.apiPost("forums.php", {
			action: "new",
			auth: User.response.authkey,
			forum: $routeParams.forumid,
			title: title,
			body: body
		},
		function (data){
			console.log(data);
		});
	}
})

//Manages viewing a thread
whatMobile.controller("ThreadCtrl", function ($scope, $location, $routeParams, User, WhatAPI, NavBar){
	//Redirect to index if not logged in 
	if (!User.loggedIn){
		$location.path("/");
		return;
	}

	NavBar.active = "forums";
	//Forward set/get functions for NavBar service
	$scope.getNavClass = NavBar.getClass;
	$scope.setActive = NavBar.setActive;
	$scope.thread = {};

	WhatAPI.forum({type: "viewthread", threadid: $routeParams.threadid}, function (data){
		console.log(data);
		$scope.thread = data.response;
	})
})

//Controls user inbox
whatMobile.controller("InboxCtrl", function ($scope, $location, User, WhatAPI, NavBar){
	//Redirect to index if not logged in 
	if (!User.loggedIn){
		$location.path("/");
		return;
	}

	NavBar.active = "inbox";
	//Forward set/get functions for NavBar service
	$scope.getNavClass = NavBar.getClass;
	$scope.setActive = NavBar.setActive;
	$scope.inbox = {};

	WhatAPI.inbox({}, function (data){
		console.log(data);
		$scope.inbox = data.response;
	})

	//I'm not sure if this actually works? It should also be on a user's page
	//but I'm not sure how to add users to my test gazelle since i don't have any email
	//sending abilities from my server
	$scope.sendPM = function (subject, body){
		WhatAPI.apiPost("inbox.php", {
			action: "takecompose", 
			toid: User.response.id,
			auth: User.response.authkey,
			subject: subject,
			body: body
		}, 
		function (data){
			console.log("message sent?");
		});
	}
})

//Controls the navbar
whatMobile.controller("NavCtrl", function ($scope, $location, User, NavBar){
	$scope.getNavClass = NavBar.getClass;
	$scope.setActive = NavBar.setActive;
	$scope.nav = NavBar;
	$scope.user = User.info;

	$scope.logout = function (){
		User.logout(function (){
			$location.path("/");
			$scope.$apply();
		});
	};
})

//Manages logging in to the site
whatMobile.controller("LoginCtrl", function ($scope, $location, User){
	$scope.login = function (username, password){
		if (username === undefined || username.length === 0 
			|| password === undefined || password.length === 0)
		{
			alert("Error: empty username or password");
			return;
		}
		User.login(username, password, function(){
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
