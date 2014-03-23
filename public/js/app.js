'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('lunchtime', ['lunchtime.filters', 'lunchtime.services', 'lunchtime.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    // $routeProvider.when('/view1', {templateUrl: 'partials/partial1', controller: MyCtrl1});
    // $routeProvider.when('/view2', {templateUrl: 'partials/partial2', controller: MyCtrl2});
    $routeProvider.when(
    		'/restaurants',
    		{
    			templateUrl:'partials/restaurants',
    			controller:'restaurantsController'
    		}
    	)
    $routeProvider.otherwise({redirectTo: '/restaurants'});
    $locationProvider.html5Mode(true);
  }]);