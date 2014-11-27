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

server.get('/podcasts', function(req, res, next) {
    podcasts.get().then(function(items) {
        res.send(200, items );
        return next();
    });
});
server.post('/podcasts', function(req, res, next) {
    podcasts.create(parseBody(req.body)).then(function(result) {
        res.send( 201 , result );
        return next();
    }, function(err) {
        var code = err.code ? err.code : 500;
        res.send( code , err );
    });
});
server.get('/podcasts/:id/episodes', function(req, res, next) {
    episodes.getAll(req.params.id).then(function(items) {
        res.send( 200, items );
        return next();
    }, function(err) {
        var code = err.code ? err.code : 500;
        res.send( code, err );
    });
});
server.get('/podcasts/:id', function(req, res, next) {
    podcasts.getSingle(req.params.id).then(function(item) {
        res.send( 200, item );
        return next();
    }, function(err) {
        var code = err.code ? err.code : 500;
        res.send( code, err );
    });
});
server.put('/podcasts/:id', function(req, res, next) {
    var body = parseBody(req.body);
    podcasts.update(req.params.id, body).then(function(result) {
        res.send( 200 , result );
        return next();
    }, function(err) {
        res.send( 500, err );
    });
});
server.patch('/podcasts/:id', function(req, res, next) {
    var body = { "$set": parseBody(req.body) };
    podcasts.update(req.params.id, body, true).then(function(result) {
        res.send( 200 , result );
        return next();
    }, function(err) {
        res.send( 500, err );
    });
});
server.del('/podcasts/:id', function(req, res, next) {
    podcasts.remove(req.params.id).then(function(result) {
        res.send( 200, result );
        return next();
    }, function(err) {
        var code = err.code ? err.code : 500;
        res.send( code , err );
    });

});
server.get('/podcasts/:id/episodes', function(req, res, next) {

});
server.get('/podcasts/:id/episodes/:episodeId', function(req, res, next) {

});
