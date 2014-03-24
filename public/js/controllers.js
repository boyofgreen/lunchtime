'use strict';

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

	function getUserLocalTimeZone () {
		console.log(jstz.determine());
		socket.emit('send:userTimeZone', { userTimeZone: jstz.determine() });
	}


	// Invoke the getUserLocation function
	getUserLocation();
	//getUserLocalTimeZone();

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

	socket.on('send:timeUntilLunch', function (data) {
		$scope.timeUntilLunch = data.timeUntilLunch;
	});

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