var gulp       = require( 'gulp' ),
    server     = require( 'gulp-develop-server' ),
    shell      = require( 'gulp-shell'),
    livereload = require( 'gulp-livereload' );


var options = {
    path: './app/app.js',
    mongoData: './data/mongo'
};

gulp.task( 'server:start', function() {
    server.listen( options, livereload.listen );
});

// If server scripts change, restart the server and then livereload.
gulp.task( 'default', [ 'server:start' ], function() {
    function restart( file ) {
        server.changed( function( error ) {
            if( ! error ) livereload.changed( file.path );
        });
    }

    gulp.watch( [ './app/*.js' ] ).on( 'change', restart );
});