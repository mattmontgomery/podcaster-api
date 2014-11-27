var dotenv = require('dotenv');
dotenv.load();

var restify = require('restify');

var Podcasts = require('./podcasts'),
    podcasts = new Podcasts();

var Episodes = require('./episodes'),
    episodes = new Episodes();

var server = restify.createServer({
    name: "podcaster",
    version: "0.0.0"
});
server.use(restify.queryParser());
server.use(restify.bodyParser({ mapParams: false })); // mapped in req.body

server.listen(8888);

parseBody = function(str) {
    return JSON.parse(str);
};

/** PODCASTS */

/** Get all podcasts */
server.get('/podcasts', function(req, res, next) {
    podcasts.get().then(function(items) {
        res.send(200, items );
        return next();
    });
});

/** Create a podcast */
server.post('/podcasts', function(req, res, next) {
    podcasts.create(parseBody(req.body)).then(function(result) {
        res.send( 201 , result );
        return next();
    }, function(err) {
        var code = err.code ? err.code : 500;
        res.send( code , err );
    });
});

/** Get one podcast */
server.get('/podcasts/:id', function(req, res, next) {
    podcasts.getSingle(req.params.id).then(function(item) {
        res.send( 200, item );
        return next();
    }, function(err) {
        var code = err.code ? err.code : 500;
        res.send( code, err );
    });
});

/** Update one podcast */
server.put('/podcasts/:id', function(req, res, next) {
    podcasts.update(req.params.id, parseBody(req.body)).then(function(result) {
        res.send( 200 , result );
        return next();
    }, function(err) {
        res.send( 500, err );
    });
});

/** Patch one podcast */
server.patch('/podcasts/:id', function(req, res, next) {
    var body = { "$set": parseBody(req.body) };
    podcasts.update(req.params.id, body, true).then(function(result) {
        res.send( 200 , result );
        return next();
    }, function(err) {
        res.send( 500, err );
    });
});

/** Delete one podcast */
server.del('/podcasts/:id', function(req, res, next) {
    podcasts.remove(req.params.id).then(function(result) {
        res.send( 200, result );
        return next();
    }, function(err) {
        var code = err.code ? err.code : 500;
        res.send( code , err );
    });
});

/** EPISODES */


/** Get one podcast's episodes */
server.get('/podcasts/:id/episodes', function(req, res, next) {
    episodes.getAll(req.params.id).then(function(items) {
        res.send( 200, items );
        return next();
    }, function(err) {
        var code = err.code ? err.code : 500;
        res.send( code, err );
    });
});

/** Get one episode from one podcast */
server.get('/podcasts/:id/episodes/:episodeId', function(req, res, next) {
    episodes.getSingleFromPodcast(req.params.id, req.params.episodeId).then(function(item) {
        res.send( 200, item );
        return next();
    }, function(err) {
        var code = err.code ? err.code : 500;
        res.send( code, err );
    });
});

/** Update one episode from one podcast */
server.put('/podcasts/:id/episodes/:episodeId', function(req, res, next) {
    var body = parseBody(req.body);
    body.podcast_id = req.params.id;
    episodes.update(req.params.episodeId, body).then(function(result) {
        res.send( 200, result );
        return next();
    }, function(err) {
        var code = err.code ? err.code : 500;
        res.send( code , err );
    });
});

/** Patch one episode from one podcast */
server.patch('/podcasts/:id/episodes/:episodeId', function(req, res, next) {
    var body = parseBody(req.body);
    body.podcast_id = req.params.id;
    episodes.update(req.params.episodeId, body, true).then(function(result) {
        res.send( 200, result );
        return next();
    }, function(err) {
        var code = err.code ? err.code : 500;
        res.send( code , err );
    });
});

/** Delete one episode from one podcast */
server.del('/podcasts/:id/episodes/:episodeId', function(req, res, next) {
    episodes.remove(req.params.id, req.params.episodeId).then(function(result) {
        res.send( 200, result );
        return next();
    }, function(err) {
        var code = err.code ? err.code : 500;
        res.send( code , err );
    });

});

/** Add one episode to one podcast */
server.post('/podcasts/:id/episodes', function(req, res, next) {
    var body = parseBody(req.body);
    body.podcast_id = req.params.id;
    episodes.create(body).then(function(items) {
        res.send( 200, items );
        return next();
    }, function(err) {
        var code = err.code ? err.code : 500;
        res.send( code, err );
    });
});

