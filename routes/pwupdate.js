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
        if(!req.session.userid){
          res.send('<script>alert("로그인하셔야 이용하실 수 있습니다.");' +
                        'window.location.replace("/login");</script>');          //이벤트창 띄움
        }
        else{
          res.render('pwupdate',{title:'title',id:req.session.userid,type:req.session.usertype});
      }
});

router.post('/',function(req,res){
        var usertype=req.session.usertype;
        var nowpw=req.body.nowpw;
        var newpw1=req.body.newpw1;
        var newpw2=req.body.newpw2;
        if(usertype=='client'){     //CLIENT 사용자 일 경우
            client.query('select password from CLIENT where userid=?',[req.session.userid],(err,result)=>{
                    if(err){
                        res.status(500).send('data select error');
                    }
                    if(nowpw==result[0].password&&newpw1==newpw2&&nowpw!=newpw1){       //새로운 비밀번호와 현재 비밀번호가 일치하지 않으면서, 새 비밀번호의 확인이 일치하는 경우
                        client.query('update CLIENT set password=? where userid=?',[newpw1,req.session.userid],(err,result)=>{
                            if(err){
                                res.status(500).send('data update error');
                            }
                            res.redirect('/setting');
                        });
                    }
                    else{
                      res.send('<script>alert("현재 비밀번호가 일치하지 않거나 새 비밀번호가 서로 일치하지 않습니다..");' +       //이벤트창 띄움
                                    'window.location.replace("/setting");</script>');
                    }
            });
        }
        else if(usertype=='lawyer') {         //LAWYER 사용자 일 경우
          client.query('select password from LAWYER where userid=?',[req.session.userid],(err,result)=>{
                  if(err){
                      res.status(500).send('data select error');
                  }
                  else{
                    if(nowpw==result[0].password&&newpw1==newpw2&&nowpw!=newpw1){       //새로운 비밀번호와 현재 비밀번호가 일치하지 않으면서, 새 비밀번호의 확인이 일치하는 경우
                        client.query('update LAWYER set password=? where userid=?',[newpw1,req.session.userid],(err,result)=>{
                            if(err){
                                res.status(500).send('data update error');
                              }
                              res.redirect('/setting');
                        });
                      }
                      else{
                        res.send('<script>alert("현재 비밀번호가 일치하지 않거나 새 비밀번호가 서로 일치하지 않습니다..");' +      //이벤트창 띄움
                                      'window.location.replace("/setting");</script>');
                      }
                 }
          });
        }
        else if(usertype=='admin'){           //관리자일 경우
          client.query('select password from ADMIN where adminid=?',[req.session.userid],(err,result)=>{
              if(err){
                   res.status(500).send('data select error');
              }
              else{

                  if(nowpw==result[0].password&&newpw1==newpw2&&nowpw!=newpw1){       //새로운 비밀번호와 현재 비밀번호가 일치하지 않으면서, 새 비밀번호의 확인이 일치하는 경우
                     client.query('update ADMIN set password=? where adminid=?',[newpw1,req.session.userid],(err,result)=>{
                         if(err){
                             res.status(500).send('data update error');
                           }
                           res.redirect('/admin/admin_setting');
                     });
                  }
                  else{
                    res.send('<script>alert("현재 비밀번호가 일치하지 않거나 새 비밀번호가 서로 일치하지 않습니다..");' +         //이벤트창 띄움
                                  'window.location.replace("/setting");</script>');
                  }
                }
          });
        }
        else{
          res.send('<script>alert("로그인하셔야 이용하실 수 있습니다.");' +          //이벤트창 띄움
                        'window.location.replace("/login");</script>');
        }
});

module.exports=router
