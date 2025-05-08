
import db from '../DB/db.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config.js';
import SQLAPI from '../CloudTask/sqlLite.js';
export const authenticateToken = (req, res, next) => {
    const token = req.headers['token']
    if (!token) return res.status(401).json({ res_code: -1, res_message: '未登陆', });
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ res_code: -1, res_message: '登陆失效', });
        req.user = user;
        next();
    });
};

export function setLoginFn(app) {
    // 注册路由
    app.post('/register', authenticateToken, async (req, res) => {
        const { username, password } = req.body;
        const hash = await bcrypt.hash(password, 10);
        SQLAPI.InsertOrUpdateFn('users', 'username', { username, password: hash }, res)
    });
    // 登录路由
    app.post('/login', async (req, res) => {
        const { username, password } = req.body;
        db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
            if (err) {
                console.error('/login接口查询数据失败:', err.message)
                res.status(200).json({
                    res_code: -1,
                    res_message: err.message,
                });
                return
            }
            if (row) {
                // console.log('找到了匹配的记录:', row)
                if (await bcrypt.compare(password, row.password)) {
                    const token = jwt.sign({ id: row.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
                    return res.status(200).json({ res_code: 0, data: token });
                } else {
                    res.status(200).json({
                        res_code: -1,
                        res_message: '密码不正确',
                    });
                }
            } else {
                // console.log('登陆账号不正确')
                res.status(200).json({
                    res_code: -1,
                    res_message: '登陆账号不正确',
                });
                // 根据需要进行插入或其他操作
            }
        });

    });
};
