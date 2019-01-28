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
    if(req.session.userid){   //세션을 제거하고 없앰.
        req.session.destroy(function(){
            req.session;
	    res.redirect('/');   //세션을 제거한 뒤 홈으로 돌어감.
        });

    }
});
module.exports=router
