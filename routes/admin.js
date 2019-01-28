var express = require('express');
const mysql=require('mysql');
var router = express.Router();
const client = mysql.createConnection({
host: 'localhost', // DB서버 IP주소
port: 3306, // DB서버 Port주소
user: 'Thurs_11team', // DB접속 아이디
password: 'gachon654321', // 비밀번호(설정X)
database: 'Thurs_11team' //사용할 DB명
});
/* Get page */
router.get('/',function(req,res){
	res.render('admin',{title:'title',id:req.session.userid});
});
router.get('/admin_setting',function(req,res){
	res.render('admin_setting',{id:req.session.userid});
});
//의뢰인 정보 조회
router.get('/c_user_info',function(req,res){

  client.query('SELECT * FROM CLIENT',(err,result)=>{
    res.render('c_user_info',{id:req.session.userid,data:result});
  });
});
//변호사 정보 조회
router.get('/l_user_info',function(req,res){
  client.query('SELECT * FROM LAWYER',(err,result)=>{
    res.render('l_user_info',{id:req.session.userid,data:result});
  });
});
//변호사 사용자 개인 프로필 조회
router.get('/profile_content',function(req,res){
	client.query('SELECT * FROM LAWYER WHERE userid=?',[req.query.userid],(err,result)=>{
		if(err){console.log('select err...');}
		res.render('profile_content',{id:req.session.userid,data:result});
	});
});
//CONSULT 목록 조회
router.get('/admin_consult',function(req,res){
	client.query('SELECT * FROM CONSULT',(err,result)=>{
		for(var i=0;i<result.length;i++){																		//날짜를 'date-utils 모듈을 이용하여 새로 포맷('YYYY-MM-DD')을 지정.
			result[i].date=new Date(result[i].date).toFormat('YYYY-MM-DD');
		}
		res.render('admin_consult',{id:req.session.userid,data:result});
	});
});

//EYEWITNESS 목록 조회
router.get('/admin_eyewitness',function(req,res){
	client.query('select * from EYEWITNESS',(err,result)=>{
		for(var i=0;i<result.length;i++){																	//날짜를 'date-utils 모듈을 이용하여 새로 포맷('YYYY-MM-DD')을 지정.
			result[i].date=new Date(result[i].date).toFormat('YYYY-MM-DD');
		}
		res.render('admin_eyewitness',{id:req.session.userid,data:result});
	});
})
//사용자 삭제
router.get('/remove_user',function(req,res){
	   if(req.query.usertype=='client'){
			 client.query('SET foreign_key_checks = 0',()=>{																					//외래키 제약조건 참조를 제거.
			 		client.query('delete from CLIENT where userid=?',[req.query.userid],(err,result)=>{
							if(err){
									res.send('data delete error');
							}
							else{
								res.send('<script>alert("삭제 완료!");' +
                            'window.location.replace("/admin/c_user_info");</script>');					//삭제가 완료되었다는 이벤트 창을 띄움.
							}
					});
				});
		 }
		 else if(req.query.usertype=='lawyer'){
			 client.query('SET foreign_key_checks = 0',()=>{																					//외래키 제약조건 참조를 제거.
			 client.query('delete from LAWYER where userid=?',[req.query.userid],(err,result)=>{
					 if(err){
							 res.send('data delete error');
					 }
					 else{
						 res.send('<script>alert("삭제 완료!");' +
												 'window.location.replace("/admin/l_user_info");</script>');					//삭제가 완료되었다는 이벤트 창을 띄움.
					 }
			 });
		 });
		 }
		 else{
			 res.send('<script>alert("유효하지 않은 사용자입니다.");' +
									 'window.location.replace("/admin/admin_setting");</script>');						//변호사 또는 의뢰인 사용자가 모두 아닐 경우 이벤트 창을 띄움.
		 }
});

//CONSULT 삭제
router.get('/remove_consult',function(req,res){
	client.query('SET foreign_key_checks = 0',()=>{																						//외래키 제약조건 참조를 제거.
				client.query('delete from CONSULT where num=?',[req.query.num],(err,result)=>{
								if(err){
									res.send('data delete error');
								}
								else{
									res.send('<script>alert("삭제 완료!");' +
		 												 'window.location.replace("/admin/admin_consult");</script>');
								}
				});
		});
});
//EYEWITNESS 삭제
router.get('/remove_eyewitness',function(req,res){
	client.query('SET foreign_key_checks = 0',()=>{																						//외래키 제약조건 참조를 제거.
		client.query('delete from EYEWITNESS WHERE num=?',[req.query.num],(err,result)=>{
			if(err){console.log('delete err');}
			res.send('<script>alert("삭제 완료!");' + 'window.location.replace("/admin/admin_eyewitness");</script>');
		});
	});
})
//변호사 승인 확인
router.get('/approval',function(req,res){
	client.query("UPDATE LAWYER SET approval='o' WHERE userid=?",[req.query.userid],function(err,result){	//관리자에 의해 승인을 받은 변호사 사용자는 approval='o'으로 세팅.
		if(err){
			console.log('UPDATE ERROR');
		}
		else{
			res.redirect('/admin/l_user_info');
		}
	});
});
module.exports = router;
