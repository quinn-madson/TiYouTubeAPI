//LIBS
//Require the YouTube Library
var YouTube = require('youtube');

//FUNCTIONS
var init = function() {
	//Initialize YouTube Library
	YouTube.init();

	//Open window
	$.index.open();
};

var handleData = function(data) {

	//Array for TableViewRows of videos
	var videos = [];
	
	//Array to track video IDs and remove duplicates
	var videoIDs = [];
	
	//Loop over returned JSON data
	for (var i = 0; i < data.items.length; i++) {

		//Filter out recommendations and other content types from YouTube and keep "upload" content types only. 
		if (data.items[i].contentDetails.hasOwnProperty("upload")) {

			//Check if we are already showing this video and only process the object if it's new.
			if (videoIDs.indexOf(data.items[i].contentDetails.upload.videoId) == -1) {

				//UI objects to display video.
				var tempRow = Ti.UI.createTableViewRow({
					layout: "horizontal",
					videoId: data.items[i].contentDetails.upload.videoId
				});
				var v = Ti.UI.createView({height: "100dp", width: Ti.UI.FILL, layout: "vertical"});
				var title = Ti.UI.createLabel({text: data.items[i].snippet.title, top: "10dp", left: "10dp", color: "#002F2F"});
				v.add(title);
				
				var preview = Ti.UI.createImageView({image: data.items[i].snippet.thumbnails.default.url});
				tempRow.add(preview);
				tempRow.add(v);
				
				//Add UI row container to array.				
				videos.push(tempRow);
				
				//Remember this video ID to remove duplicates.
				videoIDs.push(data.items[i].contentDetails.upload.videoId);
			}
		}

		
		
	}
	
	//Populate TableView with videos
	$.results.data = videos;

};

//EVENTS
$.sendIt.addEventListener("click", function() {
	//Example YouTube call to grab activities
	YouTube.send({
		operation : "activities",
		properties : {
			part : "snippet,contentDetails",
			home : "true",
			maxResults: "20"	
		},
		callback : handleData
	});
});

$.logout.addEventListener("click", function(){
	YouTube.logout();
	$.results.data = [];
});

$.results.addEventListener("click", function(e){
	Alloy.createWidget('ytPlayer').play(e.row.videoId);
});

//BOOTSTRAP
init();
