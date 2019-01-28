const express = require('express');
const router=express.Router();
const mysql=require('mysql');
const bodyParser = require('body-parser');
const session=require('express-session');
const fs=require('fs');
const client = mysql.createConnection({
host: 'localhost', // DB서버 IP주소
port: 3306, // DB서버 Port주소
user: 'Thurs_11team', // DB접속 아이디
password: 'gachon654321', // 비밀번호(설정X)
database: 'Thurs_11team' //사용할 DB명
});

router.get('/',function(req,res){
    if(req.session.userid){ //세션이 있다면
          var id=req.session.userid;
          res.render('layout',{id:id});
    }
    else{
      res.render('login',{title:'title'});
    }
});
router.post('/',function(req,res){
    if(req.body.userid=='admin'&&req.body.password=='admin'){ //관리자일경우
       req.session.userid=req.body.userid;
       req.session.usertype='admin';
       res.redirect('/admin/admin_setting');
    }
    else{   //CLIENT 사용자 일 경우
      client.query('SELECT count(*) as c_idcount from CLIENT where userid=?',[req.body.userid],(err,c_count)=>{
          if(c_count[0].c_idcount==1){      //CLIENT 테이블에 입력받은 userid의 값을 가진 값이 존재한다면,
              client.query('SELECT userid,password from CLIENT WHERE userid=?',[req.body.userid],(err,c_result)=>{
                var id=c_result[0].userid;
                var pw=c_result[0].password;
                if(id==req.body.userid && pw==req.body.password){
                    req.session.userid=id;
                    req.session.usertype='client';
                    res.redirect('/login');
                }
                else{                       //CLENT 테이블에 입력받은 userid의 값이 존재하지 않는다면,
                  res.send('<script>alert("id 또는 pw 가 잘못되었습니다.");' +'window.location.replace("/login");</script>');                }
              });
          }
          else{     //LAWYER 사용자 일 경우
              client.query('SELECT count(*) as l_idcount FROM LAWYER WHERE userid=?',[req.body.userid],(err,l_count)=>{
                  if(l_count[0].l_idcount==1){    //LAWYER 테이블에 입력받은 userid의 값을 가진 값이 존재한다면,
                    client.query('SELECT userid,password FROM LAWYER WHERE userid=?',[req.body.userid],(err,l_result)=>{
                        var id=l_result[0].userid;
                        var pw = l_result[0].password;
                        if(id==req.body.userid && pw==req.body.password){
                            req.session.userid=id;
                            req.session.usertype='lawyer';
                            res.redirect('/login');
                        }
                        else{                      //LAWYER 테이블에 입력받은 userid의 값이 존재하지 않는다면,
                          res.send('<script>alert("id 또는 pw 가 잘못되었습니다.");' +'window.location.replace("/login");</script>');     //이벤트창 띄움
                        }
                    });
                  }
                  else{         //모든 테이블에 존재하지 않는 경우
                    res.send('<script>alert("로그인 실패");' +'window.location.replace("/login");</script>');      //이벤트창 띄움
                  }
              });
           }
      });
   }
});
module.exports=router
