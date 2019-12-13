var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/all', function (req, res, next) {
    console.log(req.query);
    let params = req.query;
    var stationsdata = require('../data/tb_station_info.json');
    let arr = stationsdata.RECORDS;
    let result = {
        "RECORDS": arr,
    };
    res.send(result);
});

/* GET users listing. */
router.get('/stationnum', function (req, res, next) {
    console.log(req.query);
    let params = req.query;
    var stationsdata = require('../data/tb_station_info.json');
    let arr = stationsdata.RECORDS;
    let resu = arr.filter(item => item.stationNum === params.stationNum)
    let result = {
        "RECORDS": resu,
    };
    res.send(result);
});

module.exports = router;
