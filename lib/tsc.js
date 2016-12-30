var exec = require('child_process').exec;
var chalk = require('chalk');

module.exports = tsc;

function tsc(fn) {

    var commands = 'dir *.ts /b /s > ts-files.txt & tsc @ts-files.txt & del ts-files.txt';

    var child = exec(commands,
        function (error, stdout, stderr) {
            if(stdout !== null) console.log(chalk.yellow(stdout));
            if(stderr !== null) console.log(chalk.red(stderr));
            if (error !== null) {
                console.log(chalk.red('exec error: ' + error));
            }
            else {
                fn();
            }

        });
}