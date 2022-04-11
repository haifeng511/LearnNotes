// 导入mysql模块
const mysql = require('mysql')

// 建立数据库连接
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'test',
});

//  增 删 改 查sql ? 表示占位符
const query_sql = 'select * from user';
const add_sql = 'insert into user(username,password) values(?, ?)';
const del_sql = 'delete from user where id = ?';
const upd_sql = 'update user set username=?, password=? where id=?';
// 数据对象的每个属性和数据表的字段一一对应
const add_sql2 = 'insert into user set ?';
const upd_sql2 = 'update user set ? where id=?';

// 查询
db.query(query_sql, (err, results) => {
    if (err) return console.log(err.message)
    console.log(results)
})

// 增加
const user = { name: 'add', password: '123' };
const user2 = { username: 'add2', password: '123' };
// 使用数组的形式为占位符指定具体的值
db.query(add_sql, [user.name, user.password], (err, results) => {
    if (err) return console.log(err.message);
    if (results.affectedRows === 1) {
        console.log('插入数据成功');
    }
});
db.query(add_sql2, user2, (err, results) => {
    if (err) return console.log(err.message);
    if (results.affectedRows === 1) {
        console.log('插入数据成功2');
    }
});

// 修改
const upd_user = { id: 5, name: 'upd', password: '123' };
const upd_user2 = { id: 6, username: 'upd2', password: '123' };
db.query(upd_sql, [upd_user.name, upd_user.password, upd_user.id], (err, results) => {
    if (err) return console.log(err.message);
    if (results.affectedRows === 1) {
        console.log('修改数据成功');
    }
});
// 注意这里要传入第一个参数修改的对象，第二个参数是id
db.query(upd_sql2, [upd_user2, upd_user2.id], (err, results) => {
    if (err) return console.log(err.message);
    if (results.affectedRows === 1) {
        console.log('修改数据成功2');
    }
});

// 删除
db.query(del_sql, 7, (err, results) => {
    if (err) return console.log(err.message);
    if (results.affectedRows === 1) {
        console.log('删除数据成功');
    }
});