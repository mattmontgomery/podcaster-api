var Promise = require('promise');
var mongo = require('mongoskin');
var db = mongo.db(process.env.MONGODB_URL);

db.bind('episodes');

var Podcasts = require('./podcasts'),
    podcasts = new Podcasts();


/**
 * @class Episodes
 */

module.exports = function() {
    this.default = {
        _id: '',
        title: '',
        description: '',
        filename: ''
    };
    /**
     *
     * @param podcastId
     * @returns {Promise}
     */
    this.getAll = function(podcastId) {
        var params = { podcast_id: podcastId };
        return new Promise(function(resolve, reject) {
            db.episodes.find(params).toArray(function(err, items) {
                if(err) {
                    reject({ code: 500, err: err, message: 'Could not find episodes'});
                } else {
                    resolve(items);
                }
                
            });
        });
    };
    /**
     *
     * @param id
     * @returns {Promise}
     */
    this.getSingle = function(id) {
        return new Promise(function(resolve, reject) {
            db.episodes.findById(id, function(err, item) {
                if(!item) {
                    reject({ code: 404, message: 'Could not find episode'});
                } else if (err) {
                    reject(err);
                } else {
                    resolve(item);
                }
                
            });
        });
    };

    /**
     * @param podcastId
     * @param id
     * @returns {Promise}
     */
    this.getSingleFromPodcast = function(podcastId, id) {
        var params = { podcast_id: podcastId, _id: mongo.helper.toObjectID(id) };
        return new Promise(function(resolve, reject) {
            db.episodes.findOne(params, function(err, item) {
                if(!item) {
                    reject({ code: 404, message: 'Could not find episode'});
                } else if (err) {
                    reject(err);
                } else {
                    resolve(item);
                }

            });
        });
    };
    /**
     *
     * @param document
     * @returns {Promise}
     */
    this.create = function(document) {
        var self = this;
        if(!this.validate(document)) {
            console.log(document);
            throw 'Invalid document provided';
        }
        return new Promise(function(resolve, reject) {
            podcasts.getSingle(document.podcast_id).then(function(obj) {
                db.episodes.insert(document, function(err, obj) {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(obj);
                    }
                });
            }, function(err) {
                reject({ err: err })
            });
        });
    };
    /**
     *
     * @param id
     * @param document
     * @param $set
     * @returns {Promise}
     */
    this.update = function(id, document, $set) {
        if(!this.validate(document) && !$set) {
            throw 'Invalid document provided';
        }
        var self = this;
        var params = { podcast_id: document.podcast_id, _id: mongo.helper.toObjectID(id) };
        $set = ($set === undefined ? false : $set);
        return new Promise(function(resolve, reject) {
            db.episodes.update(params, document, function(err, success, result) {
                if(err) {
                    reject({ err: err });
                } else if(success) {
                    self.getSingle(id).then(function(obj) {
                        resolve(obj);
                    }, function(err) {
                        reject({ err: err })
                    });
                } else {
                    reject();
                }
                
            });
        });
    };
    /**
     *
     * @param podcastId
     * @param id
     * @returns {Promise}
     */
    this.remove = function(podcastId, id) {
        var params = { podcast_id: podcastId, _id: mongo.helper.toObjectID(id) };
        console.log(params);
        return new Promise(function(resolve, reject) {
            db.episodes.remove(params, function(err, success, result) {
                if(err) {
                    reject(err);
                } else if(success) {
                    resolve({status: 'deleted'});
                } else {
                    reject({ code: 404, message: 'No document found to delete' });
                }

            });
        });
    };
    this.validate = function(document) {
        if(document.title && document.podcast_id && document.file) {
            return true;
        }
        return false;
    };
};