'use strict';

/* Controllers */

function lunchtimeController($scope, socket) {
  
	function getUserLocation() {
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(updateUserLocation);
		} else {
			// GeoLocation is not supported
			alert('No GeoLocation');
		}
	}

	function updateUserLocation(position) {
		console.log(position.coords.latitude);
		socket.emit('send:userLocation', {latitude : position.coords.latitude, longitude : position.coords.longitude});
	}	

	getUserLocation();

	socket.on('send:name', function (data) {
		$scope.name = data.name;
	});
}

function restaurantsController($scope, socket) {
	
	socket.on('send:userLocation', function (data) {
		$scope.userLocation = data;
	});

	socket.on('send:getRestaurants', function (data) {
		$scope.restaurants = data.restaurants;
	});

	$scope.getDistance = function (originLocation, destinationLocation, units) {
		console.log('getting getDistance...');

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

		console.log(d);
		return d;
	}

	$scope.restaurantFormSubmit = function(){
		//Process user selection
		var form = document.restaurantForm;
	}

	$scope.userDistance = function(rest) {
		return $scope.getDistance($scope.userLocation, rest.location);
	}
}