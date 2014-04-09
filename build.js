// # Bulid script for Watch.IO

var fs = require("fs"),
    path = require("path"),
    basePath = path.normalize(__dirname + "/"),
    WatchIO = require("./lib/watch.io.js"),
    version = WatchIO.version;

fs.writeFileSync(
    basePath + "package.json",
    fs.readFileSync(basePath + "package.json", "UTF-8")
        .replace(
            /"[0-9]+\.[0-9]+\.[0-9]+"/,
            "\"" + version + "\""
        ),
    "UTF-8"
);

fs.writeFileSync(basePath + "VERSION", version, "UTF-8");

console.log("Built with " + version);
