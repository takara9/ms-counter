var express = require('express');
var router = express.Router();
var os = require('os');

router.get('/:tagId', function(req, res, next) {
    key = req.params.tagId;
    cnt[key] = 1;
    res.send(cnt[key].toString());
});

module.exports = router;
