var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_schmcory',
  password        : '9401',
  database        : 'cs340_schmcory'
});
module.exports.pool = pool;