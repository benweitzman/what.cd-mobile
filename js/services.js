whatMobile.factory("WhatAPI", function ($http) {
	var wcd = {};
	var methods = ["index", "user", "inbox", "top10", "usersearch",
		"requests", "browse", "bookmarks", "subscriptions", "artist",
		"torrentgroup", "request", "notifications", "rippy",
		"similar_artists", "announcements", "forum"];

	//Perform an API request with action=method, optional parameters
	//and on success pass the data to callback function
	wcd.get = function (method, params, callback, err){
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
				if (typeof err === "function")
					err();
			}
		});
	}

	//Perform an API post request
	wcd.post = function (method, params, callback, err){
		params = params || {};
		$.ajax({
			url: "../" + method + ".php",
			type: "POST",
			data: params,
			success: function (data){
				if (typeof callback === "function")
					callback(data);
			},
			error: function (xhr, opt, thrown){
				console.log("WhatAPI post to - " + method + " ERROR: " + xhr.status + " " + thrown);
				if (typeof err === "function")
					err();
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
			wcd.get(method, params, callback);
		}
	});

	return wcd;
});

whatMobile.factory("User", function ($http, $location, WhatAPI){
	var user = {};
	user.loggedIn = false;
	user.response = null;

	user.login = function (uname, pwd, succ, err){
		WhatAPI.post("login", {username: uname, password: pwd},
			function (data){
				WhatAPI.index({}, function (data){
					if (data.response === undefined){
						if (typeof err === "function")
							err();
						return;
					}
					user.response = data.response;
					user.loggedIn = true;
				});
				if (typeof succ === "function")
					succ();
			},
			function (){
				if (typeof err === "function")
					err();
			});
	}

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

	user.buffer = function (){
		return (user.response.userstats.uploaded - user.response.userstats.downloaded);
	}

	return user;
});

whatMobile.factory("NavBar", function (User){
	var navbar = {};
	navbar.active = "index";

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
