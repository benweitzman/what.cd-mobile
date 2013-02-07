<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>What.CD</title>
	<link href="css/bootstrap.min.css" rel="stylesheet" media="screen">
	<link href="css/bootstrap-responsive.css" rel="stylesheet" media="screen">
</head>

<body ng-app="what-mobile">
	<div class="navbar navbar-fixed-top" ng-controller="NavCtrl" ng-show="nav.showing()">
		<div class="navbar-inner">
			<div class="container">
				<a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</a>
				<a class="brand" href="#/index">What.CD</a>
				<div class="nav-collapse collapse">
					<ul class="nav">
						<li ng-class="nav.getClass('index')"><a href="#/index" ng-click="nav.setActive('index')">
							Home</a></li>
						<li ng-class="nav.getClass('torrents')"><a href="#/torrents" ng-click="nav.setActive('torrents')">
							Torrents</a></li>
						<li ng-class="nav.getClass('forums')" ><a href="#/forums" ng-click="nav.setActive('forums')">
							Forums</a></li>
						<li ng-class="nav.getClass('subscriptions')"><a href="#/subscriptions" ng-click="nav.setActive('subscriptions')">
							Subscriptions</a>
						</li>
						<li ng-class="nav.getClass('inbox')"><a href="#/inbox" ng-click="nav.setActive('inbox')">Inbox
						<span class="badge badge-info" ng-show="user().notifications.messages > 0">
								{{user().notifications.messages}}
						</span>
						</a>
						</li>
					</ul>
					<ul class="nav pull-right">
						<li id="fat-menu" class="dropdown">
							<a href="" id="user_menu" role="button" class="dropdown-toggle" 
								data-toggle="dropdown">
								<!-- It seems we have to use a function or this won't be updated
								properly after logging in. Maybe I'm just doing something wrong? -->
								{{user().username}}
							</a>
							<ul class="dropdown-menu" role="menu">
								<li><a ng-click="logout()">Logout</a></li>
							</ul>
						</li>
					</ul>
				</div><!--/.nav-collapse -->
			</div>
		</div>
	</div>
	
	<div ng-view></div>

	<script type="text/javascript" src="js/libs/jquery.min.js"></script>
	<script type="text/javascript" src="js/libs/angular.min.js"></script>
	<script type="text/javascript" src="js/libs/angular-sanitize.min.js"></script>
	<script type="text/javascript" src="js/libs/bootstrap.min.js"></script>
	<script type="text/javascript" src="js/app.js"></script>
	<script type="text/javascript" src="js/services.js"></script>
	<script type="text/javascript" src="js/directives.js"></script>
</body>
</html>
