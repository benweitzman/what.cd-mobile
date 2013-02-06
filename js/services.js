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
				console.log("WhatAPI - " + method + " ERROR: " + xhr + " " + thrown);
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

	//Convert from html encoding to unicode
	wcd.deEncode = function (target){
		target = $("<div/>").html(target).text();
		return target;
	}

	methods.forEach(function(method){
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
