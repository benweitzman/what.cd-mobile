var App = Ember.Application.create();

App.User = Ember.Object.extend({
	username:null
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

App.NavigationController = Ember.Controller.extend({
	selected:null
});

App.NewsPost = Ember.Object.extend({
	title:null,
	body:null
});

App.NewsController = Ember.ArrayController.create({
	content:[],

	createPost:function (newsItem) {
		var post = App.NewsPost.create({ title:newsItem.title, body:newsItem.body });
		this.pushObject(post);
	},

	clearPosts:function () {
		this.set('content', []);
	}
});

App.Alert = Ember.Object.extend({
	title:null
});

App.AlertsController = Ember.ArrayController.create({
	content:[],

	createAlert:function (title) {
		var alert = App.Alert.create({ title:title});
		this.pushObject(alert);
	},

	clearAlerts:function () {
		this.set('content', []);
	}
});

App.BlogPost = Ember.Object.extend({
	title:null,
	body:null
});

App.BlogController = Ember.ArrayController.create({
	content:[],

	createPost:function (blogItem) {
		var post = App.NewsPost.create({ title:blogItem.title, body:blogItem.body });
		this.pushObject(post);
	},

	clearPosts:function () {
		this.set('content', []);
	}
});

App.Subscriptions = Ember.Object.extend({
	thread:null
});

App.SubscriptionsController = Ember.ArrayController.create({
	content:[],

	add:function (item) {
		var i = App.Subscriptions.create({ thread:item });
		this.pushObject(i);
	},

	clear:function () {
		this.set('content', []);
	}
});


App.ApplicationView = Ember.View.extend({
	templateName:'application'
});
App.NavbarView = Ember.View.extend({
	templateName:'navbar',
	NavItemView:Ember.View.extend({
		tagName:'li',
		classNameBindings:'isActive:active'.w(),
		isActive:function () {
			return this.get('item') === App.NavigationController.selected;
		}.property('item').cacheable()
	})
});
App.IndexView = Ember.View.extend({
	templateName:'index'
});
App.LoginFormView = Ember.View.extend({
	templateName:'login-form'
});

App.AlertsView = Ember.View.extend({
	templateName:'alerts'
});

App.ForumsView = Ember.View.extend({
	templateName: 'forums'
});

App.SubscriptionsView = Ember.View.extend({
	templateName: 'subscriptions'
});

App.Router = Ember.Router.extend({
	root:Ember.Route.extend({
		index:Ember.Route.extend({
			route:'/',
			connectOutlets:function (router) {
				wcd.testLogin(function (isAuthed, data) {
					App.ApplicationController.loggedIn = isAuthed;
					if (isAuthed) {
						App.NavigationController.selected = 'index';
						App.ApplicationController.user = App.User.create({username:data.response.username});
						App.ApplicationController.authkey = data.response.authkey;
						wcd.index({}, function (data) {
							//TODO add links to relavent pages
							//TODO this needs caching
							App.AlertsController.clearAlerts();
							if (data.response.notifications.messages > 0) {
								var word = data.response.notifications.messages > 1 ? "messages" : "message";
								App.AlertsController.createAlert("<a href=''>" + data.response.notifications.messages + " new " + word + "</a>");
							}
							if (data.response.notifications.notifications > 0) {
								var word = data.response.notifications.notifications > 1 ? "notifications" : "notification";
								App.AlertsController.createAlert("<a href=''>" + data.response.notifications.notifications + " new " + word + "</a>");
							}
						});
						wcd.announcements({}, function (data) {
							App.NewsController.clearPosts();
							data.response.announcements.reverse().forEach(function (item) {
								App.NewsController.createPost(item);
							});
							App.BlogController.clearPosts();
							data.response.blogPosts.reverse().forEach(function (item) {
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
		logout:Ember.Route.extend({
			route:'/logout',
			connectOutlets:function (router) {
				wcd.logout(App.ApplicationController.authkey, function () {
					router.transitionTo('root.index');
				});
			}
		}),
		subscriptions:Ember.Route.extend({
			route:'/subscriptions',
			connectOutlets:function (router) {
				wcd.subscriptions({}, function (data) {
					App.SubscriptionsController.clear();
					data.response.threads.reverse().forEach(function (item) {
						App.SubscriptionsController.add(item);
					});
				});

				App.NavigationController.selected = 'subscriptions';
				router.transitionTo('subscriptions');
				router.get('applicationController').connectOutlet('subscriptions');
			}
		})
	})
});

App.initialize();

$('#login-form').live('submit', function (e) {
	var username = $('#login-username').val();
	var password = $('#login-password').val();
	wcd.loginUser(username, password, function () {
		wcd.testLogin(function (isAuthed, data) {
			App.ApplicationController.loggedIn = isAuthed;
			App.ApplicationController.user = App.User.create({username:data.response.username});
			if (isAuthed) {
				App.get('router').transitionTo('root.index');
			} else {
				// do something to show invalid login and maybe number of attempts left
			}
		});
	});
	return false;
});
