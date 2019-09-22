const spawn = require('child_process').spawn;

function launch() {
  console.log("executing bot");
  var bot = spawn('node', ['index.js']);

  bot.stdout.on('data', function (data) {
    var output = data.toString();
    process.stdout.write('stdout: ' + output.replace("[+] ", ""));
  });

  bot.stderr.on('data', function (data) {
    console.log('stderr: ' + data.toString());
  });

  bot.on('exit', function (code) {
    launch();
  });
}

function start() {
	launch();
}

start();