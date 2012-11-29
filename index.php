<?
  require '../classes/config.php';
?>
<!doctype html>
<!--[if lt IE 7 ]> <html lang="en" class="ie6"> <![endif]--> <!--[if IE 7 ]>    <html lang="en" class="ie7"> <![endif]--> <!--[if IE 8 ]>    <html lang="en" class="ie8"> <![endif]--> <!--[if IE 9 ]>    <html lang="en" class="ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html lang="en"> <!--<![endif]-->
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

  <title>What.CD</title>
  <meta name="description" content="What.CD Mobile">
  <meta name="author" content="What.CD">

  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <link rel="shortcut icon" href="/favicon.ico">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link href="css/bootstrap.css" rel="stylesheet" media="screen">
  <link href="css/bootstrap-responsive.css" rel="stylesheet" media="screen">
  <link rel="stylesheet" href="css/style.css?v=2">

  <!--[if lt IE 9]>
  <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
  <![endif]-->
</head>
<body>
  <script type="text/x-handlebars" data-template-name="application">
    {{#if App.ApplicationController.loggedIn}}
    {{/if}}
    <div id="app-container" class="container-fluid">
      {{outlet}}
      <?
        if (constant("DEBUG_MODE")) {
          ob_start();
          exec("git log -1 --pretty=format:'%h'",$result);
          if (isset($result[0])) { $result = $result[0]; } else { $result = ""; }
          ob_clean();
          print '<div class="version">'.$result.'</div>';
        }
      ?>
    </div>
  </script>

  <script type="text/x-handlebars" data-template-name="navbar">
    <div class="navbar navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container-fluid">
          <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </a>
          <a class="brand" href="#/">What.CD</a>
          <div class="nav-collapse collapse">
            <ul class="nav">
              <li class="active"><a href="">Home</a></li>
              <li><a href="">Torrents</a></li>
              <li><a href="">Forums</a></li>
              <li><a href="">Subscriptions</a></li>
              <li><a href="">Inbox</a></li>
            </ul>
            <ul class="nav pull-right">
              <li><a href="">{{App.ApplicationController.user.username}}</a></li>
              <li><a href="#/logout">Logout</a></li>
            </ul>
          </div><!--/.nav-collapse -->
        </div>
      </div>
    </div>
  </script>

  <script type="text/x-handlebars" data-template-name="index">
    {{#if App.ApplicationController.loggedIn}}
      {{view App.NavbarView}}
      <h2>Logged in! Put news and stuff here</h2>
    {{else}}
      <h1>What.CD</h1>
      <a href="#/login">Log In</a>
    {{/if}}
  </script>

  <script type="text/x-handlebars" data-template-name="login-form">
    <h1>Login</h1>
    <form id="login-form">
      <input type="text" name="username" id="login-username" placeholder="username" /><br />
      <input type="password" name="password" id="login-password" placeholder="password" /><br />
      <input class="btn btn-large btn-primary" type="submit" value="Login" />
    </form>
  </script>

  <!-- The missing protocol means that it will match the current protocol, either http or https. If running locally, we use the local jQuery. -->
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
  <script>window.jQuery || document.write('<script src="js/libs/jquery-1.7.2.min.js"><\/script>')</script>
  <script src="js/libs/handlebars-1.0.0.beta.6.js"></script>
  <script src="js/libs/ember-1.0.0-pre.2.min.js"></script>
  <script src="js/libs/bootstrap.min.js"></script>
  <script src="js/whatcd.js"></script>
  <script src="js/app.js"></script>
</body>
</html>