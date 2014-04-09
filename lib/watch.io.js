// # WatchIO Module
//
// WatchIO Definition
//

/******************************************************************************

  Watch.IO

  https://github.com/DJ-NotYet/watch.io

  Copyright (c) 2014, DJ-NotYet <dj.notyet@gmail.com>

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.

 *****************************************************************************/

/* Version info */
var _VERSION_ = "1.0.1";

/* Module references */
var EventEmitter = require("events").EventEmitter,
    fs = require("fs"),
    path = require("path"),
    util = require("util");

/* Local variables */
var TYPE_NUMBER = "number",
    TYPE_UNDEFINED = "undefined",
    EVENT_CHANGE = "change",
    EVENT_CREATE = "create",
    EVENT_UPDATE = "update",
    EVENT_REMOVE = "remove",
    EVENT_REFRESH = "refresh",
    EVENT_ERROR = "error";

/* WatchIO module */
function WatchIO(options) {

    EventEmitter.call(this);

    this._options = {};
    this._itemlist = {};
    this._watchings = {};
    this._checkings = {};
    this._timeouts = {};

    if (options && typeof options.delay === TYPE_NUMBER &&
        options.delay > 0) {

        this._options.delay = options.delay;

    } else {
        this._options.delay = 100;
    }

}

/* Inherits with EventEmitter */
util.inherits(WatchIO, EventEmitter);

/* Insert version info */
WatchIO.version = _VERSION_;

/* Watch directory/file recursively */
function watch(target) {

    target = path.resolve(target);

    var self = this,
        options = this._options,
        stat = fs.statSync(target),
        isdir = stat.isDirectory();

    this._itemlist[target] = stat;

    if (! this._watchings[target]) {
        var fsWatcher = null;

        fsWatcher = fs.watch(target, function (event, name) {
            var filepath = (isdir ?
                    target + path.sep + name :
                    target
                );

            if (self._checkings[filepath] &&
                options.delay) {

                return;

            } else {
                self._checkings[filepath] = true;
            }

            self.notify(filepath);

            if (options.delay) {
                // delay receiving watch messages for preventing multiple notifies in a short time
                self._timeouts[filepath] = setTimeout(function () {
                    self._checkings[filepath] = false;
                }, options.delay);
            }
        });

        fsWatcher.on("error", function (err) {
            self.emit(EVENT_ERROR, err, target);
        });

        this._watchings[target] = fsWatcher;
    }

    if (isdir) {
        var files = fs.readdirSync(target),
            filepath,
            filestat;

        for (var i = 0; i < files.length; i++) {
            filepath = target + path.sep + files[i];
            filestat = fs.statSync(filepath);

            if (typeof this._itemlist[filepath] !== TYPE_UNDEFINED) {
                this.emit(EVENT_CHANGE, EVENT_REFRESH, filepath, filestat);
                this.emit(EVENT_REFRESH, filepath, filestat);

            } else {
                this.emit(EVENT_CHANGE, EVENT_CREATE, filepath, filestat);
                this.emit(EVENT_CREATE, filepath, filestat);
            }

            this._itemlist[filepath] = filestat;

            this.watch(filepath);
        }
    }

}

/* Check the stat of the file/folder entry */
function notify(filepath) {

    var oldStat = this._itemlist[filepath],
        newStat;

    if (fs.existsSync(filepath)) {
        newStat = fs.statSync(filepath);

        if (newStat.isDirectory()) {
            this.watch(filepath);
        }

        if (typeof oldStat !== TYPE_UNDEFINED) {
            this.emit(EVENT_CHANGE, EVENT_UPDATE, filepath, newStat);
            this.emit(EVENT_UPDATE, filepath, newStat);

        } else {
            this.emit(EVENT_CHANGE, EVENT_CREATE, filepath, newStat);
            this.emit(EVENT_CREATE, filepath, newStat);
        }

        this._itemlist[filepath] = newStat;

    } else if (oldStat) {
        this.emit(EVENT_CHANGE, EVENT_REMOVE, filepath, oldStat);
        this.emit(EVENT_REMOVE, filepath, oldStat);

        clearTimeout(this._timeouts[filepath]);
        this.close(filepath);
    }

}

/* Stop watching a specific file/folder */
function close(filepath) {

    if ( this._watchings[filepath] ) {
        this._watchings[filepath].close();
        this._watchings[filepath] = undefined;
        this._checkings[filepath] = false;
        this._itemlist[filepath] = undefined;
    }

}

/* Setup methods for the WatchIO */
WatchIO.prototype.watch = watch;
WatchIO.prototype.notify = notify;
WatchIO.prototype.close = close;

/* Export the WatchIO module */
module.exports = WatchIO;
