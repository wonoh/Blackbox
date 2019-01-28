//회원가입의 유형을 결정하는 페이지 호출.
var express = require('express');
var router = express.Router();

/*GET page*/
router.get('/',function(req,res){
	res.header('Content-Type', 'text/html');
	res.render('choice',{title:'choice',id:req.session.userid});
});

module.exports = router;
