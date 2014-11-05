var GoogleAuth = require('googleAuth');

var googleAuth = {};

exports.init = function() {
	
	if (!Alloy.CFG.hasOwnProperty("googleAuth")) {
		alert("No googleAuth object found in Alloy.CFG. Please check your alloy.js and add in the configuration object.");
		Ti.API.error("Youtube library init failed. Create a googleAuth object in your alloy.js file.");
		googleAuth.initError = true;
	} else {
		googleAuth = new GoogleAuth({
			clientId : Alloy.CFG.googleAuth.clientId,
			clientSecret : Alloy.CFG.googleAuth.clientSecret,
			propertyName : Alloy.CFG.googleAuth.propertyName,
			quiet : Alloy.CFG.googleAuth.quiet,
			scope : Alloy.CFG.googleAuth.scope,
			initError: false
		});
	}

};

exports.logout = function() {
	googleAuth.deAuthorize();
};

exports.send = function(params) {

	if (googleAuth.initError) {
		Ti.API.error("Cannot run .send() method because .init() failed.");
		return;
	}

	//convert properties object into string for REST call
	var propertyUrl = "";
	var index = 0;
	for (var property in params.properties) {

		//if not first property, add ampersand url param separator
		if (index) {
			propertyUrl = propertyUrl + "&";
		}

		//add individual property to propertyUrl string
		propertyUrl = propertyUrl + property + "=" + params.properties[property];
		index++;
	}

	//force auth if not auth'd already
	if (googleAuth.isAuthorized && googleAuth.getAccessToken()) {
		var xhr = Ti.Network.createHTTPClient({
			onload : function(e) {
				try {
					var data = JSON.parse(this.responseText);
					if (params.callback) {
						params.callback(data);
					} else {
						for (var thing in data) {
							Ti.API.info("data." + thing + ' = ' + data[thing]);
						}
						Ti.API.warn("Data received but no callback specified.");
					}

				} catch(e) {
					Titanium.UI.createAlertDialog({
						title : 'Error',
						message : 'Error accessing data: ' + JSON.stringify(e)
					});
					Ti.API.error('RESPONSE: ' + JSON.stringify(e));
				}
			},
			// function called when an error occurs, including a timeout
			onerror : function(e) {
				Titanium.UI.createAlertDialog({
					title : 'Error',
					message : 'Error accessing data: ' + JSON.stringify(e)
				});
				Ti.API.error('HTTP: ' + JSON.stringify(e));
			},
			timeout : 5000
		});
		xhr.open("GET", "https://www.googleapis.com/youtube/v3/" + params.operation + "?" + propertyUrl + "&key=" + googleAuth.getAccessToken());
		xhr.setRequestHeader("Authorization", "Bearer " + googleAuth.getAccessToken());
		xhr.send();
	} else {
		var recall = function () {
			exports.send(params);
			Ti.App.removeEventListener("googleAuth:winClosed", recall);
		};
		Ti.App.addEventListener("googleAuth:winClosed", recall);
		googleAuth.authorize();
	}
};

