//변호사 회원가입
const express=require('express');
const router=express.Router();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const multer = require('multer');

var upload=multer({storage:multer.diskStorage({
	destination:function(req,file,cb){
		cb(null,'public/identify/');
	},
	filename:function(req,file,cb){
		cb(null,file.originalname);
	}
})})

const client = mysql.createConnection({
host: 'localhost', // DB서버 IP주소
port: 3306, // DB서버 Port주소
user: 'Thurs_11team', // DB접속 아이디
password: 'gachon654321', // 비밀번호(설정X)
database: 'Thurs_11team' //사용할 DB명
});

router.get('/',function(req,res){
	res.render('lawyer',{title:'title',id:req.session.userid});
});
//변호사 회원 등록
router.post('/',upload.single('identify'),function(req,res){
    var body=req.body;
    var approval='x';
    client.query('select count(*) as idcount from LAWYER where userid=?',[body.userid],(err,id)=>{				//현재 LAWYER 테이블에 userid를 가진 사용자가 있는지 확인
          client.query('select count(*) as emailcount from LAWYER where email=?',[body.email],(err,email)=>{				//현재 LAWYER 테이블에 email을 가진 사용자가 있는지 확인
                  if(id[0].idcount==0&&email[0].emailcount==0&&body.password1==body.password2){					//userid와 email을 가진 사용자가 없다면 가입.
                      client.query('insert into LAWYER (userid,password,name,email,tele,phone,identify,approval,office,major) values (?,?,?,?,?,?,?,?,?,?)',
                      [body.userid,body.password1,body.name,body.email,body.tele,body.phone,req.file.filename,approval,body.office,body.major],()=>{
                            res.redirect('/login'); //회원가입 완료시 로그인으로 넘어감
                      });
                  }
                  else if (id[0]==1) {				//ID가 중복인 경우
                          res.send('<script>alert("로그인가 중복입니다. 다시 입력해주세요.");' +'window.location.replace("/lawyer");</script>');			//이벤트창 띄움
                  }
                  else if(email[0]==1){				//E-MAIL이 중복인 경우
                          res.send('<script>alert("이메일이 중복입니다. 다시 입력해주세요.");' +'window.location.replace("/lawyer");</script>');			//이벤트창 띄움
                  }
                  else if(body.password1!=body.password2){				//패스워드와 패스워드 확인이 일치하지 않는 경우
                          res.send('<script>alert("패스워드를 잘못입력하셨습니다. 다시 입력해주세요.");' +'window.location.replace("/lawyer");</script>');			//이벤트창 띄움
                  }
          });
    });
});


module.exports = router;
