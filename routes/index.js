var express = require('express');
var router = express.Router();
var session = require('express-session');
var os = require('os');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.userid){       //세션이 존재한다면 layout에 id값을 session:id 값을 같이 전송,
    var id=req.session.userid;
    res.render('layout',{id:id});
    if(req.session.userid==admin){  //userid가 admin인 경우 관리자 페이지로 전송.
      res.redirect('/admin');
    }
  }
  else{                         //세션이 존재하지 않을 경우
    res.render('layout',{id:''});
  }
});

module.exports = router;
