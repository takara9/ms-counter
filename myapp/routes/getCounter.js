var express = require('express');
var router = express.Router();
var os = require('os');

router.get('/:tagId', function(req, res, next) {
    key = req.params.tagId;
    ans = "";
    if (key in cnt) {
	ans = cnt[key].toString();
    }
    res.send(ans);
});

module.exports = router;
