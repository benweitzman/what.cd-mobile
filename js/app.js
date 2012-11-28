var App = Ember.Application.create();

App.ApplicationController = Ember.Controller.extend({
  loggedIn: false
});

App.ApplicationView = Ember.View.extend({
  templateName: 'application'
});
App.IndexView = Ember.View.extend({
  templateName: 'index',
});
App.LoginFormView = Ember.View.extend({
  templateName: 'login-form'
});

App.Router = Ember.Router.extend({
  root: Ember.Route.extend({
    index: Ember.Route.extend({
      route: '/',
      connectOutlets: function(router) {
        testLogin(function(isAuthed) {
          App.ApplicationController.loggedIn = isAuthed;
        });
        router.get('applicationController').connectOutlet('index');
      }
    }),
    login: Ember.Route.extend({
      route: '/login',
      connectOutlets: function(router) {
        router.get('applicationController').connectOutlet('loginForm');
      }
    })
  })
});

App.initialize();

$('#login-form').live('submit', function(e) {
  var username = $('#login-username').val();
  var password = $('#login-password').val();
  loginUser(username, password, function() {
    testLogin();
    // redirect to front page
  });
  return false;
});
