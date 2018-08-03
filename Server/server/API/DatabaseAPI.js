var Database = require('./../Models/Database.js');
var Project = require('./../Models/Project.js');
var Candidate = require('./../Models/Candidate.js');
var constants = require('./../Constants/Constants.js');
var commonFunctions = require('./../Common/CommonFunctions.js');
var redisCache = require('./../public/Cache.js');
var log4js = require('log4js');
log4js.configure('./log4js.json');
var logger = log4js.getLogger('rms-appender');

let databaseGetAll = (req, res) => {
    redisCache.wrap(constants.DATABASEGETALL_CACHEKEY, function (cacheCb) {
        Database.find({ IsDelete: false }, cacheCb).sort({ 'DatabaseName': 1 });
    }, commonFunctions.responder(res));
};

let databaseGetById = (req, res) => {
    let id = req.params.id;
    var cacheKey = constants.DATABASE_CACHEKEY + id;
    redisCache.wrap(cacheKey, function (cacheCb) {
        Database.findOne({ _id: id }, cacheCb);
    }, commonFunctions.responder(res));
};

let databaseActiveGetAll = (req, res) => {
    redisCache.wrap(constants.DATABASEACTIVEGETALL_CACHEKEY, function (cacheCb) {
        Database.find({ IsActive: true, IsDelete: false }, cacheCb).sort({ 'DatabaseName': 1 });
    }, commonFunctions.responder(res));
};

let databaseInsert = (req, res) => {
    var databaseSchema = new Database({
        DatabaseName: req.body.DatabaseName,
        IsActive: req.body.IsActive,
        IsDelete: false
    });

    Database.find({ DatabaseName: req.body.DatabaseName, _id: { $ne: req.body._id }, IsDelete: false }, function(err, data) {
        if (data.length != 0) {
            response = { data: data, 'message' : constants.CONFLICT };
            res.send(response);
        }
        else {
            databaseSchema.save(function(err) {
                if(err) {
                    res.send(err);
                    logger.error(err.message);
                }
                else {
                    Database.find({ IsDelete: false }, function(err, data) {
                        if(err) {
                            res.send(err);
                            logger.error(err.message);
                        }

                        redisCache.set(constants.DATABASEGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                              if (err) {
                                  res.send(err);
                                  logger.error(err + '-' + constants.DATABASE_INSERT);
                                  throw err;
                              }

                              redisCache.set(constants.DATABASEACTIVEGETALL_CACHEKEY, data.filter(x=>x.IsActive == true), {ttl: 1}, function(err) {
                                  if (err) {
                                      res.send(err);
                                      logger.error(err +  '-' + constants.DATABASE_INSERT);
                                      throw err;
                                  }
                              });
                        });

                        response = { data: data, 'message' : constants.OK };
                        res.json(response);
                    }).sort({ 'DatabaseName': 1 });
                }
            });
        }
    });
};

let databaseUpdate = (req, res) => {
    Database.find({ DatabaseName: req.body.DatabaseName, _id:{ $ne: req.body._id }, IsDelete: false }, function(err, data) {
      if(err)
       {
         response = { data: data, errors : err, 'message' : constants.RECORD_NOT_FOUND, status : 404 };
         res.send(response);
       }
       else if (data.length != 0) {
           response = { data: data, errors : err, 'message' : constants.CONFLICT, status : 409 };
           res.send(response);
       }
        else {
            Database.update({ _id: req.body._id }, { $set: { DatabaseName: req.body.DatabaseName, IsActive: req.body.IsActive, IsDelete: req.body.IsDelete } }, { runValidators: true },
                function(err,data) {
                    if(err) {
                        res.send(err);
                        logger.error(err.message);
                    }
                    else if(data.n == 0)
                    {
                      response = { data: [], 'message' : constants.RECORD_NOT_FOUND,  status : 404  };
                      res.send(response);
                    }
                    else {
                        Database.find({ IsDelete: false }, function(err, data) {
                            if(err) {
                                res.send(err);
                                logger.error(err.message);
                            }

                            var cacheKey = constants.DATABASE_CACHEKEY + req.body._id;
                            redisCache.set(cacheKey, data.filter(x=>x._id == req.body._id)[0], {ttl: 1}, function(err) {
                                if (err) {
                                    res.send(err);
                                    logger.error(err + '-' + constants.DATABASE_UPDATE);
                                    throw err;
                                }

                                redisCache.set(constants.DATABASEGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                                    if (err) {
                                        res.send(err);
                                        logger.error(err + '-' + constants.DATABASE_UPDATE);
                                        throw err;
                                    }

                                    redisCache.set(constants.DATABASEACTIVEGETALL_CACHEKEY, data.filter(x=>x.IsActive == true), {ttl: 1}, function(err) {
                                        if (err) {
                                            logger.error(err + '-' + constants.DATABASE_UPDATE);
                                            throw err;
                                        }
                                    });
                                });
                            });

                            response = { data: data, 'message' : constants.OK };
                            res.json(response);
                        }).sort({ 'DatabaseName': 1 });
                    }
                }
            );
        }
    });
};

let databaseDelete = (req, res) => {
    var conflictStatus = 0;
    Project.find({ DatabaseId: req.params.id }, function(err, data) {
        Candidate.find({ DatabaseId: req.params.id }, function(err, result) {
            if (data.length || result.length) {
                conflictStatus = 1;
            }
            if (conflictStatus === 1) {
                response = { data: [], 'message' : constants.CONFLICT };
                res.json(response);
            }
            else {
                Database.update({ _id: req.params.id }, { $set: { IsDelete: true } }, { runValidators: true },
                      function(err,data) {
                      if(err) {
                          res.send(err);
                          logger.error(err.message);
                       }
                       else if(data.n == 0)
                       {
                         response = { data: [], 'message' : constants.RECORD_NOT_FOUND,  status : 404  };
                         res.send(response);
                       }
                        else
                        {
                            Database.find({ IsDelete: false }, function(err, data) {
                                if(err) {
                                    res.send(err);
                                    logger.error(err.message);
                                }

                                redisCache.set(constants.DATABASEGETALL_CACHEKEY, data, {ttl: 1}, function(err) {
                                      if (err) {
                                          res.send(err);
                                          logger.error(err +  '-' + constants.DATABASE_DELETE);
                                          throw err;
                                      }

                                      redisCache.set(constants.DATABASEACTIVEGETALL_CACHEKEY, data.filter(x=>x.IsActive == true), {ttl: 1}, function(err) {
                                          if (err) {
                                              res.send(err);
                                              logger.error(err + '-' + constants.DATABASE_DELETE);
                                              throw err;
                                          }
                                      });
                                });

                                response = { data: data, 'message' : constants.OK };
                                res.json(response);
                            }).sort({ 'DatabaseName': 1 });
                        }
                    }
                );
            }
        });
    });
};

exports.databaseGetAll = databaseGetAll;
exports.databaseGetById = databaseGetById;
exports.databaseActiveGetAll = databaseActiveGetAll;
exports.databaseInsert = databaseInsert;
exports.databaseUpdate = databaseUpdate;
exports.databaseDelete = databaseDelete;
