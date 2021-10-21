var express = require('express');
var router = express.Router();
var os = require('os');

router.get('/:tagId', function(req, res, next) {
    key = req.params.tagId;
    ans = "";
    if (key in cnt) {
	cnt[key] = cnt[key] + 1;
	ans = cnt[key].toString();
    }
    res.send(ans);
});

module.exports = router;
