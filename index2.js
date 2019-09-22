var _ = require("lodash");
var CryptoJS = require("crypto-js");
const fetch = require('node-fetch');
const cheerio = require('cheerio');

var paramsLiteralToQsp = function(params) {
	var pars = [], params_str;
	
	_.each(params, _.bind(function(value, key) {
		pars.push(key + '=' + value);
	}, this));
	
	params_str = pars.join('&');
	return params_str;
};


function vote(output){
	fetch(
		"https://polldaddy.com/n/db1e930f784c2006f974c016309403aa/10413400?" + Date.now(), {
			"credentials":"omit",
			"headers":{
				"sec-fetch-mode":"no-cors",
				"origin": "www.breaktudo.com"
			},
			"referrer":"https://www.breaktudo.com/m2/",
			"referrerPolicy":"no-referrer-when-downgrade",
			"body":null,
			"method":"GET",
			"mode":"cors"
	})
	.then((response) => response.text())
	.then((text) => {
		var tmp = text;
		tmp = tmp.replace("PDV_n10413400='", "");
		tmp = tmp.replace("';PD_vote10413400(0);", "");
		
		var data = {
			p: 10413400,
			b: 0,
			a: '48039556,',
			o: '',
			va: 16,
			cookie: 0,
			n: tmp,
			url: escape('https://www.breaktudo.com/m2/')
		};
		
		fetch(
		"https://polls.polldaddy.com/vote-js.php?" + paramsLiteralToQsp(data), {
			"credentials":"omit",
			"headers":{
				"sec-fetch-mode":"no-cors", 
				"origin": "www.breaktudo.com"
			},
			"referrer":"https://www.breaktudo.com/m2/",
			"referrerPolicy":"no-referrer-when-downgrade",
			"body":null,
			"method":"GET",
			"mode":"cors"
		})
		.then((response) => response.text())
		.then((text) => {
			var tmp2 = text;
			text = text.replace("PD_button10413400.className = 'pds-vote-button';", "");
			text = text.replace("PD_button10413400.className='pds-vote-button';document.getElementById('PDI_container10413400').innerHTML='", "");
			text = text.replace("if (typeof PDF_callback10413400 == 'function') {", "");
			text = text.replace('PDF_callback10413400(\'{"id":10413400,"answer":[48039556],"other_answer":"","result":"registered"}\');', "");
			text = text.replace("}", "");
			text = text.replace(";\", \"\");", "");
			text = text.replace("';if(typeof PDF_callback10413400=='function'){", "");
			text = text.replace(";", "");
			text = text.replace("</div>;", "</div>");
			
			const $ = cheerio.load(text);
			
			
			if(output){
				$(".pds-feedback-group").each((i, elem) => {
					console.log($(elem).find(".pds-answer-text").text().trim() + " " + $(elem).find(".pds-feedback-per").text().trim());
				});
				vote(true);
			}
		});
	});
}
vote(true);
