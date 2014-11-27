var Promise = require('promise');
var mongo = require('mongoskin');
var db = mongo.db(process.env.MONGODB_URL);

db.bind('episodes');

/**
 * @class Episodes
 */

module.exports = function() {
    this.default = {
        _id: '',
        name: '',
        description: ''
    };
    /**
     *
     * @param params
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
     *
     * @param document
     * @returns {Promise}
     */
    this.create = function(document) {
        if(!this.validate(document)) {
            throw 'Invalid document provided';
        }
        return new Promise(function(resolve, reject) {
            db.episodes.insert(document, function(err, obj) {
                if(err) {
                    if(err.code = 11000) {
                        reject({ code: 409, err: err, message: 'Duplicate ID' })
                    }
                    reject(err);
                } else {
                    resolve(obj);
                }
                
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
        var self = this;
        $set = ($set === undefined ? false : $set);
        if(!this.validate(document) && !$set) {
            throw 'Invalid document provided';
        }
        return new Promise(function(resolve, reject) {
            db.episodes.updateById(id, document, function(err, success, result) {
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
     * @param id
     * @returns {Promise}
     */
    this.remove = function(id) {
        return new Promise(function(resolve, reject) {
            db.episodes.removeById(id, function(err, success, result) {
                if(err) {
                    reject(err);
                } else if(success) {
                    resolve(result);
                } else {
                    reject({ code: 404, message: 'No document found to delete' });
                }
                
            });
        });
    };
    this.validate = function(document) {
        if(!document._id && document.slug) {
            document._id = document.slug;
        }
        if(document.name && document._id) {
            return true;
        }
        return false;
    };
};