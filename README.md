Watch.IO
========

[![NPM version](https://img.shields.io/npm/v/watch.io.svg?style=flat-square)](https://www.npmjs.org/package/watch.io)
[![Build status](https://secure.travis-ci.org/DJ-NotYet/watch.io.png?branch=master)](https://travis-ci.org/DJ-NotYet/watch.io)

An event wrapper for fs.watch(), with support for recursive directories.


Caution
-------

The `fs.watch()` API is not 100% consistent across platforms,
and is unavailable and less reliable in some situations.

Due to the behavior of `fs.watch()`, if you want to read the updated file content
in the event listener, please delay a few milliseconds manually.


Installation
------------

```bash
npm install watch.io
```


Quickstart
----------

The `WatchIO` object inherits `events.EventEmitter`, so use it in an event-style.

```javascript
var WatchIO = require('watch.io'),
    watcher = new WatchIO()
;

// Watch a folder recursively
watcher.watch('/path/to/folder');

// Listen on file creation
watcher.on('create', function ( file, stat ) {
    // expect( file ).to.be.a('string');
    // expect( stat ).to.be.a( fs.Stats );
});

// Listen on file updating
watcher.on('update', function ( file, stat ) {
    // expect( file ).to.be.a('string');
    // expect( stat ).to.be.a( fs.Stats );
});

// Listen on file removal
watcher.on('remove', function ( file, stat ) {
    // expect( file ).to.be.a('string');
    // expect( stat ).to.be.a( fs.Stats );
});

// Listen on file refreshment
// The `refresh` event emits when the WatchIO scans a folder
// which usually occur by calling the `.watch(path)` function
watcher.on('refresh', function ( file, stat ) {
    // expect( file ).to.be.a('string');
    // expect( stat ).to.be.a( fs.Stats );
});

// Listen on whatever the file changes
// the `type` parameter can be any one of: 'create', 'update', 'remove', 'refresh'
watcher.on('change', function ( type, file, stat ) {
    // expect( type ).to.be.a('string');
    // expect( file ).to.be.a('string');
    // expect( stat ).to.be.a( fs.Stats );
});

// Listen on whatever the fs.FSWatcher throws an error
// the `err` parameter is the same as the one from 'error' event of fs.FSWatcher
watcher.on('error', function ( err, file ) {
    // expect( err ).to.be.an( Error );
    // expect( file ).to.be.a('string');
});

// Stop watching the folder/file
watcher.close('/path/to/folder');
```

Removing event listeners is the same as the way in `events.EventEmitter` of node.js.

```javascript
// As:
watcher.removeAllListeners('create');
watcher.removeAllListeners('update');
watcher.removeAllListeners('remove');
watcher.removeAllListeners('refresh');
watcher.removeAllListeners('change');
watcher.removeAllListeners('error');
// Or:
watcher.removeAllListeners();
```


Options
-------

Initialize WatchIO object with config:

```javascript
var WatchIO = require('watch.io'),
    watcher = new WatchIO({
        delay: 100
    })
;
```

Options:

* `delay` *number* Delay time(ms) for suppress duplicated notify messages from fs.watch(),
defaults to 100(ms), set to 0 to disable it.


Windows-platform Issues
-----------------------

Due to the behavior of the underlying API,
there have some issues still suck on Windows platform.

* Removing folders will emit an 'EPERM' error.
  No solutions so far.

* Creating folders manually on Windows, sometimes emit an uncaught 'EBUSY' error.
  This can be fixed by setting a delay milliseconds longer than 100ms in the Watch.IO options.

We strongly recommend to use the Watch.IO in the Linux platform or other UNIX-like things.
Or you can try
[chokidar](https://www.npmjs.org/package/chokidar)
or
[watch](https://www.npmjs.org/package/watch)


License
-------

(The Apache License 2.0)

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
