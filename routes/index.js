const express = require('express');
const router = express.Router();
const rp = require('request-promise');
const moment = require('moment');

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
  if (req.query.from && req.query.to) {
    var fromdate = moment(req.query.from, "YYYY-MM-DD");
    console.log(fromdate);
    var todate = moment(req.query.to, "YYYY-MM-DD");
    Bitcoin.find({ marketname: market_name, timestamp: { "$gte": fromdate.toDate(), "$lt": todate.toDate() } }).exec()
      .then((result) => {
        console.log(result.length);
        if (result.length) {
          res.send(result);
        }
        else { res.status(404).json({ message: 'No valid entry found' }); }
      })
      .catch((err) => res.send(err));
  }
  else if (req.query.from) {
    //console.log(req.query.from);
    var date = moment(req.query.from, "YYYY-MM-DD");
    console.log(date);
    Bitcoin.find({ marketname: market_name, timestamp: { "$gte": date.toDate() } }).exec()
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