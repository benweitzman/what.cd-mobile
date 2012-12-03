var wcd = wcd || {};

wcd.loginUser = function(username, password, success, error) {
	// success(); return false; // debug without live gazelle

	$.ajax({
		url:'../login.php',
		type:'POST',
		data:{
			username:$('#login-username').val(),
			password:$('#login-password').val(),
		},
		success:function (data) {
			if (typeof success === 'function') {
				success(data);
			}
		},
		error:function (xhr, status) {
			if (typeof error === 'function') {
				error();
			}
		},
	});
	return false;
}

wcd.testLogin = function(callback) {
	// callback is called with true for logged in
	// or false for not
	$.ajax({
		url:'../ajax.php',
		type:'GET',
		dataType:'json',
		data:{
			action:'index',
		},
		success:function (data) {
			console.log(data);
			console.log('logged in');
			if (typeof callback === 'function') {
				callback(true, data);
			}
		},
		error:function (xhr, status) {
			console.log('not logged in');
			if (typeof callback === 'function') {
				callback(false);
			}
		},
	});
}

wcd.logout = function(authkey, callback) {
	$.ajax({
		url:'../logout.php',
		method:'GET',
		data:{
			auth:authkey,
		},
		success:function (data) {
			callback();
		}
	});
}

// api calls. call wcd.method(params, callback)
// where method is the action=something
// params is any other params to be passed
// callback is the callback to run on success
// you can also call apiRequest(method, params, callback)
// to do the same thing

wcd.apiRequest = function(method, params, callback) {
	params = params || {};
	params.action = method
	$.ajax({
		url: '../ajax.php',
		type: 'GET',
		dataType: 'json',
		data: params,
		async:false,
		success: function (data) {
			if (typeof callback === 'function') {
				callback(data);
			}
		},
	});
}

apiMethods = [
	'index',
	'user',
	'inbox',
	'top10',
	'usersearch',
	'requests',
	'browse',
	'bookmarks',
	'subscriptions',
	'artist',
	'torrentgroup',
	'request',
	'notifications',
	'rippy',
	'similar_artists',
	'announcements',
]

apiMethods.forEach(function(method) {
	console.log('generating method for ' + method);
	wcd[method] = function(params, callback) {
		wcd.apiRequest(method, params, callback);
	};
});
