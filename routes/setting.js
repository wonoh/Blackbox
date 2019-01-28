const express = require('express');
const router=express.Router();
const mysql=require('mysql');
const bodyParser = require('body-parser');
const session=require('express-session');

const client = mysql.createConnection({
host: 'localhost', // DB서버 IP주소
port: 3306, // DB서버 Port주소
user: 'Thurs_11team', // DB접속 아이디
password: 'gachon654321', // 비밀번호(설정X)
database: 'Thurs_11team' //사용할 DB명
});

/* Get page */
router.get('/',function(req,res){
		res.render('setting',{title:'title',id:req.session.userid});
});
// 사용자 개인 정보 변경
router.get('/user_info',function(req,res){
	if(req.session.usertype=='client'){					//의뢰인 사용자 일 경우
		client.query('select * from CLIENT WHERE userid=?',[req.session.userid],function(err,result){
			if(err){
				res.status(500).send('client data read error!');
				console.log(err);
			}
			res.render('client_info',{data:result,id:req.session.userid});
		});
	}
	else if(req.session.usertype=='lawyer'){		//변호사 사용자 일 경우
		client.query('select * from LAWYER WHERE userid=?',[req.session.userid],function(err,result){
			if(err){
				res.status(500).send('lawyer data read error!');
			}
			res.render('lawyer_info',{data:result,id:req.session.userid});
		});
	}
	else{
		res.send('<script>alert("로그인을 하셔야 이용하실 수 있습니다.");' +'window.location.replace("/setting");</script>');				//이벤트창 띄움
	}
});
//변호사 개인 프로필 등록페이지
router.get('/lawyer_profile',function(req,res){
	  if(req.session.usertype!='lawyer'){			//변호사 사용자가 아닐 경우
			  res.send('<script>alert("변호사만 사용할 수 있습니다.!");' +						//이벤트창 띄움
                            'window.location.replace("/setting");</script>');
		}
		else{																		//변호사 사용자 일 경우
			client.query('select * from LAWYER WHERE userid=?',[req.session.userid],function(err,result){
				res.render('lawyer_profile',{data:result,id:req.session.userid});
			});
		}
	});
//변호사 개인 프로필 등록
router.post('/lawyer_profile',function(req,res){
		var body=req.body;
		client.query('select count(*) as idcount from LAWYER where userid=?',[req.session.userid],(err,result)=>{
				if(result[0].idcount==1){ //변호사로 로그인 했을 경우
					if(req.body.background&&req.body.history&&req.body.event&&req.body.cover){
							client.query('update LAWYER set background=?,history=?,event=?,cover=? where userid=?',[req.body.background,req.body.history
														,req.body.event,req.body.cover,req.session.userid],(err)=>{
																if(err){
																		res.send('data insert error');
																}
																else{
																	res.send('<script>alert("갱신 완료!");' +				//이벤트창 띄움
                            'window.location.replace("/setting");</script>');
													}
														});
					}
					else{
						res.send('<script>alert("모두 작성해주십시오.");' +'window.location.replace("/setting/lawyer_profile");</script>');				//이벤트창 띄움
					}
				}
				else{
					res.send('<script>alert("변호사만 사용할 수 있습니다.!");' +
                            'window.location.replace("/setting");</script>');			//이벤트창 띄움
				}
		});
	});
 //개인정보 변경 요청
router.post('/user_info',function(req,res){
	     if(req.session.usertype=='lawyer'){					//변호사 사용자 개인정보 변경 요청
       var ldata=[req.body.identify,req.body.name,req.body.email,req.body.tele,req.body.phone,req.body.office,req.body.major,req.session.userid];
       client.query('update LAWYER set identify=?,name=?,email=?,tele=?,phone=?,office=?,major=? where userid=?',ldata,function(err,result){
              if(err){
                    res.status(500).send('data update error!!');
              }
							else{
								res.send('<script>alert("갱신 완료!");' + 'window.location.replace("/setting");</script>');				//이벤트창 띄움
							}
       });
		 }
		 else{																					//의뢰인 사용자 개인정보 변경 요청
			 var cdata=[req.body.name,req.body.email,req.body.tele,req.body.phone,req.session.userid];
       client.query('update CLIENT set name=?,email=?,tele=?,phone=? where userid=?',cdata,function(err,result){
              if(err){
                    res.status(500).send('data update error!!');
              }
							else{
								res.send('<script>alert("갱신 완료!");' + 'window.location.replace("/setting");</script>');				//이벤트창 띄움
							}
       });
		 }
});
 //서비스탈퇴
router.get('/remove',function(req,res){
		if(req.session.usertype=='client'){				//의뢰인 사용자 회원 탈퇴
				client.query('delete from CLIENT where userid=?',[req.session.userid],(err)=>{
						 if(err){
								 res.send('data delete error');
						 }
						 res.send('<script>alert("계정 삭제 완료!");' + 'window.location.replace("/logout");</script>');			//이벤트창 띄움
				});

		}
		else if(req.session.usertype=='lawyer'){	//변호사 사용자 회원 탈퇴
			client.query('delete from LAWYER where userid=?',[req.session.userid],(err)=>{
					if(err){
							res.send('data delete error');
					}
					res.send('<script>alert("계정 삭제 완료!");' + 'window.location.replace("/logout");</script>');					//이벤트창 띄움


		 });
		}
	else{
		res.send('<script>alert("로그인을 하셔야 이용하실 수 있습니다.");' +'window.location.replace("/setting");</script>');				//이벤트창 띄움
	}

});
module.exports = router;
