var App = Ember.Application.create();

User = Ember.Object.extend({
  username: null,
});

App.ApplicationController = Ember.Controller.extend({
  loggedIn: false,
  authkey:null,
  user:null
});

App.ApplicationView = Ember.View.extend({
  templateName: 'application',
});
App.NavbarView = Ember.View.extend({
  templateName: 'navbar',
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
        testLogin(function(isAuthed, data) {
          App.ApplicationController.loggedIn = isAuthed;
          if (isAuthed) {
            App.ApplicationController.user = User.create({username:data.response.username});
            App.ApplicationController.authkey = data.response.authkey;
          } else {
            App.ApplicationController.user = null;
          }
          router.get('applicationController').connectOutlet('index');
        });
      }
    }),
    login: Ember.Route.extend({
      route: '/login',
      connectOutlets: function(router) {
        router.get('applicationController').connectOutlet('loginForm');
      }
    }),
    logoout: Ember.Route.extend({
      route: '/logout',
      connectOutlets: function (router) {
        logout(App.ApplicationController.authkey, function () {
          router.transitionTo('root.index');
        });
      }
    })
  })
});

App.initialize();

$('#login-form').live('submit', function(e) {
  var username = $('#login-username').val();
  var password = $('#login-password').val();
  console.log("abc");
  loginUser(username, password, function() {
    testLogin(function(isAuthed, data) {
      App.ApplicationController.loggedIn = isAuthed;
      App.ApplicationController.user = User.create({username:data.response.username});
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
