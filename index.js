var fs = require('fs');
var http = require('http');
var spawn = require('child_process').spawn;
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain; charset=UTF-8'});
  res.write("--------------------------Creating Script-------------------------\n");
  	var url = require('url');
	var url_parts = url.parse(req.url, true);
	var camera_id = url_parts.query.id;
   	var url = '/process/create_script/'+camera_id;
	http.get({
        host: 'previewphoto.com',
        path: url
    }, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
           startProcessing(camera_id);
        });
    });
  	function startProcessing(camera_id)
	{
		fs.exists('/home/preview8/public_html/MovieHolder/'+camera_id+'.sh', function(exists) {
			if (exists) { 
		  		processing(camera_id);
		  	} 
		  	else
		  	{
		  		res.end('script couldn\'t be created on server');
		  	}
		});
		
	}

	function processing(camera_id)
	{
		res.write("--------------------------Executing Script-------------------------\n");
		var myREPL = spawn('bash', ['/home/preview8/public_html/MovieHolder/'+camera_id+'.sh']);

		process.stdin.pipe(myREPL.stdin);

		myREPL.stdin.on("end", function() {
			res.end("--------------------------Finished-------------------------\n");
		    myREPL.kill(0);
		});

		myREPL.stdout.on('data', function (data) {
			res.write(data+'');
		});

		myREPL.stderr.on('data', function (data) {
			res.write(data+"");
		});
	}

}).listen(10000, '198.1.124.230');
