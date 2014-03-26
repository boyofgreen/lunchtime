'use strict';
var timeUntilLunch = 0;

var requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.webkitRequestAnimationFrame;


var timeLoop = function() {
	updateModel('timer', function(scope) {
		var now = new Date();

		var secondsPassed = 0;
		var noon = 12 * 3600;

		secondsPassed += ( now.getHours() * 3600 );
		secondsPassed += ( now.getMinutes() * 60 );
		secondsPassed += now.getSeconds();

		var checkTime = noon - secondsPassed;
		if(checkTime < 0) {
			scope.timeUntilLunch = false;
			scope.timeAfterLunch = secondsPassed - noon;
		} else {
			scope.timeUntilLunch = noon - secondsPassed;		
		}
	
		requestAnimationFrame(timeLoop);
	})
}


function updateModel(element_id, callback) {
	var sc = angular.element(document.getElementById(element_id)).scope();
    
	if(sc){
	    sc.$apply(function(sc){
	        callback(sc);
	    });
    }
}

/* Controllers */

/*
 *	This controller provides data and functionality for the application view (index.jade)
 */
function lunchtimeController($scope, socket) {
  
  	// Get the User Location in order to check for lunchtime resturants nearby
	function getUserLocation() {
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(updateUserLocation);
		} else {
			// GeoLocation is not supported
			console.log('No GeoLocation');
		}
	}

	// Callback function to let the Node server know of the user's location
	function updateUserLocation(position) {
		socket.emit('send:userLocation', {latitude : position.coords.latitude, longitude : position.coords.longitude});
	}	

	// Invoke the getUserLocation function
	getUserLocation();

	// Check for the Server sending the users name
	socket.on('send:name', function (data) {
		$scope.name = data.name;
	});
}

/*
 *	This controller provides data and functionality for the restaurants view (restaurants.jade)
 */
function restaurantsController($scope, socket) {
	
	// When userLocation message is recieved from the node server add to the $scope
	socket.on('send:userLocation', function (data) {
		$scope.userLocation = data;
	});

	// When restaurant data is recieved from the node server add to the $scope
	socket.on('send:getRestaurants', function (data) {
		$scope.restaurants = data.restaurants;
	});

	// When user preference data is recieved from the node server add to the $scope
	socket.on('send:userPreferences', function (data) {
		$scope.userPreferences = data.userPreferences;
	});

	// socket.on('send:timeUntilLunch', function (data) {
	// 	$scope.startTimer(data.timeUntilLunch);
	// });

	requestAnimationFrame(timeLoop);


	// Helper function to calculate the appoximate distance from an origin location to a destination
	$scope.getDistance = function (originLocation, destinationLocation, units) {
		if(!originLocation) {
			return NaN;
		}
		var R;
		if(units === 'mi'){
			R = 3959 	// miles
		} else {
			R = 6371; 	// kilometers (default)
		}
		var dLat = (destinationLocation.latitude - originLocation.latitude).toRad();
		var dLon = (destinationLocation.longitude - originLocation.longitude).toRad();
		var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
				Math.cos(originLocation.latitude.toRad()) * Math.cos(destinationLocation.latitude.toRad()) *
				Math.sin(dLon/2) * Math.sin(dLon/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		var d = R * c;

		return d;
	}


	// $scope.restaurantFormSubmit = function(){
	// 	//Process user selection
	// 	var form = document.restaurantForm;
	// }

	// Helper function to calculate the distance from the user to a restaurant
	$scope.userDistance = function(rest) {
		return $scope.getDistance($scope.userLocation, rest.location);
	}

	// Helper function to find preffered restaurants
	$scope.isPreferred = function(rest, userPreferences) {
		if(!userPreferences) {
			return false;
		}
		for(var i = 0; i < userPreferences.length; i++){
			if(userPreferences[i].id === rest.id) {
				return true;
			}
		}
		return false;
	}
}