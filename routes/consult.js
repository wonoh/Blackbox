var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session=require('express-session');
const multer=require('multer');

const client = mysql.createConnection({
host: 'localhost', // DB서버 IP주소
port: 3306, // DB서버 Port주소
user: 'Thurs_11team', // DB접속 아이디
password: 'gachon654321', // 비밀번호(설정X)
database: 'Thurs_11team' //사용할 DB명
});
//multer 파일 업로드 설정
var upload=multer({storage:multer.diskStorage({
	destination:function(req,file,cb){
		cb(null,'public/upload/');  //public/upload 디렉토리에 동영상 파일을 저장.
	},
	filename:function(req,file,cb){
		cb(null,file.originalname); //파일을 원래 이름으로 저장.
	}
    })
});
/* Get page */
router.get('/',function(req,res){ //consult 메뉴
	res.render('consult',{title:'title',id:req.session.userid});
});

router.get('/request_list',function(req,res){ //의뢰 목록 조회  ejs (의뢰)
	if(!req.session.userid){
		res.send('<script>alert("로그인을 하셔야 이용하실 수 있습니다.");' +'window.location.replace("/consult");</script>');		//이벤트창 띄움
	}
	client.query('select * from CONSULT',function(err,result){
		if(err){
			res.send('data select error');
		}
		else{
			for(var i =0;i<result.length;i++){
				result[i].date=new Date(result[i].date).toFormat('YYYY-MM-DD');
			}
			res.render('consult_list',{data:result,id:req.session.userid});
		}
	});
});
router.get('/accept_list',function(req,res){ //의뢰 목록 조회 ejs (수임)
	if(req.session.usertype=='lawyer'){ 				//변호사 사용자만 사용을 할 수 있음.
		client.query('select * from LAWYER WHERE userid=?',[req.session.userid],function(err,result){
			if(result[0].approval=='o'){
				client.query('select * from CONSULT WHERE ac_lawyer=?',[req.session.userid],function(err,result){
						if(err){
									res.send('data select error');
						}
						else{
							for(var i=0;i<result.length;i++){
								result[i].date=new Date(result[i].date).toFormat('YYYY-MM-DD');			//날짜를 'date-utils 모듈을 이용하여 새로 포맷('YYYY-MM-DD')을 지정.
							}
						res.render('accept_list',{data:result,id:req.session.userid});
						}
				 });
			}
			else{				//관리자에 의해 아직 승인이 되지 않은 변호사 사용자는 완료가 될때 까지 기다려야함.
				res.send('<script>alert("승인이 완료된 변호사만 가능합니다. 승인이 완료될 때까지 기다려 주십시오.");'+'window.location.replace("/consult");</script>');			//이벤트창 띄움
			}
		});
	}
	else{						//의뢰인 사용자는 사용을 할 수 없음.
		res.send('<script>alert("변호사 사용자만 이용가능합니다.");' +'window.location.replace("/consult");</script>');				//이벤트창 띄움
	}

});
 //의뢰 내용 조회 (의뢰)
router.get('/request_content',function(req,res){
      client.query('select * from CONSULT where num=?',[req.query.num],function(err,result){
            if(err){
                  res.send('data select error');
            }
						else{
							result[0].advice_date=new Date(result[0].advice_date).toFormat('YYYY-MM-DD');				//날짜를 'date-utils 모듈을 이용하여 새로 포맷('YYYY-MM-DD')을 지정.
						}
            res.render('request_content',{data:result,id:req.session.userid});

      });
});
router.get('/accept_content',function(req,res){ //의뢰 수임
	    client.query('update CONSULT set accept=? where num=?',[accept,req.query.num],(err,result)=>{
					 if(err){
						 		res.send('data update error');
					 }
					 else{
						 res.redirect('/consult/request_list');
					 }
			});
});
//의뢰 작성 페이지
router.get('/request_insert',function(req,res){
	if(req.session.userid){
		client.query('SELECT userid FROM LAWYER WHERE approval="o"',(err,result)=>{
			res.render('request_insert',{id:req.session.userid,data:result});
		});
	}
	else{
		 res.send('<script>alert("로그인을 하셔야 이용하실 수 있습니다.");' +'window.location.replace("/consult");</script>');				//이벤트창 띄움
	}

});
//법적 소견 작성 페이지
router.get('/accept_insert',function(req,res){
      res.render('accept_insert',{title:'title',id:req.session.userid,num:req.query.num});
});
//사건 의뢰시 변호사의 목록과 개인 프로필을 확인.
router.get('/detail_lawyer',function(req,res){
	client.query('select * from LAWYER WHERE approval="o"',function(err,result){
		if(err){console.log('select err....');}
		res.render('detail_lawyer',{id:req.session.userid,data:result})
	});
});
 //의뢰 작성
router.post('/request_insert',upload.single('video'),function(req,res){
      var body=req.body;
      var dt=new Date();
      var month = dt.getMonth()+1;
      var day = dt.getDate();
      var year = dt.getFullYear();
      var date=year+'/'+month+'/'+day;
			if(!req.session.userid){
				res.send('<script>alert("로그인을 하셔야 이용하실 수 있습니다.");' +'window.location.replace("/consult");</script>');			//이벤트창 띄움
			}
			else if(req.session.userid=='admin'){
				res.send('<script>alert("관리자는 이용할 수 없습니다.");' +'window.location.replace("/consult");</script>');			//이벤트창 띄움

			}
			else{
				client.query('select count(*) as l_count from LAWYER where userid=?',[body.ac_lawyer],(err,result)=>{
				  if(result[0].l_count==0){
						res.send('<script>alert("변호사를 잘못 선택하였습니다..");' +'window.location.replace("/consult/request_insert");</script>');			//이벤트창 띄움
					}
					else if((body.title=='')||(body.video=='')||(body.content=='')){						//어느 하나라도 빈 칸이 존재한다면 다시 작성.
						res.send('<script>alert("작성 양식을 완성해주십시오.");' +'window.location.replace("/consult/request_insert");</script>');			//이벤트창 띄움
					}
					else{										//모든 내용이 작성이 완료되면 동영상 파일과 같이 작성,
						client.query('insert into CONSULT (num,date,title,userid,ac_lawyer,video,content,accept) values (NULL,?,?,?,?,?,?,?)',[date,
																		body.title,req.session.userid,body.ac_lawyer,req.file.filename,body.content,'x'],(err)=>{									//video에 들어가는 변수 req.file.filename으로 바꿈
																			if(err){
																				res.status(500).send('data insert error');
																			}
																				res.redirect('/consult/request_list');
					  });
			    }

        });
			}
});

router.post('/accept_insert',function(req,res){ //법적 소견 작성
      var body=req.body;
      var dt=new Date();
      var month = dt.getMonth()+1;
      var day = dt.getDate();
      var year = dt.getFullYear();
      var date=year+'/'+month+'/'+day;
      var accept='O';
			if(body.advice){
				client.query('update CONSULT set accept=?,advice=?,advice_date=? where num=?',[accept,body.advice,date,body.num],(err)=>{
								if(err){
											res.status(500).send('data insert error');
								}
								res.send('<script>alert("작성 되었습니다.");' +'window.location.replace("/consult/accept_list");</script>');			//이벤트창 띄움
					});
			}
			else{
					res.send('<script>alert("모두 입력해 주세요!");' +'window.location.replace("/consult/accept_insert");</script>');				//이벤트창 띄움
			}
});
module.exports = router;
