var keys = require("./keys.js"); 
var fs = require("fs"); 
var request = require("request"); 
var Twitter = require('twitter'); 
var Spotify = require("node-spotify-api"); 

var action = process.argv[2];
var value = process.argv[3];

//Spotify Exercise
function spotifyThisSong(value) {
	
	var trackName = 'The Sign Ace of Base';
	if (value != undefined) {
		trackName = value;
	}
	
	var spotify = new Spotify({
	  id: keys.spotifyKeys.client_id,
	  secret: keys.spotifyKeys.client_secret
	});
	spotify.search({ type: 'track', query: trackName, limit: 5 }, function(err, data) {
		if (err) {
		    return console.log('Error occurred: ' + err);
		}
		

		var firstResult = data.tracks.items[0];
		var trackInfo = "* Track Title: " + firstResult.name +
						"* Artist(s): " + firstResult.album.artists[0].name +
						"* Preview Link: " + firstResult.external_urls.spotify +
						"* Album Name: " + firstResult.album.name;		
		var dataArr = trackInfo.split("*");			
		for (i=0; i < dataArr.length; i++) {				
			console.log(dataArr[i].trim());
		

			fs.appendFile("log.txt", dataArr[i].trim()+"\n", function(err) {
				if (err) {
					return console.log(err);
				}
			});
		}
		console.log("\n===== log.txt was updated with Music info! =====");
	});
} 

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {
    	if(error) {
     		console.log(error);
     	}
     	else {
			var randomDataArray = data.split(',');
			var action = randomDataArray[0];
			var value = randomDataArray[1];
			switch (action) {
				case "my-tweets":
					myTweets();
					break;
				case "spotify-this-song":
					spotifyThisSong(value);
					break;
				case "movie-this":
					movieThis(value);
					break;
			}
		}
	});
} 


function myTweets() {
	var client = new Twitter({
	     consumer_key: keys.twitterKeys.consumer_key,
	     consumer_secret: keys.twitterKeys.consumer_secret,
	     access_token_key: keys.twitterKeys.access_token_key,
	     access_token_secret: keys.twitterKeys.access_token_secret
	});
	var params = {count: 20};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  	if (!error) {
	    	for (var i = 0; i < tweets.length; i++) {
	        	console.log(tweets[i].text + "\nTweeted on: " + tweets[i].created_at);
	            fs.appendFile('log.txt', "\n" + tweets[i].text + "\n" + "Tweeted on: " + tweets[i].created_at + "\n", function(err) {
					if (err) {
						return console.log(err);
					}
	            });
	       }
	  	}
	  	else {
	    	console.log(error);
	  	}
		console.log("\n===== log.txt was updated with Twitter info! =====");
	});
} 


function movieThis(value) {


	var movieName = 'American Sniper';
	if (value != undefined) {
		movieName = value;
	}


	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&plot=short&apikey=40e9cece";


	request(queryUrl, function(error, response, body) {
	 

		if (!error && response.statusCode === 200) {
            var movieData = JSON.parse(body);
		


			var movieInfo = "* Movie Title: " + movieData.Title +
							"* The movie's Release Year is: " + movieData.Year +
							"* The movie's IMDB Rating is: " + movieData.Ratings[0].Value +
							"* The movie's Rotten Tomatoes Rating is: " + movieData.Ratings[1].Value +
							"* The movie was produced in: " + movieData.Country +
							"* The movie's Language is: " + movieData.Language +
							"* The movie's Plot is: " + movieData.Plot +
							"* The movie's Actors include: " + movieData.Actors;			
			var dataArr = movieInfo.split("*");			
			for (i=0; i < dataArr.length; i++) {				
				console.log(dataArr[i].trim());
				

				fs.appendFile("log.txt", dataArr[i].trim()+"\n", function(err) {
					if (err) {
						return console.log(err);
					}
				});
			} 
		console.log("\n===== log.txt was updated with Movie info! =====");
	  	} 
	  	else {
	       console.log(error);
	  	}
	});
} 

switch (action) {
	case "my-tweets":
		myTweets();
		break;

	case "spotify-this-song":
		spotifyThisSong(value);
		break;

	case "movie-this":
		movieThis(value);
		break;

	case "do-what-it-says":
		doWhatItSays();
		break;

	default:
		console.log("You must pass an action [my-tweets, spotify-this-song, movie-this, do-what-it-says] and a value");
		console.log("Example node liri.js movie-this American Sniper");
		break;
};