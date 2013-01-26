whatMobile.factory("WhatAPI", function ($http) {
	var wcd = {};
	var methods = ["index", "user", "inbox", "top10", "usersearch",
		"requests", "browse", "bookmarks", "subscriptions", "artist",
		"torrentgroup", "request", "notifications", "rippy",
		"similar_artists", "announcements"];

	wcd.apiRequest = function (method, params, callback){
		params = params || {};
		params.action = method;
		
		$.ajax({
			url: "../ajax.php",
			type: "GET",
			dataType: "json",
			data: params,
			async: false,
			success: function (data){
				if (typeof callback === "function")
					callback(data);
			}
		});
	}

	methods.forEach(function(method){
		wcd[method] = function (params, callback){
			wcd.apiRequest(method, params, callback);
		}
	});

	return wcd;
});

whatMobile.factory("User", function ($http, WhatAPI){
	var user = {};
	user.loggedIn = false;
	user.response = null;

	//Login the user
	user.login = function (uname, pwd, succ, err){
		$.ajax({
			url: "../login.php",
			type: "POST",
			data: {
				username: uname,
				password: pwd
			},
			success: function (data){
				//It'd be nice if login status failure also included a field
				//saying why it failed (bad username/pass/etc)
				// console.log(data);
				// if (data.status === "failure" && typeof err === "function")
				// 	err(data);
				// else {
					WhatAPI.index({}, function (idx){
						console.log(idx);
						user.response = idx.response;
						user.loggedIn = true;
					});
					if (typeof succ === "function")
						succ();
				//}
			},
			error: function (data){
				if (typeof err === "function")
					err();
			}
		});
	}

	//Logout the user
	user.logout = function (succ){
		$.ajax({
			url: "../logout.php",
			method: "GET",
			data: {
				auth: user.response.authkey
			},
			success: function (data){
				user.loggedIn = false;
				user.response = null;
				succ();
			}
		});
	}

	return user;
});

whatMobile.factory("NavBar", function (){
	var navbar = {};
	navbar.active = "";

	navbar.getClass = function (name){
		if (name === navbar.active)
			return "active";
		return "";
	}

	navbar.setActive = function (name){
		navbar.active = name;
	}

	return navbar;
});
