//의뢰인 사용자로 회원가입 하는 페이지 호출.

var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const mysql = require('mysql');

const client = mysql.createConnection({
host: 'localhost', // DB서버 IP주소
port: 3306, // DB서버 Port주소
user: 'Thurs_11team', // DB접속 아이디
password: 'gachon654321', // 비밀번호(설정X)
database: 'Thurs_11team' //사용할 DB명
});
/* GET page */
router.get('/',function(req,res){
	res.render('client',{title:'title',id:req.session.userid});
});

router.post('/',function(req,res){
    var body=req.body;
    client.query('select count(*) as idcount from CLIENT where userid=?',[body.userid],(err,id)=>{		//현재 CLIENT 테이블에 userid를 가진 사용자가 있는지 확인
          client.query('select count(*) as emailcount from CLIENT where email=?',[body.email],(err,email)=>{	//현재 CLIENT 테이블에 email을 가진 사용자가 있는지 확인
                  if(id[0].idcount==0&&email[0].emailcount==0&&body.password1==body.password2){					//userid와 email을 가진 사용자가 없다면 가입.
                    client.query('insert into CLIENT (userid,password,name,email,tele,phone) values (?,?,?,?,?,?)',
                      [body.userid,body.password1,body.name,body.email,body.tele,body.phone],()=>{
                              res.redirect('/login'); //회원가입 완료시 로그인으로 넘어감
                      });
                  }
                  else if (id[0].idcount==1) {		//ID가 중복인 경우
                         res.send('<script>alert("ID가 중복입니다. 다시 입력해주세요.");' +'window.location.replace("/client");</script>');
                  }
                  else if(email[0].emailcount==1){	//E-MAIL이 중복인 경우
                          res.send('<script>alert("E-Mail이 중복입니다. 다시 입력해주세요.");' +'window.location.replace("/client");</script>');
                  }
                  else if(body.password1!=body.password2){	//패스워드와 패스워드 확인이 일치하지 않는 경우
                         res.send('<script>alert("패스워드가 일치하지 않습니다. 다시 입력해주세요.");' +'window.location.replace("/client");</script>');
                  }
          });
    });
});

module.exports = router
