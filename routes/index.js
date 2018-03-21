var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET home page. */
router.get('/', function (req, res, next) {
  // 用于调用后台接口，重新渲染数据模板
  // axios({
  //   method: 'get',
  //   url: 'http://10.0.2.251:8007/api/student/GetKnowStatisticData',
  //   params: {
  //     uid: '1001'
  //   },
  //   headers: {
  //     'Authorization': 'BasicAuth 16C6A93E7087879FF7D237CD9B19D0746B61417C404936479C9B9DD25D0F46C859960390F208D90E3A87A3CB260C437F7DF45E2E0FD9BB287003A20F66ADC7901017E79BAEEAA35A044C89E0DAD3640D7814985C984874501A0188F45A7BFBED50F107D901112CFBE4081EDDA5CE9357E665BE2C84C90A5334978050F7397842C0915C04739A00981EEC553CA97EE2CACFA06E4E4207C223BFC5B71C4BB09489'
  //   }
  // }).then(function (response) {
  //   if (response.status === 200) {
  //     var data = JSON.parse(response.data);
  //     // console.log(data)
  //     if (data.Flag) {
  //       // 写入数据到请求主体
  //       res.render('index', { title: 'express', list: data.ApiData });
  //     }
  //   }
  // }).catch(function (err) {
  //   console.log(err.response.status);
  //   console.log(err.response.data);
  // });
  res.render('index', { title: 'express'});
});

router.get('/login', function (req, res, next) {
  res.render('login');
});

module.exports = router;