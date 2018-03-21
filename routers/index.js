'use strict';

var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET home page. */
router.get('/', function (req, res, next) {
  axios({
    method: 'get',
    url: 'http://10.0.2.251:8007/api/student/GetKnowStatisticData',
    params: {
      uid: '1001'
    },
    headers: {
      'Authorization': 'BasicAuth D06A087B64B3781567D1354E31A81FE807A247DAE9FCCCA3DB4DBC790F339A052A3F4AC3E4EAB654362EE5312017E3E70669B23D7E0D23B15CDF311DC074979E797A21F8FF170F45D1B44E22BF7EF514F54F0EB93529718D296EDF96F5EAF8F28EDDB97CD4921EB34D0092F4D6258F72FD9C46F740BA94C6BD1FFBED68772284890612904D4C918F23694C8C9E33ED7CBB5052FEF59F35A0CF5EBC5424F2988C'
    }
  }).then(function (response) {
    if (response.status === 200) {
      var data = JSON.parse(response.data);
      // console.log(data)
      if (data.Flag) {
        // 写入数据到请求主体
        res.render('index', { title: 'express', list: data.ApiData });
      }
    }
  }).catch(function (err) {
    console.log(err.response.status);
    console.log(err.response.data);
  });
});

router.get('/login', function (req, res, next) {
  res.render('login');
});

module.exports = router;