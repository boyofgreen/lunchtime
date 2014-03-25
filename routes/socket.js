/*
 * Serve content over a socket
 */

module.exports = function (socket) {
	// Send a user name to the app on connection
	socket.emit('send:name', {
		name: 'Lunchtime user'
	});

	// Send the users preferences to the app
	socket.emit('send:userPreferences', {
		userPreferences: getUserPreferences()
	});

	// Send the resturant data to the app on connection
	socket.emit('send:getRestaurants', {
		restaurants: getRestaurants()
	});

	socket.emit('send:timeUntilLunch', {
		timeUntilLunch: timeUntilLunch()
	});

	// Recieve the users location from the client app
	socket.on('send:userLocation', function (data) {
		//console.log("userLocation: " + data.latitude + ", " + data.longitude);
		socket.emit('send:userLocation',data);
	});

	// Recieve the users timezone from the client app
	socket.on('send:userTimeZone', function (data) {
		//console.log(data);
	});
};


// Private function to return resturant data
function getRestaurants() {
	var restaurants = [
		{
			'id':3,
			'name':'Sage Cafe',
			'location':
				{
					'latitude' : 37.778023,
					'longitude': -122.422500
				}
		},
		{
			'id':1,
			'name':'Cafe 50',
			'location':
				{
					'latitude' : 47.646973,
					'longitude': -122.133147
				}
		},
		{
			'id':2,
			'name':'Zuni Cafe',
			'location':
				{
					'latitude' : 37.773372,
					'longitude': -122.421663
				}
		}
	]

	return restaurants;
}


// Private function to return user prefs
function getUserPreferences() {
	var preferences = [
		{ 'id' : 1 },
		{ 'id' : 3 }
	]
	return preferences;
}

function timeUntilLunch() {
	
	var now = new Date();

	var secondsPassed = 0;
	var noon = 12 * 3600;

	secondsPassed += ( now.getHours() * 3600 );
	secondsPassed += ( now.getMinutes() * 60 );
	secondsPassed += now.getSeconds();

	var secondsLeft = noon - secondsPassed;

	return secondsLeft;
}
