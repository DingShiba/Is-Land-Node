// 1.导入express
const express = require('express');
const mysql=require("mysql")
const bodyParser = require('body-parser');
const cors = require('cors');
const $moment=require('moment')

// 2.创建服务器的实例对象
const app = express();
app.use(bodyParser.json());
app.use(cors())



// 结合MySQL数据库
const connection = mysql.createConnection({
    host: '129.211.189.126',
    user: 'root',
    password: 'island@cel24',
    database: 'island'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database: ' + err.stack);
        return;
    }
});
app.get('/leaveMessageByPage',(req, res)=>{
    let {startTime,endTime,content}=req.query
    let querySql=`SELECT * FROM leave_message where create_time > '${startTime}' and create_time < '${endTime}'`
    if(!!content && content!=''){
        querySql+=` and content like '%${content}%'`
    }
    querySql+=` order by create_time desc`
    connection.query(querySql, (err, results, fields) => {
        if (err) throw err;
        res.send(results);
    });
})
app.post('/save', (req, res) => {
    /*res.send(results);*/
    const _data=req.body;
    const {content,score} =_data;
    const create_time=$moment().format('YYYY-MM-DD HH:mm:ss');
    const _id=$moment(create_time).format('YYYYMMDDHHmmss')
    connection.query(`insert into leave_message (id,create_time,content,score) values ('${_id}','${create_time}','${content}','${score}')`,(err,rows,fields)=>{
        if (err == null) {
            res.json({
                status: 200
            })
        } else {
            res.json({
                status: 500,
                err, rows, fields
            })
        }
    })
});
// 启动服务器
app.listen(3000, () => {
    console.log('Server started on port 3000');
});






