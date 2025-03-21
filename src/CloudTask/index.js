import db from '../DB/db.js'
import { authenticateToken } from '../Auth/index.js'
import SQLAPI from './sqlLite.js'
import dayjs from 'dayjs'
import { createTimedTask, executeTaskByID, batchExecuteTaskByAcc } from './task.js'
export function setCloudTaskFn(app) {
    // 当应用退出或不再需要连接时，关闭连接池
    process.on('SIGINT', async () => {
        await db.close()
        console.log('Connection db closed.')
        process.exit(0)
    })
    // 批量添加云盘账号密码
    app.post('/task/account/batch/update', authenticateToken, async (req, res) => {
        SQLAPI.InsertOrUpdateCloudUserFn(req.body.list, res)
    });
    // 批量删除云盘账号
    app.post('/task/account/batch/delete', authenticateToken, async (req, res) => {
        SQLAPI.BatchDeleteFn('cloud_users', 'account', req.body.list, res)
    });
    // 获取云盘账号列表
    app.post('/task/account/list', authenticateToken, async (req, res) => {
        SQLAPI.GetAllData('cloud_users', ['account', 'cookies'], res,)
    });
    // 获取cookies
    app.post('/task/account/getCookies', authenticateToken, async (req, res) => {
        SQLAPI.getOneData('cloud_users', 'account', req.body.account, res, ['account', 'cookies'])
    });
    // 创建订阅任务
    app.post('/task/create', authenticateToken, async (req, result) => {
        const time = dayjs().format('YYYY-MM-DD HH:mm:ss')
        const taskData = {
            ...req.body,
            create_time: time,
            update_time: time,
        }
        SQLAPI.insertDataFn('task', taskData, result)
    })
    // 查询所有任务
    app.post('/task/list', authenticateToken, async (req, result) => {
        SQLAPI.GetAllData('task', [], result)
    })
    app.post('/task/list/page', authenticateToken, async (req, result) => {
        const { current = 1, pageSize = 10, task_name = '' } = req.body
        let whereClause = task_name ? `WHERE task_name LIKE '%${task_name}%'` : ''
        // 计算总数
        const totalCountQuery = `SELECT COUNT(*) AS total FROM task ${whereClause}`
        // 分页查询
        const offset = (current - 1) * pageSize
        const selectSql = `SELECT * FROM task ${whereClause} ORDER BY create_time DESC LIMIT ${pageSize} OFFSET ${offset}`
        db.get(totalCountQuery, [], (err, countRow) => {
            if (err) {
                result.status(500).json(err)
            } else {
                db.all(selectSql, [], (selectErr, rows) => {
                    if (selectErr) {
                        console.error('Query failed: ' + selectErr.message)
                        result.status(500).json(selectErr)
                    } else {
                        result.status(200).json({
                            res_code: 0, res_message: '查询成功', data: {
                                total: countRow.total, data: rows
                            }
                        })
                        // console.log(rows)
                    }
                })
            }
        })
    })
    // 查询任务详情
    app.post('/task/detail', authenticateToken, async (req, result) => {
        SQLAPI.getOneData('task', 'id', req.body.id, result)
    })
    //删除任务
    app.post('/task/delete', authenticateToken, async (req, result) => {
        SQLAPI.BatchDeleteFn('task', 'id', req.body.list, result)
    })
    // 编辑任务
    app.post('/task/update', authenticateToken, async (req, result) => {
        SQLAPI.updateDataFn('task', 'id', req.body, result)
    })
    // 获取配置信息
    app.post('/task/config/get', authenticateToken, async (req, result) => {
        SQLAPI.GetAllData('config', [], result)
    })
    // 更新配置信息
    app.post('/task/config/update', authenticateToken, async (req, result) => {
        SQLAPI.updateDataFn('config', 'id', req.body).then(() => {
            createTimedTask(result)
        }).catch((err) => {
            handleError(err, result, '更新任务 /task/config/update')
        })
    })
    // 运行任务
    app.post('/task/run', authenticateToken, async (req, result) => {
        executeTaskByID(req.body.id, result)
    })
    // 执行所有任务
    app.post('/task/run/all', authenticateToken, async (req, result) => {
        batchExecuteTaskByAcc(req.body.account, result)
    })
}

// 插入数据



