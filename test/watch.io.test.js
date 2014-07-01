// watch.io.test.js
//

var FSX = require('fs-extra'),
    Path = require('path'),
    expect = require('expect.js'),
    WatchIO = require('..')
;

var basePath = __dirname + '/testing/',
    testPath1 = basePath + 'test1/',
    testPath2 = basePath + 'test2/'
;

// TEST CASE: Watch.IO
describe('Watch.IO', function () {

    before(function () {

        FSX.removeSync( basePath );
        FSX.mkdirSync( basePath );

    });

    describe('Test.1 watch on a folder in plain structure', function () {

        before(function () {

            FSX.mkdirSync( testPath1 );

        });

        it('listen for file creation', function ( done ) {

            var testFolder = testPath1 + 'test.1',
                testFile = testFolder + '/testfile',
                watcher = new WatchIO(),
                count = 0
            ;

            FSX.mkdirSync( testFolder );
            watcher.watch( testFolder );

            watcher.on('change', function ( type, file, stat ) {

                expect( type ).to.be.a('string');
                expect( file ).to.be.a('string');
                expect( stat ).to.be.a( FSX.Stats );

                expect( type ).to.be('create');
                expect( file ).to.be( testFile );
                expect( stat.isDirectory() ).to.be( false );

                if ( ++count >= 2 ) {
                    watcher.removeAllListeners();
                    done();
                }

            });

            watcher.on('create', function ( file, stat ) {

                expect( file ).to.be.a('string');
                expect( stat ).to.be.a( FSX.Stats );

                expect( file ).to.be( testFile );
                expect( stat.isDirectory() ).to.be( false );

                if ( ++count >= 2 ) {
                    watcher.removeAllListeners();
                    done();
                }

            });

            FSX.writeFile( testFile, 'abc' );

        });

        it('listen for file updating', function ( done ) {

            var testFolder = testPath1 + 'test.2',
                testFile = testFolder + '/testfile',
                watcher = new WatchIO(),
                count = 0
            ;

            FSX.mkdirSync( testFolder );
            FSX.writeFileSync( testFile, 'abc' );
            watcher.watch( testFolder );

            watcher.on('change', function ( type, file, stat ) {

                expect( type ).to.be.a('string');
                expect( file ).to.be.a('string');
                expect( stat ).to.be.a( FSX.Stats );

                expect( type ).to.be('update');
                expect( file ).to.be( testFile );
                expect( stat.isDirectory() ).to.be( false );

                if ( ++count >= 2 ) {
                    watcher.removeAllListeners();
                    done();
                }

            });

            watcher.on('update', function ( file, stat ) {

                expect( file ).to.be.a('string');
                expect( stat ).to.be.a( FSX.Stats );

                expect( file ).to.be( testFile );
                expect( stat.isDirectory() ).to.be( false );

                if ( ++count >= 2 ) {
                    watcher.removeAllListeners();
                    done();
                }

            });

            FSX.writeFile( testFile, 'abc' );

        });

        it('listen for file removal', function ( done ) {

            var testFolder = testPath1 + 'test.3',
                testFile = testFolder + '/testfile',
                watcher = new WatchIO(),
                count = 0
            ;

            FSX.mkdirSync( testFolder );
            FSX.writeFileSync( testFile, 'abc' );
            watcher.watch( testFolder );

            watcher.on('change', function ( type, file, stat ) {
                expect( type ).to.be.a('string');
                expect( file ).to.be.a('string');
                expect( stat ).to.be.a( FSX.Stats );

                expect( type ).to.be('remove');
                expect( file ).to.be( testFile );
                expect( stat.isDirectory() ).to.be( false );

                if ( ++count >= 2 ) {
                    watcher.removeAllListeners();
                    done();
                }
            });

            watcher.on('remove', function ( file, stat ) {
                expect( file ).to.be.a('string');
                expect( stat ).to.be.a( FSX.Stats );

                expect( file ).to.be( testFile );
                expect( stat.isDirectory() ).to.be(false);

                if ( ++count >= 2 ) {
                    watcher.removeAllListeners();
                    done();
                }
            });

            FSX.unlink( testFile );

        });

    });

    describe('Test.2 watch a recursive folder-structure', function () {

        before(function () {

            FSX.mkdirSync( testPath2 );

        });

        it('listen for file creation', function ( done ) {

            var testFolder = testPath2 + 'test.1',
                testFile = testFolder + '/subfolder/testfile',
                watcher = new WatchIO(),
                count = 0
            ;

            FSX.mkdirpSync( Path.dirname( testFile ));
            watcher.watch( testFolder );

            watcher.on('change', function ( type, file, stat ) {
                expect( type ).to.be.a('string');
                expect( file ).to.be.a('string');
                expect( stat ).to.be.a( FSX.Stats );

                expect( type ).to.be('create');
                expect( file ).to.be( testFile );
                expect( stat.isDirectory() ).to.be( false );

                if ( ++count >= 2 ) {
                    watcher.removeAllListeners();
                    done();
                }
            });

            watcher.on('create', function ( file, stat ) {
                expect( file ).to.be.a('string');
                expect( stat ).to.be.a( FSX.Stats );

                expect( file ).to.be( testFile );
                expect( stat.isDirectory() ).to.be( false );

                if ( ++count >= 2 ) {
                    watcher.removeAllListeners();
                    done();
                }
            });

            FSX.writeFile( testFile, 'abc' );

        });

        it('listen for file updating', function ( done ) {

            var testFolder = testPath2 + 'test.2',
                testFile = testFolder + '/subfolder/testfile',
                watcher = new WatchIO(),
                count = 0
            ;

            FSX.mkdirpSync( Path.dirname( testFile ));
            FSX.writeFileSync( testFile, 'abc' );
            watcher.watch( testFolder );

            watcher.on('change', function ( type, file, stat ) {
                expect( type ).to.be.a('string');
                expect( file ).to.be.a('string');
                expect( stat ).to.be.a( FSX.Stats );

                expect( type ).to.be('update');
                expect( file ).to.be( testFile );
                expect( stat.isDirectory() ).to.be( false );

                if ( ++count >= 2 ) {
                    watcher.removeAllListeners();
                    done();
                }
            });

            watcher.on('update', function ( file, stat ) {
                expect( file ).to.be.a('string');
                expect( stat ).to.be.a( FSX.Stats );

                expect( file ).to.be( testFile );
                expect( stat.isDirectory() ).to.be( false );

                if ( ++count >= 2 ) {
                    watcher.removeAllListeners();
                    done();
                }
            });

            FSX.writeFile( testFile, 'abc' );

        });

        it('listen for file removal', function ( done ) {

            var testFolder = testPath2 + 'test.3',
                testFile = testFolder + '/subfolder/testfile',
                watcher = new WatchIO(),
                count = 0
            ;

            FSX.mkdirpSync( Path.dirname( testFile ));
            FSX.writeFileSync( testFile, 'abc' );
            watcher.watch( testFolder );

            watcher.on('change', function ( type, file, stat ) {
                expect( type ).to.be.a('string');
                expect( file ).to.be.a('string');
                expect( stat ).to.be.a( FSX.Stats );

                expect( type ).to.be('remove');
                expect( file ).to.be( testFile );
                expect( stat.isDirectory() ).to.be( false );

                if ( ++count >= 2 ) {
                    watcher.removeAllListeners();
                    done();
                }
            });

            watcher.on('remove', function ( file, stat ) {
                expect( file ).to.be.a('string');
                expect( stat ).to.be.a( FSX.Stats );

                expect( file ).to.be( testFile );
                expect( stat.isDirectory() ).to.be( false );

                if ( ++count >= 2 ) {
                    watcher.removeAllListeners();
                    done();
                }
            });

            FSX.unlink( testFile );

        });

    });

    after(function () {

        FSX.removeSync( basePath );

    });

});
