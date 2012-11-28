var App = Ember.Application.create();

App.ApplicationController = Ember.Controller.extend();
App.ApplicationView = Ember.View.extend({
  templateName: 'application'
});
App.IndexView = Ember.View.extend({
  templateName: 'index'
});
App.LoginFormView = Ember.View.extend({
  templateName: 'login-form'
});

App.Router = Ember.Router.extend({
  root: Ember.Route.extend({
    index: Ember.Route.extend({
      route: '/',
      connectOutlets: function(router) {
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
})

App.initialize();
