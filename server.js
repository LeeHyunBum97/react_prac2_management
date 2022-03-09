const express = require("express"); // express모듈 불러오기
const bodyParser = require("body-parser"); 
const app = express(); 
const port = process.env.PORT || 5000; // 기본 포트 번호는 5000으로 설정
const path = require("path") 

const mysql = require('mysql'); // mysql모듈 불러오기 
const fs = require('fs'); //database.json파일로 부터 db환경설정을 불러오기 위해 파일 접근 라이브러리 가져오기
const cors = require('cors');

const data = fs.readFileSync('./database.json'); //fs라이브러리의 fs.readFileSync('파일경로') 로 접근
const conf = JSON.parse(data) //가지고온 데이터를 JSON파일로 형변환 후 conf에 저장

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const multer = require('multer')
const upload = multer({ dest: './upload' })

/* 아래는 mysql의 db를 연결해 객체로 만들어 다룰 수 있도록 connect객체를 초기화한다.
   각 host, user 등의 데이터 속성은 conf에 담긴 database.json의 값을 말하며.*/ 
const connection = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  port: conf.port,
  database: conf.database
});
connection.connect(); // connection객체의 connect()함수를 수행하므로써 실제로 연결이 되도록 한다.

app.get('/api/customer', (req, res) => { //고객목록을 보여주는 customers API
  connection.query('SELECT * FROM customer', function (error, rows, fields) {
    res.header("Access-Control-Allow-Origin", "*");
    res.send(rows);
  })
})

app.use('/image', express.static('./upload'))
// 사용자입장에서 /image로 접근을 하는데 실제 서버에 ./upload와 매핑
// app.post('/api/customers',upload.single('image'), (req,res)=> {
//   console.log(req.body)
// })
app.post('/api/customer', upload.single('image'), (req, res) => {
  console.log('hh')
  let sql = 'INSERT INTO customer VALUES (null, ?,?,?,?,?,now(),0)';
  let image = '/image' + req.file.filename;
  let name = req.body.name;
  let birthday = req.body.birthday;
  let gender = req.body.gender;
  let job = req.body.job;
  console.log(name);
  console.log(image)
  console.log(birthday)
  console.log(gender)
  console.log(job)
  let params = [image, name, birthday, gender, job]
  connection.query(sql, params,
    (err, rows, fields) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.send(rows);
      console.log(err)
      console.log(rows)
    })

})
app.delete('/api/customer/:id', (req,res)=>{
  let sql = 'UPDATE customer SET isDeleted = 1 WHERE id = ?';
  let params = [req.params.id];
  connection.query(sql, params, 
    (err, rows, fields) => {
      res.send(rows)
    })
})


app.listen(port, function () { // 5000번 포트에서 서버를 동작시키고 console문 출력 
  console.log(`Listening on port ${port}`)
});



























// const express = require("express");
// const bodyParser = require("body-parser");
// const app = express();
// const port = process.env.PORT || 5000;
// const mysql = require('mysql');
// const fs = require('fs');


// var cors = require('cors');
// app.use(cors());
// app.use(express.urlencoded({extended:true}));
// app.use(express.json())




// const data = fs.readFileSync('./database.json');
// const conf = JSON.parse(data)

// const connection = mysql.createConnection({
//   host: conf.host,
//   user: conf.user,
//   password: conf.password,
//   port: conf.port,
//   database: conf.database
// });
// connection.connect();

// const multer = require('multer')
// const upload = multer({ dest: './upload' })


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.get('/api/customers', (req, res) => {
//   connection.query('SELECT * FROM customer', function (error, rows, fields) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.send(rows);
//   })
// })

// app.use('/image', express.static('./upload'))
// // 사용자입장에서 /image로 접근을 하는데 실제 서버에 ./upload와 매핑

// app.post('/api/customers', upload.single('image'), (req, res) => {
//   console.log('hh')
//   let sql = 'INSERT INTO customer VALUES (null, ?,?,?,?,?)';
//   let image = '/image' + req.file.filename;
//   let name = req.body.name;
//   let birthday = req.body.birthday;
//   let gender = req.body.gender;
//   let job = req.body.job;
//   console.log(name);
//   console.log(image)
//   console.log(birthday)
//   console.log(gender)
//   console.log(job)
//   let params = [image, name, birthday, gender, job]
//   connection.query(sql, params,
//     (err, rows, fields) => {
//       res.header("Access-Control-Allow-Origin", "*");
//       res.send(rows);
//       console.log(err)
//       console.log(rows)
//     })

// })


// app.listen(port, function () {
//   console.log(`Listening on port ${port}`)
// });
