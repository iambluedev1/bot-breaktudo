var fetch = require("node-fetch");
var cheerio = require("cheerio");
var ra = require("random-useragent");
var request = require("request");

var getConfig = function (context, cb){
	
	fetch(
		"https://embed.playbuzz.com/html?id=" + context.id, {
		"credentials":"omit",
		"headers":{
			"sec-fetch-mode":"cors",
			'user-Agent': ra.getRandom(),
			'origin': "www.breaktudo.com"
		},
		"referrer":context.referer,
		"referrerPolicy":"no-referrer-when-downgrade",
		"body":null,
		"method":"GET",
		"mode":"cors"
	})
	.then((response) => response.text())
	.then((data) => {
		var regex = /window.pbItem = \{(.*?)\}\;/g;
		var found = data.match(regex);
		console.log(data);
		
		if(found){
			var str = found[0];
			str = str.replace("window.pbItem = ", "");
			str = str.substring(0, str.length - 1);
			str = JSON.parse(str);
			console.log(str);
		}
	})
	
}


getConfig({
	id: "2bd1fad8-1c5a-4626-936f-5dce467a301d",
	referer: "https://www.breaktudo.com/breaktudo-awards-2019-votacao-music-parte-1/",
}, () => {})


