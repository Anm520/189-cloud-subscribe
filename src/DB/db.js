import sqlite3 from 'sqlite3'
import { fileURLToPath, URL } from 'url'
import path from 'path'
import bcrypt from 'bcryptjs';

// 获取当前文件的 URL
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// 设置数据库文件的路径为当前目录下的 myDatabase.db
const dbPath = path.resolve(__dirname, 'myDatabase.db')
// 创建一个数据库连接
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        // 如果发生错误，则输出错误信息
        console.error(err.message)
    } else {
        console.log('Connected to the myDatabase.db database.')
    }
})
// 创建系统users 表（如果不存在）
const createUserTableSql = `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT DEFAULT NULL,
  update_time TEXT DEFAULT NULL
);`
db.run(createUserTableSql, (err) => {
    if (err) {
        console.error('Table creation failed: ' + err.message)
    } else {
        console.log('Users table created or verified successfully.')
        db.all(`SELECT * FROM users;`, [], async (err, rows) => {
            if (err) {
                console.error('DB/db.js》〉获取用户表信息失败:', err.message)
                return
            }
            if (rows.length > 0) {
                console.log('已经有账号了');
            } else {
                console.log('还没有账号');
                const hash = await bcrypt.hash('admin', 10);
                db.run('INSERT INTO users (username, password) VALUES (?, ?)', ['admin', hash], function (err) {
                    if (err) {
                        console.log('插入初始化账户失败>>>>>:', err);
                    }
                    console.log('初始化账户成功>>>>:账号admin，密码admin',);

                })
            }
        })
    }
})
// 创建 users 表（如果不存在）
const createCloudUserTableSql = `
CREATE TABLE IF NOT EXISTS cloud_users (
  account TEXT NOT NULL PRIMARY KEY,
  login_name TEXT DEFAULT NULL,
  nickname TEXT DEFAULT NULL,
  sessionKey TEXT DEFAULT NULL,
  cookies TEXT DEFAULT NULL,
  update_time TEXT DEFAULT NULL,
  password TEXT DEFAULT NULL
);
`
db.run(createCloudUserTableSql, (err) => {
    if (err) {
        console.error('Table creation failed: ' + err.message)
    } else {
        console.log('Cloud_Users table created or verified successfully.')
    }
})

// 创建 task 表（如果不存在）
const createTaskTableSql = `
CREATE TABLE IF NOT EXISTS task (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task_name TEXT DEFAULT NULL,
  share_id TEXT DEFAULT NULL,
  share_file_id TEXT DEFAULT NULL,
  share_code TEXT DEFAULT NULL,
  share_mode INTEGER DEFAULT NULL,
  share_count INTEGER DEFAULT NULL,
  access_code TEXT DEFAULT NULL,
  update_time TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now')),
  save_path_id TEXT DEFAULT NULL,
  save_path_name TEXT DEFAULT NULL,
  save_type INTEGER DEFAULT 0,
  status INTEGER DEFAULT 1,
  create_time TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now')),
  create_id INTEGER DEFAULT NULL,
  deleted INTEGER DEFAULT 0,
  task_count INTEGER DEFAULT NULL,
  description TEXT DEFAULT NULL,
  share_url TEXT DEFAULT NULL,
  account TEXT DEFAULT NULL,
  login_name TEXT DEFAULT NULL,
  episode INTEGER DEFAULT NULL,
  episode_total INTEGER DEFAULT NULL
);
`
// const add = `ALTER TABLE task ADD COLUMN access_code TEXT DEFAULT NULL;`
// db.run(add, (err) => {
//     if (err) {
//         console.error('Table add failed: ' + err.message)
//     } else {
//         console.log('Task table add or verified successfully.')
//     }
// })
db.run(createTaskTableSql, (err) => {
    if (err) {
        console.error('Table creation failed: ' + err.message)
    } else {
        console.log('Task table created or verified successfully.')
    }
})
// 创建系统config 表（如果不存在）
const createConfigTableSql = `CREATE TABLE IF NOT EXISTS config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    time_interval INTEGER DEFAULT 30,
    is_execute INTEGER DEFAULT 0,
    timer TEXT DEFAULT NULL,
    ding_talk_token TEXT DEFAULT NULL,
    tg_bot_token TEXT DEFAULT NULL,
    update_time TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now')),
    tg_chat_id TEXT DEFAULT NULL,
    wx_push_spt TEXT DEFAULT NULL,
    chanel_url TEXT DEFAULT NULL
  );`
db.run(createConfigTableSql, (err) => {
    if (err) {
        console.error('ConfigTable creation failed: ' + err.message)
    } else {
        console.log('Config table created or verified successfully.')
        db.all(`SELECT * FROM config;`, [], async (err, rows) => {
            if (err) {
                console.error('DB/db.js》〉config表信息失败:', err.message)
                return
            }
            if (rows.length > 0) {
                console.log('已经有配置了');
            } else {
                console.log('还没有配置');

                db.run('INSERT INTO config (id) VALUES (?)', [1], function (err) {
                    if (err) {
                        console.log('插入初始化配置户失败>>>>>:', err);
                    }
                    console.log('初始化配置成功>>>>',);

                })
            }
        })
    }
})
export default db