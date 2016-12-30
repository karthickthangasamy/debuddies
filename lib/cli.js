var fs = require('fs');
var rm = require("rimraf").sync;
var chalk = require('chalk');
var figlet = require('figlet');
var download = require('./download');
var serve = require('./serve');
var tsc = require('./tsc');

exports.init = init;


Array.prototype.customIndexOf = function (search, fromIndex) {
    return this.map(function (value) {
        return value.toLowerCase();
    }).indexOf(search.toLowerCase(), fromIndex);
};

function processArgs() {
    var args = {};

    for (var index = 0; index < process.argv.length; index++) {
        var re = new RegExp('--([A-Za-z0-9_]+)=([A/-Za-z0-9_]+)'),
            matches = re.exec(process.argv[index]);

        if (matches !== null) {
            args[matches[1]] = matches[2];
        }
    }
    return args;
}

global.create = function (options) {
    console.log(chalk.yellow('Creating ' + options.app + ' application...'));
    download(options.baseUrl + options.app, "./", {}, function (err) {
        if (err) {
            console.log(chalk.red('Unable to download.' + err));
        } else {
            console.log(chalk.green(options.app + ' application created successfully.'));
        }
    });
}
global.serve = function (options) {
    if (options.tsc == 'true') {
        console.log(chalk.green('Compiling typescript files.'));
        tsc(function () {
            console.log(chalk.green('Typescript compilation completed.'));
            serve(options);
        });
    } else
        serve(options);
}

global.help = function () {
    console.log(
        chalk.yellow(
            figlet.textSync('ej-cli', {
                horizontalLayout: 'full'
            })
        )
    );
    console.log(chalk.green(' Available commands: \n\n create - ej create <appName> - To create application \n serve - ej serve - To serve and launch application in browser'));

    console.log(chalk.yellow('\n\n Available templates : \n\n') + chalk.blue(' Syncfusion AngularJS - ej create <appName> - ngEmpty, ngButton, ngTab'));

    console.log(chalk.blue(' Syncfusion JavaScript - ej create <appName> - empty, button, tab'));
    console.log(chalk.blue(' Syncfusion KnockOut - ej create <appName> - koEmpty, koButton, koTab'));
    console.log(chalk.blue(' Syncfusion Typescript - ej create <appName> - tsEmpty, tsButton, tsTab'));
}

function init() {

    var opts = processArgs(),
        appName;

    this.options = {
        app: 'ngEmpty',
        port: opts.port || 8888,
        baseUrl: 'karthickthangasamy/',
        tsc: false || opts.tsc,
        availableSeed: ['ngEmpty', 'ngButton', 'ngTab', 'tsEmpty', 'tsTab', 'tsButton', 'empty', 'button', 'tab', 'koEmpty', 'koButton', 'koTab']
    }
    if (process.argv.length > 2) {
        command = (process.argv[2]).toString().trim();
        if (process.argv.length > 3) {
            appName = (process.argv[3]).toLowerCase().toString().trim();
            if (this.options.availableSeed.customIndexOf(appName) > -1)
                this.options.app = (process.argv[3]);
            else if (!(appName.indexOf("--") > -1)) {
                console.log(chalk.red("The template application '" + appName + "' is not availabe"));
                process.exit();
            }
        }
        if(command == '--help' || command == '-h')
            command = 'help';
        if (command && command in global && typeof global[command] == 'function')
            global[command](this.options);
    } else {
        global.help();
    }

}