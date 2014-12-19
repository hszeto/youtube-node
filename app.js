// Set Up //
var http 		= require('http'),
	express 	= require('express'),
	app			= express(),
	port		= process.env.PORT || 9999;
var server 		= http.Server(app);
var io	 		= require('socket.io')(server);

var YouTube 	= require('youtube-node');
var public_path = require('path')

// Routing //
app.use(express.static(public_path.join(__dirname, 'public')));

app.get('/', function(request, response){
	response.sendFile(__dirname + '/index.html');
});

var youTube = new YouTube();

// Socket.io //
io.on('connection', function(client){
	console.log('Connected');
	
	// ytdata = video search
	client.on('ytsearch', function(ytdata) {
		console.log('ytdata is: ', ytdata);
			//youTube module search for video id by user's input
			youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');
			youTube.search(ytdata, 1, function(resultData) {
				var ytVideoId = resultData.items[0].id.videoId; //grab video id
				var yturl = '//www.youtube.com/embed/'+ytVideoId+'?rel=0&autoplay=1';
				console.log(yturl);
			
				// Sending back to client
				io.emit('toClient', yturl); //End of io.emit toClient
			}); //End of youTube.search
	}); //End of client.on test


	client.on('disconnect', function(){
    	console.log('user disconnected');
  	});

}); //End of io.on connection

// Listen //
server.listen(port);
console.log("Server is running!");