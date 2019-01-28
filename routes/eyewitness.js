var express = require('express');
var router = express.Router();
var bodyParser=require('body-parser');
var mysql = require('mysql');

const client = mysql.createConnection({
host: 'localhost', // DB서버 IP주소
port: 3306, // DB서버 Port주소
user: 'Thurs_11team', // DB접속 아이디
password: 'gachon654321', // 비밀번호(설정X)
database: 'Thurs_11team' //사용할 DB명
});

/*GET page */
router.get('/',function(req,res){
	res.header('Content-Type','text/html');
	res.render('eyewitness',{title:'eyewitness',id:req.session.userid});
});
//목격 제보 요청
router.get('/request',function(req,res){
	if(!req.session.userid){
		res.send('<script>alert("로그인을 하셔야 이용하실 수 있습니다.");' +'window.location.replace("/eyewitness");</script>');			//이벤트창 띄움
	}
	else{
		res.render('eyewitness_request',{title:'eyewitness_request',id:req.session.userid});
	}
});
//목격 제보 목록 조회
router.get('/list',function(req,res){
	if(!req.session.userid){
		res.send('<script>alert("로그인을 하셔야 이용하실 수 있습니다.");' +'window.location.replace("/eyewitness");</script>');			//이벤트창 띄움
	}
	else{
		client.query('SELECT * FROM EYEWITNESS',function(err,result){
			if(err){console.log('select error..');}
			for(var i=0;i<result.length;i++){
				result[i].date=new Date(result[i].date).toFormat('YYYY-MM-DD');					//날짜를 'date-utils 모듈을 이용하여 새로 포맷('YYYY-MM-DD')을 지정.
			}
			res.render('eyewitness_list',{data:result,id:req.session.userid});
		});
	}
});
//목격 제보 내용 조회
router.get('/content',function(req,res){
	var phone_num;
	client.query('select * from EYEWITNESS where num=?',[req.query.num],function(err,result){
		if(err){console.log('select error.');}
		for(var i =0;i<result.length;i++){
			result[i].date=new Date(result[i].date).toFormat('YYYY-MM-DD');						//날짜를 'date-utils 모듈을 이용하여 새로 포맷('YYYY-MM-DD')을 지정.
		}
		client.query('select * from CLIENT WHERE userid=?',[result[0].userid],(err,c_result)=>{
			if(err){console.log('selet error..');}
			if(!c_result){
				client.query('select * from LAWYER WHERE userid=?',[result[0].userid],(err,l_result)=>{
					phone_num=l_result[0].phone;
				});
			}else if(c_result[0]){
				phone_num=c_result[0].phone;
			}
			else{
				res.send('<script>alert("찾을수 없는 사용자입니다.");' +'window.location.replace("/eyewitness");</script>');			//이벤트창 띄움
			}
			res.render('eyewitness_content',{data:result,id:req.session.userid,phone:phone_num});
		});


	});
});
//목격 제보 등록
router.post('/request',function(req,res){
	client.query('INSERT INTO EYEWITNESS VALUES(NULL,?,?,?,?)',[req.body.date,req.body.title,req.session.userid,req.body.content],function(err){
		if(err){
			console.log('insert error');
		}
		res.redirect('/eyewitness');
	});
});

module.exports = router;
