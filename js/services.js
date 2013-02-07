whatMobile.factory("WhatAPI", function ($http) {
	var wcd = {};
	var methods = ["index", "user", "inbox", "top10", "usersearch",
		"requests", "browse", "bookmarks", "subscriptions", "artist",
		"torrentgroup", "request", "notifications", "rippy",
		"similar_artists", "announcements", "forum"];

	//Perform an API request with action=method, optional parameters
	//and on success pass the data to callback function
	wcd.apiRequest = function (method, params, callback){
		params = params || {};
		params.action = method;
		
		$.ajax({
			url: "../ajax.php",
			type: "GET",
			data: params,
			async: false,
			success: function (data){
				if (typeof callback === "function")
					callback(data);
			},
			error: function (xhr, opt, thrown){
				console.log("WhatAPI - " + method + " ERROR: " + xhr.status + " " + thrown);
			}
		});
	}

	//Peform a fake api request, getting the data instead from a json file
	wcd.fakeApi = function (file, callback){
		$.ajax({
			url: file,
			type: "GET",
			async: false,
			success: function (data){
				if (typeof callback === "function")
					callback(data);
			},
			error: function (xhr, opt, thrown){
				console.log("WhatAPI - " + method + " ERROR: " + xhr + " " + thrown);
			}
		});
	}

	methods.forEach(function (method){
		wcd[method] = function (params, callback){
			wcd.apiRequest(method, params, callback);
		}
	});

	return wcd;
});

whatMobile.factory("User", function ($http, $location, WhatAPI){
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
				WhatAPI.index({}, function (idx){
					if (idx.response === undefined){
						if (typeof err === "function")
							err();
						user.loggedIn = false;
						return;
					}
					user.response = idx.response;
					user.loggedIn = true;
				});
				if (typeof succ === "function")
					succ();
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

	user.info = function (){
		return user.response;
	}

	//Calculate user's buffer
	user.buffer = function (){
		return (user.response.userstats.uploaded - user.response.userstats.downloaded);
	}

	return user;
});

whatMobile.factory("NavBar", function (User){
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

	navbar.showing = function (){
		return User.loggedIn;
	}

	return navbar;
});
