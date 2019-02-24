var express = require('express');
var router = express.Router();
var rp = require('request-promise');
var url = require('url');
var querystring = require('querystring');
var moment = require('moment');

var Bitcoin = require('../models/bitcoin_model');


var options = {
  method: 'GET',
  uri: 'https://bittrex.com/api/v1.1/public/getmarketsummaries',
  json: true
};


setInterval(function () {
  rp(options)
    .then(function (response) {
      response.result.forEach((item) => {
        var bitcoin = new Bitcoin({
          timestamp: item.TimeStamp,
          marketname: item.MarketName,
          high: item.High,
          low: item.Low,
          volume: item.BaseVolume
        })
        //console.log(bitcoin)
        bitcoin.save()
          .then(result => {
            console.log(result);
            //res.send(result);
          })
        // .catch(err => next(err));
      })
    })
    .catch(function (err) {
      console.log(err);
    });
}, 60000);

router.get('/', (req, res, next) => {
  Bitcoin.find({}).select({ "marketname": 1, "_id": 0 }).exec()
    .then((result) => {
      //result.forEach((item) => {
      //console.log(item.marketname)
      res.send(result);
      //})
    })
    .catch((err) => res.send(err));
})

router.get('/:marketname', (req, res, next) => {
  var market_name = req.params.marketname;
  console.log(req.query.from);
  if (req.query.from) {
    var date = moment(new Date(req.query.from)).format('YYYY-MM-DDTHH:mm:ss.SSS')
    console.log(date);
    Bitcoin.find({timestamp:{ "$gte": date }},{ marketname: market_name }).exec()
      .then((result) => {
        console.log(result.length);
        if (result.length) {
          res.send(result);
        }
        else { res.status(404).json({ message: 'No valid entry found' }); }
      })
      .catch((err) => res.send(err));
  }
  else if (req.query.from && req.query.to) {
    //console.log(req.query.from);
    var date = new Date(req.query.from)
    date = date.toISOString();
    console.log(date);
    Bitcoin.find({timestamp: { "$gte": date }},{ marketname: market_name }).exec()
      .then((result) => {
        if (result.length) {
          res.send(result);
        }
        else { res.status(404).json({ message: 'No valid entry found' }); }
      })
      .catch((err) => res.send(err));
  }
  else {
    Bitcoin.find({ marketname: market_name }).exec()
      .then((result) => {
        if (result.length) {
          res.send(result);
        }
        else { res.status(404).json({ message: 'No valid entry found' }); }
      })
      .catch((err) => res.send(err));
  }
})

module.exports = router;