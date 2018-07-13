'use strict';

console.log('Loading function');

module.exports.a11yCheck = (event, context, callback) => {
  var url = event.queryStringParameters.url;
  var outputFileName = randomFileName();
  var cmd = './node_modules/axe-cli/axe-cli ' + url + ' --save ' + outputFileName + ' -d /tmp';
  console.log('Command to execute: ' + cmd);

  var exec = require('child_process').exec;

  // https://github.com/SaschaGalley/grunt-phpunit/issues/29
  // default buffer is 200 * 1024, so we set up a higher limit for the JSON output
  var maxBuffer = 100000 * 1024;

  exec(cmd, { maxBuffer: maxBuffer }, function(error, stdout, stderr) {
    if (error) { console.log(error); }
    console.log(stdout);

    // Read contents of file in outputFileName and return that.
    exec('cat /tmp/' + outputFileName, { maxBuffer: maxBuffer }, function(error, stdout, stderr) {
      if (error) {
        console.log("error reading results")
      } else {
        console.log("OK reading results")

        // BEGIN HTTP Response
        const response = {
          statusCode: 200,
          body: stdout,
        };

        callback(null, response);
        // END HTTP Response
      }
    })

    // Delete temporary file
    exec('rm /tmp/' + outputFileName, function(error, stdout, stderr) {
      if (error) { console.log(error);  }
      console.log(stdout);
    });
  });
};

// Returns a random file name to save the results in a file
function randomFileName() {
  var randomString = require('random-string');
  var seconds      = new Date().getTime();

  return(randomString({length: 50}) + seconds + ".json");
}
