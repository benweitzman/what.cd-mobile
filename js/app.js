var App = Ember.Application.create();

App.User = Ember.Object.extend({
	username:null,
});

App.Info = Ember.Object.extend({
	messages:null,
	notifications:null,
	subscriptions:null
});

App.ApplicationController = Ember.Controller.extend({
	loggedIn:false,
	authkey:null,
	user:null,
	info:null
});

App.NewsPost = Ember.Object.extend({
	title: null,
	body: null
});

App.NewsController = Ember.ArrayController.create({
	content: [],

	createPost: function(newsItem) {
		var post = App.NewsPost.create({ title: newsItem.title, body: newsItem.body });
		this.pushObject(post);
	},

	clearPosts: function() {
		this.set('content', []);
	},
});

App.BlogPost = Ember.Object.extend({
	title: null,
	body: null
});

App.BlogController = Ember.ArrayController.create({
	content: [],

	createPost: function(blogItem) {
		var post = App.NewsPost.create({ title: blogItem.title, body: blogItem.body });
		this.pushObject(post);
	},

	clearPosts: function() {
		this.set('content', []);
	},
});

App.ApplicationView = Ember.View.extend({
	templateName:'application',
});
App.NavbarView = Ember.View.extend({
	templateName:'navbar',
});
App.IndexView = Ember.View.extend({
	templateName:'index',
});
App.LoginFormView = Ember.View.extend({
	templateName:'login-form'
});
App.AlertsView = Ember.View.extend({
	templateName:'alerts',
});

App.Router = Ember.Router.extend({
	root:Ember.Route.extend({
		index:Ember.Route.extend({
			route:'/',
			connectOutlets:function (router) {
				wcd.testLogin(function (isAuthed, data) {
					App.ApplicationController.loggedIn = isAuthed;
					if (isAuthed) {
						App.ApplicationController.user = App.User.create({username:data.response.username});
						App.ApplicationController.authkey = data.response.authkey;
						wcd.index({}, function (data) {
							App.ApplicationController.info = App.Info.create({messages:data.response.notifications.messages, notifications:data.response.notifications.notifications, subscriptions:data.response.notifications.subscriptions});
						});
						wcd.announcements({}, function (data) {
							App.NewsController.clearPosts();
							data.response.announcements.reverse().forEach(function(item) {
								App.NewsController.createPost(item);
							});
							App.BlogController.clearPosts();
							data.response.blogPosts.reverse().forEach(function(item) {
								App.BlogController.createPost(item);
							});
						});
					} else {
						App.ApplicationController.user = null;
					}
					router.get('applicationController').connectOutlet('index');
				});
			}
		}),
		login:Ember.Route.extend({
			route:'/login',
			connectOutlets:function (router) {
				router.get('applicationController').connectOutlet('loginForm');
			}
		}),
		logoout:Ember.Route.extend({
			route:'/logout',
			connectOutlets:function (router) {
				wcd.logout(App.ApplicationController.authkey, function () {
					router.transitionTo('root.index');
				});
			}
		})
	})
});

App.initialize();

$('#login-form').live('submit', function (e) {
	var username = $('#login-username').val();
	var password = $('#login-password').val();
	console.log("abc");
	wcd.loginUser(username, password, function () {
		wcd.testLogin(function (isAuthed, data) {
			App.ApplicationController.loggedIn = isAuthed;
			App.ApplicationController.user = App.User.create({username:data.response.username});
			if (isAuthed) {
				console.log(data);
				// redirect to index
				App.get('router').transitionTo('root.index');
			} else {
				// do something to show invalid login and maybe number of attempts left
			}
		});
	});
	return false;
});
