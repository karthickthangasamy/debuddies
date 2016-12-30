var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    chalk = require("chalk"),
    open = require("./open");

module.exports = serve;

function serve(options) {
    port = +(options.port);
    function onRequest(request, response) {
        var uri = url.parse(request.url).pathname,
            filename = path.join(process.cwd(), uri);

        var contentTypesByExtension = {
            '.html': "text/html",
            '.css': "text/css",
            '.js': "text/javascript"
        };

        fs.exists(filename, function (exists) {
            if (!exists) {
                response.writeHead(404, {
                    "Content-Type": "text/plain"
                });
                response.write("404 Not Found\n");
                response.end();
                return;
            }

            if (fs.statSync(filename).isDirectory()) filename += '/index.html';
            fs.readFile(filename, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        "Content-Type": "text/plain"
                    });
                    response.write(err + "\n");
                    response.end();
                    return;
                }

                var headers = {};
                var contentType = contentTypesByExtension[path.extname(filename)];
                if (contentType) headers["Content-Type"] = contentType;
                response.writeHead(200, headers);
                response.write(file, "binary");
                response.end();
            });
        });
    }

    var server = http.createServer(onRequest).on('listening', function () {
        console.log(chalk.green('Static file server running on port ' + port + ' (i.e. http://localhost:' + port + ')\nCTRL + C to shut down'));
        open('http://localhost:' + port);
    }).on('error', function (e) {
        if (e && e.toString().indexOf('EADDRINUSE') !== -1) {
            port++;
            server.listen(port);
        } else {
            console.log(chalk.red('An error occured starting static file server: ' + e));
        }
    }).listen(port);
}