#TiYouTubeAPI#

## What is this? ##

YouTube library for making API requests from Appcelerator Titanium apps easier.

## Screenshots ##

###OAuth Login###
![OAuth](https://github.com/quinn-madson/TiYouTubeAPI/blob/master/Screenshots/01-OAuth.png?raw=true)

###Permissions###
![Permission](https://github.com/quinn-madson/TiYouTubeAPI/blob/master/Screenshots/02-Permission.png?raw=true)

###Video List###
![Video List](https://github.com/quinn-madson/TiYouTubeAPI/blob/master/Screenshots/03-VideoList.png?raw=true)

###Video Player###
![Video Player](https://github.com/quinn-madson/TiYouTubeAPI/blob/master/Screenshots/04-VideoPlayer.png?raw=true)

## Getting Started ##

  * Put youtube.js and googleAuth.js in your /app/lib/ folder.
  * Signup to use the Youtube API here: [Google Developers Console](https://console.developers.google.com/)
     * Create a new project
     * Enable 'YouTube Data API v3' (APIs & auth >> APIs >> YouTube Data API v3)
     * Create a new OAuth Client ID (APIs & auth >> Credentials >> Create new Client ID)
  * Open /app/config.json and add your credential information. Example:

```json
{
  "global": {
    "googleAuth": {
      "clientId": "1059383751733-a1ne37if268lt726mb5eso11038e5kq5.apps.googleusercontent.com",
      "clientSecret": "qrlq907w4Owz5FRZv52momPd",
      "propertyName": "googleToken",
      "quiet": false,
      "scope": ["https://www.googleapis.com/auth/youtube"]
    }
  },
  "env:development": {},
  "env:test": {},
  "env:production": {},
  "os:android": {},
  "os:blackberry": {},
  "os:ios": {},
  "os:mobileweb": {},
  "dependencies": {
    "ytPlayer": "1.0"
  }
}
```

  * In one of your controllers, require the library and initialize it. Example:

```javascript
var YouTube = require('youtube');
YouTube.init();
```

  * Make your first call! Example:

```javascript
YouTube.send({
		operation : "activities",
		properties : {
			part : "snippet,contentDetails",
			home : "true",
			maxResults: "20"
		},
		callback : function(data) {
      alert("Hooray, data! " + data);
    }
	});
```

## Further examples ##

Take a look at the included example app for further details on using the library and parsing results.

## Acknowledgements ##

TiYouTubeAPI requires googleAuth.js (made by Miroslav Magda). The example app includes the ytPlayer 1.0 widget built by Bob Sims.

[Google Auth for Titanium](https://github.com/ejci/Google-Auth-for-Titanium)
[ytPlayer](https://github.com/bob-sims/ytPlayer/)
