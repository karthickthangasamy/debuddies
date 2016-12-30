var Download = require("download");
var gitclone = require("git-clone");
var rm = require("rimraf").sync;

module.exports = download;

function download(repo, dest, options, fn) {
    if (typeof options === "function") {
        fn = options;
        options = null;
    }
    options = options || {};
    var clone = options.clone || false;

    repo = normalizeURL(repo);
    var url = getUrl(repo, clone);
    if (clone) {
        gitclone(url, dest, {
            checkout: repo.checkout
        }, function (err) {
            if (err === undefined) {
                rm(dest + "/.git");
                fn();
            } else {
                fn(err);
            }
        });
    } else {
        var dl = Download(url, dest, {
            extract: true,
            strip: 1
        });

        dl.on('error', function (err) {
            fn(err);
        });
        dl.on('end', function(){
            fn();
        });
        dl.on('close', function () {
            fn();
        });
    }
}

function normalizeURL(repo) {
    var regex = /^((github|gitlab|bitbucket):)?((.+):)?([^/]+)\/([^#]+)(#(.+))?$/;
    var match = regex.exec(repo);
    var type = match[2] || "github";
    var host = match[4] || null;
    var owner = match[5];
    var name = match[6];
    var checkout = match[8] || "master";

    if (host == null) {
        host = "github.com";
    }

    return {
        type: type,
        host: host,
        owner: owner,
        name: name,
        checkout: checkout
    };
}


function getUrl(repo, clone) {
    var url;

    if (repo.type === "github")
        url = github(repo, clone);
    else
        url = github(repo, clone);

    return url;
}


function github(repo, clone) {
    var url;

    if (clone)
        url = "git@" + repo.host + ":" + repo.owner + "/" + repo.name + ".git";
    else
        url = "https://" + repo.host + "/" + repo.owner + "/" + repo.name + "/archive/" + repo.checkout + ".zip";

    return url;
}