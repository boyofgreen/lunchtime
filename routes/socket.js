/*
 * Serve content over a socket
 */

module.exports = function (socket) {
	socket.emit('send:name', {
		name: 'Bob'
	});

	socket.emit('send:getRestaurants', {
		restaurants: getRestaurants()
	});

	socket.on('send:userLocation', function (data) {
		console.log("userLocation: " + data.latitude + ", " + data.longitude);
		socket.emit('send:userLocation',data);
	})
};


// Private function to return resturant data
function getRestaurants(){
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

/*
<div class="btn-group btn-toggle"> 
    <button class="btn btn-xs btn-default">ON</button>
    <button class="btn btn-xs btn-primary active">OFF</button>
  </div>
*/