var express = require('express');
var router = express.Router();
var os = require('os');
var Redis = require("ioredis");

var redis_port = parseInt(process.env.REDIS_PORT,10);
var redis_host = process.env.REDIS_HOST;
var redis = new Redis({ port: redis_port, host: redis_host });
console.log("redis ", redis);


router.get('/:tagId', function(req, res, next) {
    key = req.params.tagId;
    redis.get(key, function (err, value) {
	if (!err) {
            console.log(value);
	    res.send(value);
	} else {
            console.error(err);
	    res.send('');
	}
    });
});

module.exports = router;
