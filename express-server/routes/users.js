var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  //res.send('respond with a resource');
  var mysql = require('mysql');
  var connection = mysql.createConnection({
    host: '192.168.2.35',
    port: '13306',
    user: 'root',
    password: '123456',
    database: 'cma_imos'
  });

  connection.connect();

  let sqlcomm=`SELECT
  db_station.id,
  db_station.station_type_id,
  db_station.station_name,
  db_station.station_num
  FROM
  db_station
  `
  connection.query(sqlcomm, function (error, results, fields) {
    if (error) throw error;
    results = JSON.stringify(results);
    console.log('The solution is: ', results);
    res.send(results);
  });
  //res.render('error');
});

module.exports = router;
