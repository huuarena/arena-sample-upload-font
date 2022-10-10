var express = require("express");
var router = express.Router();

/* GET home page. */
router.get(["/:a", "/:a/:b", "/:a/:b/:c"], function (req, res, next) {
  res.sendFile(process.cwd() + req.originalUrl);
});

module.exports = router;
