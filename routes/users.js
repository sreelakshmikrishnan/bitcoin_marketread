var express = require('express');
var router = express.Router();
var rp = require('request-promise');

/* GET users listing. 
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
*/


var options = {
  method: 'GET',
  uri: 'https://bittrex.com/api/v1.1/public/getmarketsummaries',
  json: true
};

rp(options)
  .then(function (response) {
    console.log(response);
    response.result.forEach((item) => {
      console.log(item.MarketName);
    });
  })
  .catch(function (err) {
    console.log(err);
  });


module.exports = router;

