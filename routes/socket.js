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

	// Receive the users location from the client app
	socket.on('client:userLocation', function (data) {
		//console.log("userLocation: " + data.latitude + ", " + data.longitude);
		socket.emit('return:userLocation',data);
		socket.disconnect();
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
