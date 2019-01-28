const express = require('express');
const router=express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const ejs=require('ejs');
const fs=require('fs');
const client = mysql.createConnection({
host: 'localhost', // DB서버 IP주소
port: 3306, // DB서버 Port주소
user: 'Thurs_11team', // DB접속 아이디
password: 'gachon654321', // 비밀번호(설정X)
database: 'Thurs_11team' //사용할 DB명
});
router.use(bodyParser.urlencoded({extended:false}));

router.get('/info',function(req,res){
       client.query('select * from LAWYER where userid=?',[req.session.userid],function(err,result){
              if(err){
                  res.status(500).send('data read error!!');
              }
              fs.readFile('lawyerinfo.ejs','utf-8',function(err,data){
                     if(err){
                           res.status(500).send('file read error!!');
                     }
                     res.send(ejs.render(data,{
                        data:result
                     }));
              });
       });
});
router.put('/info',function(req,res){
       var data=[req.body.identify,req.body.name,req.body.email,req.body.phone,req.body.office,req.body.major,req.body.userid];
       client.query('update LAWYER identify=?,name=?,email=?,phone=?,office=?,major=? where userid=?',function(err,result){
              if(err){
                    res.status(500).send('data update error!!');
              }
       });
       res.redirect('/info');
});
module.exports = router;
