require("dotenv").config();
var keys = require("./keys.js");
var twitter = require("twitter");
var spotify = require("node-spotify-api");
var request = require("request");
var spotify = new spotify(keys.spotify);
var client = new twitter(keys.twitter);
var fs = require("fs");


//user choices
console.log("Type my-tweets, spotify-this-song, movie-this, do-what-it-says to pull information!");

var userChoice = process.argv[2];
var secondCommand = process.argv[3];

for(i=4; i<process.argv.length; i++){
	    secondCommand += '+' + process.argv[i];
	}


//case switch function calls
function userChoiceSwitch(){
	switch(userChoice){

		case "my-tweets":
		grabTweets();
		break;

		case "spotify-this-song":
		grabSongs();
		break;

		case "movie-this":
		grabMovie();
		break;

		case "do-what-it-says":
		grabRandom();
		break;

	}
};

//my tweets
function grabTweets(){
	console.log("I'm not a tweeter, I just tweet a lil");
	
	var parameters = {
		screen_name: "Shae0220",
		count: 20
	};

	client.get('statuses/user_timeline', parameters, function(error, tweets, response){
		if (!error) {
	        for (i=0; i<tweets.length; i++) {
	            var returnedData = ('Number: ' + (i+1) + '\n' + tweets[i].created_at + '\n' + tweets[i].text + '\n');
	            console.log(returnedData);
	            console.log("-------------------------");
	        }
	    };
	});
};

//spotify searcch
function grabSongs(){
	console.log("Music for DAYS!");

	var searchTrack;
	if(secondCommand === undefined){
		searchTrack = "The Sign Ace";
	}else{
		searchTrack = secondCommand;
	}
	spotify.search({type:'track', query:searchTrack}, function(err,data){
	    if(err){
	        console.log('Error occurred: ' + err);
	        return;
	    }else{
	  		console.log("Artist: " + data.tracks.items[0].artists[0].name);
	        console.log("Song: " + data.tracks.items[0].name);
	        console.log("Album: " + data.tracks.items[0].album.name);
	        console.log("Preview Here: " + data.tracks.items[0].preview_url);
	    }
	});
};

//movie search 
function grabMovie(){
	console.log("How about a movie night?");
	var searchMovie;
	if(secondCommand === undefined){
		searchMovie = "Mr. Nobody";
	}else{
		searchMovie = secondCommand;
	};

	var url = 'http://www.omdbapi.com/?t=' + searchMovie +'&y=&plot=long&tomatoes=true&r=json&apikey=trilogy';
   	request(url, function(error, response, body){
	    if(!error && response.statusCode == 200){
	        console.log("Title: " + JSON.parse(body)["Title"]);
	        console.log("Year: " + JSON.parse(body)["Year"]);
	        console.log("IMDB Rating: " + JSON.parse(body)["imdbRating"]);
	        console.log("Country: " + JSON.parse(body)["Country"]);
	        console.log("Language: " + JSON.parse(body)["Language"]);
	        console.log("Plot: " + JSON.parse(body)["Plot"]);
	        console.log("Actors: " + JSON.parse(body)["Actors"]);
	        console.log("Rotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"]);
	        console.log("Rotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"]);
	    }
    });
};

function grabRandom(){
	console.log("Looking at random.txt now");
	fs.readFile("random.txt", "utf8", function(error, data) {
	    if(error){
     		console.log(error);
     	}else{

     	//split data, declare variables
     	var dataArr = data.split(',');
        userCommand = dataArr[0];
        secondCommand = dataArr[1];
        //if multi-word search term, add.
        for(i=2; i<dataArr.length; i++){
            secondCommand = secondCommand + "+" + dataArr[i];
        };
		userChoiceSwitch();
		
    	};

    });

};
userChoiceSwitch();