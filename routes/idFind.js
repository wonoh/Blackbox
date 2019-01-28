var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const nodemailer=require('nodemailer');
const client = mysql.createConnection({
host: 'localhost', // DB서버 IP주소
port: 3306, // DB서버 Port주소
user: 'Thurs_11team', // DB접속 아이디
password: 'gachon654321', // 비밀번호(설정X)
database: 'Thurs_11team' //사용할 DB명
});


/* Get page */
router.get('/',function(req,res){
	res.render('idFind',{title:'title'});
});
router.post('/',function(req,res){
    var body=req.body;
		if(body.name&&body.email){ // 입력된 name과 email 이 있을 경우
			if(body.usertype=='client'){ //유저타입이 client 즉 의뢰인일 경우
				req.session.findtype='client'; //세션변수 findtype 에 client 저장
			 	client.query('select name,email from CLIENT where name=? and email=?',[body.name,body.email],(err,result)=>{
				 				if(err){
										res.send("data select error");
									}
								else{
								  	if(!result){ // 쿼리 결과가 없다면
											res.send('<script>alert("이름 또는 이메일을 잘못 입력하셨습니다. 다시 입력해주세요");' +
												 	'window.location.replace("/idFind");</script>');
										}
										else{
											var a = Math.floor(Math.random()*10000) + 1;
											if(a==10000){
												a=a-Math.floor(Math.random()*100) + 1;
											}
											req.session.authnum=a; //랜덤으로 4자리 인증번호 생성
											  req.session.email=body.email;
												var mailOptions = { //이메일 설정
												    from: 'BlACKBOX <wldnjsdh123@gmail.com>',
												    to: body.email,
												    subject: '요청에 의한 인증번호 발송입니다.',
												    html: '<h1>인증번호는'+req.session.authnum+'입니다</h1>'
												};
												var smtpTransport = nodemailer.createTransport({ //gmail 과 연동
												    service: 'Gmail',
												    auth: {
												        user: 'wldnjsdh123@gmail.com',
												        pass: 'dnjsdh44'
												    }
												});
												smtpTransport.sendMail(mailOptions, function(error, response){ //이메일전송
    										if (error){
        											console.log(error);
    										} else {
        											console.log("Message sent : " + response.message);
											    }
    										smtpTransport.close();
											  });
												res.send('<script>alert("이메일이 발송되었습니다. 인증번호를 입력해주세요");' +
													 	'window.location.replace("/idFind");</script>');
											}
									}
			 		});
		}
			else if(body.usertype=='lawyer'){ //유저타입이 lawyer 즉 변호사 일 경우 위와동일한 로직으로 이메일 발송
				req.session.findtype='lawyer';
				client.query('select name,email from LAWYER where email=? and name=?',[body.email,body.name],(err,result)=>{
							if(err){
									res.send("data select error");
								}
								else{
									if(!result){
										res.send('<script>alert("이름 또는 이메일을 잘못 입력하셨습니다. 다시 입력해주세요");' +
											 	'window.location.replace("/idFind");</script>');
											}
											else{
												var a = Math.floor(Math.random()*10000) + 1;
												if(a==10000){
													a=a-Math.floor(Math.random()*100) + 1;
												}
												req.session.authnum=a;
												req.session.email=body.email;
												var mailOptions = {
												    from: 'BlACKBOX <wldnjsdh123@gmail.com>',
												    to: body.email,
												    subject: '요청에 의한 인증번호 발송입니다.',
												    html: '<h1>인증번호는'+a+'입니다</h1>'
												};
												var smtpTransport = nodemailer.createTransport({
												    service: 'Gmail',
												    auth: {
												        user: 'wldnjsdh123@gmail.com',
												        pass: 'dnjsdh44'
												    }
												});
												smtpTransport.sendMail(mailOptions, function(error, response){
    										if (error){
        											console.log(error);
    										} else {
        											console.log("Message sent : " + response.message);
											    }
    										smtpTransport.close();
											  });
												res.send('<script>alert("이메일이 발송되었습니다. 인증번호를 입력해주세요");' +
													 	'window.location.replace("/idFind");</script>');

											}
										}
		 			});
		}
			else{
				res.send('<script>alert("이름 또는 이메일을 잘못 입력하셨습니다. 다시 입력해주세요");' +
					 	'window.location.replace("/idFind");</script>');
					}
	}
	else{
		res.send('<script>alert("모두 입력해주세요!");' +
				'window.location.replace("/idFind");</script>');
	}
});
router.get('/check',function(req,res){ // 인증번호 입력후 확인 하는 라우터
			var body=req.query;
			if(req.session.authnum==body.check){ // 발송된 인증번호와 입력된 값이 맞다면
					if(req.session.findtype=='client'){ // 위에 저장해논 findtype 변수에서 유저타입을 구분
							client.query('select userid from CLIENT where email=?',[req.session.email],(err,result)=>{
								if(err){
									res.send('data select error');
								}
								else{
								res.send('<script>alert("요청하신 ID는'+result[0].userid+'입니다.");' +
										'window.location.replace("/login");</script>');
									}
							});
			  	}
					else{
						client.query('select userid from LAWYER where email=?',[req.session.email],(err,result)=>{
							res.send('<script>alert("요청하신 ID는'+result[0].userid+'입니다.");' +
									'window.location.replace("/login");</script>');
						});
					}
		  }
			else{
				res.send('<script>alert("입력하신 인증번호가 일치하지 않습니다. 다시 확인해주세요!");' +
						'window.location.replace("/idFind");</script>');
			}
});
module.exports = router;
