//https://www.warnerchannel.com/hn/teenchoice/
var request = require('request');
var random_useragent = require('random-useragent');
var _ = require("lodash");
const fetch = require('node-fetch');
const cheerio = require('cheerio');

var Queue = require('better-queue');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db1.json')
const db = low(adapter)

db.defaults({ proxies: []}).write()

const adapter2 = new FileSync('db.json')
const db2 = low(adapter2)

db2.defaults({ proxies: []}).write()

var i = 1;
var count = 0;

var q = new Queue(function (el, cb) {
	try {
		var proxiedRequest = request.defaults(el);
		vote({}, proxiedRequest, (success) => {
			if(success){
				
			}
		});
		cb(null, {});
	}catch(e){};
});

const between = function(str, first, last, index) {
    return str.match(first + "(.*)" + last)[index].trim();
};

var paramsLiteralToQsp = function(params) {
	var pars = [], params_str;
	
	_.each(params, _.bind(function(value, key) {
		pars.push(key + '=' + value);
	}, this));
	
	params_str = pars.join('&');
	return params_str;
};

function sendVote(config, proxiedRequest, cb){
	
	try {
		var options = {
			method: 'get',
			url: "https://polldaddy.com/n/db1e930f784c2006f974c016309403aa/10413400?" + Date.now(),
			headers: {
				'User-Agent': config.userAgent,
				'Referer': 'https://www.breaktudo.com/m2/',
				'Origin': 'https://www.breaktudo.com'
			},
			timeout: 10000
		}
		
		proxiedRequest(options, function (err, res, body) {
			if (err) {
				//var date = new Date()
				//console.log(date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ' err' + err);
				cb(config, false);
				return;
			}
			
			var tmp = body;
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
			
			
			var options = {
				method: 'get',
				url: "https://polls.polldaddy.com/vote-js.php?" + paramsLiteralToQsp(data),
				headers: {
					'User-Agent': config.userAgent,
					'Referer': 'https://www.breaktudo.com/m2/',
					'Origin': 'https://www.breaktudo.com'
				},
				timeout: 10000
			}
			
			proxiedRequest(options, function (err, res, body) {
				if (err) {
					//var date = new Date()
					//console.log(date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ' err' + err);
					cb(config, false);
					return;
				}
				
				var date = new Date()
				console.log(date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ' statusCode: ' + res.statusCode)
				cb(config, true);
			});
		})
	}catch(e){}
}

function vote(config, proxiedRequest, callback) {
	try {
		config.userAgent = random_useragent.getRandom();
		config.debug = false;
		
		sendVote(config, proxiedRequest, (success) => {
			callback(success)
		});	
	}catch(e){};
}

function list1(callback) {
    let url = 'http://www.gatherproxy.com/embed/?t=Anonymous&p=&c='
    fetch(url)
      .then(res => res.text())
      .then(body => {
        const $ = cheerio.load(body);
        const proxies = [];
        $('script').each((i, elem) => {
          if (elem.children[0] && elem.children[0].data && /(.*)gp.insertPrx(.*)/g.test(elem.children[0].data)) {
            const proxy = JSON.parse(`{${between(elem.children[0].data, '{', '}', 1)}}`);
            proxies.push({
              host: proxy.PROXY_IP,
              port: parseInt('0x' + proxy.PROXY_PORT, 16),
              time: proxy.PROXY_TIME,
              country: proxy.PROXY_COUNTRY,
              type: proxy.PROXY_TYPE
            });
          }
        });
        callback(proxies);
      });
};

function list2(callback) {
    let url = 'http://www.gatherproxy.com/embed/?t=Elite&p=&c='
    fetch(url)
      .then(res => res.text())
      .then(body => {
        const $ = cheerio.load(body);
        const proxies = [];
        $('script').each((i, elem) => {
          if (elem.children[0] && elem.children[0].data && /(.*)gp.insertPrx(.*)/g.test(elem.children[0].data)) {
            const proxy = JSON.parse(`{${between(elem.children[0].data, '{', '}', 1)}}`);
            proxies.push({
              host: proxy.PROXY_IP,
              port: parseInt('0x' + proxy.PROXY_PORT, 16),
              time: proxy.PROXY_TIME,
              country: proxy.PROXY_COUNTRY,
              type: proxy.PROXY_TYPE
            });
          }
        });
        callback(proxies);
      });
};

function list3(callback) {
	var options = {
		method: 'post',
		url: "http://spys.one/en/anonymous-proxy-list/",
		form: {
			xpp: 5,
			xf1: 1,
			xf2: 0,
			xf4: 0,
			xf5: 0
		},
		headers: {
			'Referer': 'http://spys.one/en/anonymous-proxy-list/',
			'user-Agent': random_useragent.getRandom()
		}
	}
	
	request(options, function (err, res, body) {
		if (err) {
			return;
		}
		
		const $ = cheerio.load(body);
		//eval($('script')[3].children[0].data);
		
		var proxies = [];
		
		/*$("table table tr:nth-child(n+3)").each((i, elem) => {
			if($(elem).find("td").length == 10){
				var el = $(elem).find("td")[0];
				var script = $(el).find("script");
				var s = $(script)[0].children[0].data;
				s = s.replace("document.write", "");
				
				var proxy = $(el).find(".spy14").text() + ":" + eval(s).replace("<font class=spy2>:</font>", "");
				proxies.push(proxy);
			}
		});*/
	
		callback(proxies);
	});
};

function list4(callback) {
	var options = {
		method: 'get',
		url: "http://free-proxy.cz/fr/proxylist/country/FR/http/ping/level1",
		headers: {
			'user-Agent': random_useragent.getRandom()
		}
	}
	
	request(options, function (err, res, body) {
		if (err) {
			return;
		}
		
		const $ = cheerio.load(body);
		
		var proxies = [];
		
		$("#proxy_list tr").each((i, elem) => {
			if($(elem).find("td").length > 2){
				var td = $(elem).find("td");
				var script = $(td[0]).find("script");
				var s = $(script)[0].children[0].data;
				s = s.replace("document.write", "");
				s = s.replace("(Base64.decode(", "");
				s = s.replace('")', "");
				s = s.replace(')', "");
				s = s.replace('"', "");
				
				var proxy = Buffer.from(s, 'base64') + ":" + $(td[1]).text();
				
				proxies.push(proxy);
			}
		});
		
		callback(proxies);
	});
};

function list5(callback) {
	var options = {
		method: 'get',
		url: "http://free-proxy.cz/fr/proxylist/country/FR/http/ping/level1/2",
		headers: {
			'user-Agent': random_useragent.getRandom()
		}
	}
	
	request(options, function (err, res, body) {
		if (err) {
			return;
		}
		
		const $ = cheerio.load(body);
		
		var proxies = [];
		
		$("#proxy_list tr").each((i, elem) => {
			if($(elem).find("td").length > 2){
				var td = $(elem).find("td");
				var script = $(td[0]).find("script");
				var s = $(script)[0].children[0].data;
				s = s.replace("document.write", "");
				s = s.replace("(Base64.decode(", "");
				s = s.replace('")', "");
				s = s.replace(')', "");
				s = s.replace('"', "");
				
				var proxy = Buffer.from(s, 'base64') + ":" + $(td[1]).text();
				proxies.push(proxy);
			}
		});
		
		callback(proxies);
	});
};

function list6(callback) {
	var options = {
		method: 'get',
		url: "http://free-proxy.cz/fr/proxylist/country/FR/http/ping/level1/3",
		headers: {
			'user-Agent': random_useragent.getRandom()
		}
	}
	
	request(options, function (err, res, body) {
		if (err) {
			return;
		}
		
		const $ = cheerio.load(body);
		
		var proxies = [];
		
		$("#proxy_list tr").each((i, elem) => {
			if($(elem).find("td").length > 2){
				var td = $(elem).find("td");
				var script = $(td[0]).find("script");
				var s = $(script)[0].children[0].data;
				s = s.replace("document.write", "");
				s = s.replace("(Base64.decode(", "");
				s = s.replace('")', "");
				s = s.replace(')', "");
				s = s.replace('"', "");
				
				var proxy = Buffer.from(s, 'base64') + ":" + $(td[1]).text();
				//q.push({'proxy': 'http://' + proxy});
				proxies.push(proxy);
			}
		});
		
		callback(proxies);
		
	});
};

function list7(callback) {
	var options = {
		method: 'get',
		url: "http://free-proxy.cz/fr/proxylist/country/FR/http/ping/level2",
		headers: {
			'user-Agent': random_useragent.getRandom()
		}
	}
	
	request(options, function (err, res, body) {
		if (err) {
			return;
		}
		
		const $ = cheerio.load(body);
		var proxies = [];
		
		$("#proxy_list tr").each((i, elem) => {
			if($(elem).find("td").length > 2){
				var td = $(elem).find("td");
				var script = $(td[0]).find("script");
				var s = $(script)[0].children[0].data;
				s = s.replace("document.write", "");
				s = s.replace("(Base64.decode(", "");
				s = s.replace('")', "");
				s = s.replace(')', "");
				s = s.replace('"', "");
				
				var proxy = Buffer.from(s, 'base64') + ":" + $(td[1]).text();
				//q.push({'proxy': 'http://' + proxy});
				proxies.push(proxy);
			}
		});
		
		callback(proxies);
	});
};

function launch(){
	/*
	var d = db.get('proxies')
	  .value();
	
	d.sort((e1, e2) => {
		return Math.random() - Math.random();
	});
	
	console.log("loaded " + d.length + " proxies");
	
	d.forEach((el) => {
		q.push({'proxy': el});
	});
	
	var d2 = db2.get('proxies')
	  .value();
	
	d2.sort((e1, e2) => {
		return Math.random() - Math.random();
	});
	
	console.log("loaded " + d2.length + " proxies");
	
	d2.forEach((el) => {
		q.push({'proxy': el});
	});
	*/
	
	
	
	try {
		request("https://www.proxy-list.download/api/v1/get?type=http&anon=elite", function (error, response, body) {
			var proxies = body.split("\r\n");
			console.log("loaded " + proxies.length + " proxies");
			
			try {
				proxies.forEach((el) => {
					q.push({'proxy': 'http://' + el});
				});

			}catch(e){}
			
			count++;
	   });
	}catch(e){}

	/*try {
		request("https://www.proxy-list.download/api/v1/get?type=http&anon=anonymous", function (error, response, body) {
			var proxies = body.split("\r\n");
			console.log("loaded " + proxies.length + " proxies");
			
			try {
				proxies.forEach((el) => {
					q.push({'proxy': 'http://' + el});
				});
			}catch(e){}
			
			count++;
	   });
	}catch(e){}*/

	try {
		request("https://byteproxies.com/api.php?key=free&amount=100&type=http&anonymity=elite", function (error, response, body) {
			var tmp = JSON.parse(body);
			console.log("loaded " + tmp.length + " proxies");
			tmp.forEach((el) => {
				var el = el.response;
				try {
					q.push({'proxy': 'http://' + el.ip + ":" + el.port});
				}catch(e){};
			});
			
			count++;
		});
	}catch(e){}

	try {
		request("https://byteproxies.com/api.php?key=free&amount=100&type=http&anonymity=anonymous", function (error, response, body) {
			var tmp = JSON.parse(body);
			console.log("loaded " + tmp.length + " proxies");
			tmp.forEach((el) => {
				var el = el.response;
				try {
					q.push({'proxy': 'http://' + el.ip + ":" + el.port});
				}catch(e){};
			});
			
			count++;
		});
	}catch(e){}


	try {
		request("https://i.guillaumechalons.fr/LM30xzHkSo.txt", function (error, response, body) {
			var proxies = body.split("\n");
			console.log("loaded " + proxies.length + " proxies");
			try {
				for(var i = 0; i < proxies.length; i++){
					q.push({'proxy': 'http://' + proxies[i].replace("\r", "")});
				};
			}catch(e){}
			
			count++;
	   });
	}catch(e){}
	
	try {
		request("https://i.guillaumechalons.fr/cC4jLVbdTD.txt", function (error, response, body) {
			var proxies = body.split("\n");
			console.log("loaded " + proxies.length + " proxies");
			try {
				for(var i = 0; i < proxies.length; i++){
					q.push({'proxy': 'http://' + proxies[i].replace("\r", "")});
				};
			}catch(e){}
			
			count++;
	   });
	}catch(e){}
	
	try {
		request("https://i.guillaumechalons.fr/V33EaLMwgU.txt", function (error, response, body) {
			var proxies = body.split("\n");
			console.log("loaded " + proxies.length + " proxies");
			try {
				for(var i = 0; i < proxies.length; i++){
					q.push({'proxy': 'http://' + proxies[i].replace("\r", "")});
				};
			}catch(e){}
			
			count++;
	   });
	}catch(e){}
	
	try {
		request("https://i.guillaumechalons.fr/AHP0H0hag6.txt", function (error, response, body) {
			var proxies = body.split("\n");
			console.log("loaded " + proxies.length + " proxies");
			try {
				for(var i = 0; i < proxies.length; i++){
					q.push({'proxy': 'http://' + proxies[i].replace("\r", "")});
				};
			}catch(e){}
			
			count++;
	   });
	}catch(e){}
	
	try {
		request("https://i.guillaumechalons.fr/v5yusGQcOw.txt", function (error, response, body) {
			var proxies = body.split("\n");
			console.log("loaded " + proxies.length + " proxies");
			try {
				for(var i = 0; i < proxies.length; i++){
					q.push({'proxy': 'http://' + proxies[i].replace("\r", "")});
				};
			}catch(e){}
			
			count++;
	   });
	}catch(e){}
	
	try {
		request("https://i.guillaumechalons.fr/IKBeym9ZeT.txt", function (error, response, body) {
			var proxies = body.split("\n");
			console.log("loaded " + proxies.length + " proxies");
			try {
				for(var i = 0; i < proxies.length; i++){
					q.push({'proxy': 'http://' + proxies[i].replace("\r", "")});
				};
			}catch(e){}
			
			count++;
	   });
	}catch(e){}
	
	
	try {
		request("https://i.guillaumechalons.fr/j62Pemukdc.txt", function (error, response, body) {
			var proxies = body.split("\n");
			console.log("loaded " + proxies.length + " proxies");
			try {
				for(var i = 0; i < proxies.length; i++){
					q.push({'proxy': 'http://' + proxies[i].replace("\r", "")});
				};
			}catch(e){}
			
			count++;
	   });
	}catch(e){}
	
	try {
		request("https://i.guillaumechalons.fr/Pcje8YRA6L.txt", function (error, response, body) {
			var proxies = body.split("\n");
			console.log("loaded " + proxies.length + " proxies");
			try {
				for(var i = 0; i < proxies.length; i++){
					q.push({'proxy': 'http://' + proxies[i].replace("\r", "")});
				};
			}catch(e){}
			
			count++;
	   });
	}catch(e){}
	
	
	try {
		request("https://i.guillaumechalons.fr/0ytiO6E39e.txt", function (error, response, body) {
			var proxies = body.split("\n");
			console.log("loaded " + proxies.length + " proxies");
			try {
				for(var i = 0; i < proxies.length; i++){
					q.push({'proxy': 'http://' + proxies[i].replace("\r", "")});
				};
			}catch(e){}
			
			count++;
	   });
	}catch(e){}
	
	
	try {
		request("https://i.guillaumechalons.fr/2JTptlwj8I.txt", function (error, response, body) {
			var proxies = body.split("\n");
			console.log("loaded " + proxies.length + " proxies");
			try {
				for(var i = 0; i < proxies.length; i++){
					q.push({'proxy': 'http://' + proxies[i].replace("\r", "")});
				};
			}catch(e){}
			
			count++;
	   });
	}catch(e){}

	
	
	
	
	list1((proxies) => {
		console.log("loaded " + proxies.length + " proxies");
		try {
			proxies.forEach((el) => {
				q.push({'proxy': 'http://' + el.host + ":" + el.port});
			});
		}catch(e){};
		
		count++;
	});

	list2((proxies) => {
		console.log("loaded " + proxies.length + " proxies");
		try {
			proxies.forEach((el) => {
				q.push({'proxy': 'http://' + el.host + ":" + el.port});
			});
		}catch(e){};
		
		count++;
	});

	list3((proxies) => {
		console.log("loaded " + proxies.length + " proxies");
		try {
			proxies.forEach((el) => {
				q.push({'proxy': 'http://' + el});
			});
		}catch(e){};
		
		count++;
	});
	
	
	list4((proxies) => {
		console.log("loaded " + proxies.length + " proxies");
		try {
			proxies.forEach((el) => {
				q.push({'proxy': 'http://' + el});
			});
		}catch(e){};
		
		count++;
	});
	
	
	list5((proxies) => {
		console.log("loaded " + proxies.length + " proxies");
		try {
			proxies.forEach((el) => {
				q.push({'proxy': 'http://' + el});
			});
		}catch(e){};
		
		count++;
	});
	
	list6((proxies) => {
		console.log("loaded " + proxies.length + " proxies");
		try {
			proxies.forEach((el) => {
				q.push({'proxy': 'http://' + el});
			});
		}catch(e){};
		
		count++;
	});
	
	list7((proxies) => {
		console.log("loaded " + proxies.length + " proxies");
		try {
			proxies.forEach((el) => {
				q.push({'proxy': 'http://' + el});
			});
		}catch(e){};
		
		count++;
	});
}

launch();

setTimeout(function () {
	process.exit();
}, 1000*60*2);

