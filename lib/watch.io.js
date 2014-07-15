// # WatchIO Module
//

/* Module references */
var EventEmitter = require('events').EventEmitter,
    FS = require('fs'),
    Path = require('path'),
    Util = require('util')
;

/* Local constants */

/* Local variables */
var TYPE_NUMBER = 'number',
    TYPE_UNDEFINED = 'undefined',
    EVENT_CHANGE = 'change',
    EVENT_CREATE = 'create',
    EVENT_UPDATE = 'update',
    EVENT_REMOVE = 'remove',
    EVENT_REFRESH = 'refresh',
    EVENT_ERROR = 'error'
;

/* Function definitions */

// WatchIO module
function WatchIO( options ) {

    EventEmitter.call( this );

    this._options = {};
    this._itemlist = {};
    this._watchings = {};
    this._checkings = {};
    this._timeouts = {};

    if ( options &&
        typeof options.delay === TYPE_NUMBER &&
        options.delay > 0
    ) {
        this._options.delay = options.delay;

    } else {
        this._options.delay = 100;
    }

}

// Inherits with EventEmitter
Util.inherits( WatchIO, EventEmitter );

// Watch directory/file recursively
function watch( target ) {

    target = Path.resolve( target );

    var self = this,
        options = this._options,
        stat = FS.statSync( target ),
        isdir = stat.isDirectory()
    ;

    this._itemlist[ target ] = stat;

    if ( ! this._watchings[ target ]) {
        var fsWatcher = null;

        fsWatcher = FS.watch( target, function ( event, name ) {

            var filepath = ( isdir ?
                    target + Path.sep + name :
                    target
                )
            ;

            if ( self._checkings[ filepath ] &&
                options.delay
            ) {
                return;

            } else {
                self._checkings[ filepath ] = true;
            }

            self.notify( filepath );

            if ( options.delay ) {
                // delay receiving watch messages for preventing multiple notifies in a short time
                self._timeouts[ filepath ] = setTimeout(function () {
                    self._checkings[ filepath ] = false;
                }, options.delay );
            }

        });

        fsWatcher.on('error', function ( err ) {
            self.emit( EVENT_ERROR, err, target );
        });

        this._watchings[ target ] = fsWatcher;
    }

    if ( isdir ) {
        var files = FS.readdirSync( target ),
            i = files.length,
            filepath,
            filestat
        ;

        while ( i-- ) {
            filepath = target + Path.sep + files[i];
            filestat = FS.statSync( filepath );

            if ( typeof this._itemlist[ filepath ] !== TYPE_UNDEFINED ) {
                this.emit( EVENT_CHANGE, EVENT_REFRESH, filepath, filestat );
                this.emit( EVENT_REFRESH, filepath, filestat );

            } else {
                this.emit( EVENT_CHANGE, EVENT_CREATE, filepath, filestat );
                this.emit( EVENT_CREATE, filepath, filestat );
            }

            this._itemlist[ filepath ] = filestat;

            this.watch( filepath );
        }
    }

}

// Check the stat of the file/folder entry
function notify( filepath ) {

    var oldStat = this._itemlist[ filepath ],
        newStat = null
    ;

    if ( FS.existsSync( filepath )) {
        newStat = FS.statSync( filepath );

        if ( newStat.isDirectory() ) {
            this.watch( filepath );
        }

        if ( typeof oldStat !== TYPE_UNDEFINED ) {
            this.emit( EVENT_CHANGE, EVENT_UPDATE, filepath, newStat );
            this.emit( EVENT_UPDATE, filepath, newStat );

        } else {
            this.emit( EVENT_CHANGE, EVENT_CREATE, filepath, newStat );
            this.emit( EVENT_CREATE, filepath, newStat );
        }

        this._itemlist[ filepath ] = newStat;

    } else if ( oldStat ) {
        this.emit( EVENT_CHANGE, EVENT_REMOVE, filepath, oldStat );
        this.emit( EVENT_REMOVE, filepath, oldStat );

        clearTimeout( this._timeouts[ filepath ]);
        this.close( filepath );
    }

}

// Stop watching a specific file/folder
function close( filepath ) {

    if ( this._watchings[ filepath ] ) {
        this._watchings[ filepath ].close();
        this._watchings[ filepath ] = undefined;
        this._checkings[ filepath ] = false;
        this._itemlist[ filepath ] = undefined;
    }

}

/* Module exports */

WatchIO.prototype.watch = watch;
WatchIO.prototype.notify = notify;
WatchIO.prototype.close = close;

module.exports = WatchIO;

/* Main procedure */
