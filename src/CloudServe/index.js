import CloudAPI from './send.js'
import SQLAPI from '../CloudTask/sqlLite.js'
import { handleError } from '../unitl/index.js';
import { authenticateToken } from '../Auth/index.js';
export function setCloudServeFn(app) {
    // 获取用户空间信息
    app.post('/cloud/serve/getUserSizeInfo', authenticateToken, async (req, res) => {
        CloudAPI.getUserSizeInfo(req.headers.cloud, res)
    });
    // 云盘账号登陆
    app.post('/cloud/serve/login', authenticateToken, async (req, res) => {
        SQLAPI.LoginByAccountFn(req.body.account, res).catch(err => {
            console.log('云盘账号登陆 错误捕捉 >>>>>:', err);
        })
    });
    // 获取文件列表
    app.post('/cloud/serve/getListFiles', authenticateToken, async (req, res) => {
        CloudAPI.getListFiles(req.body, req.headers.cloud, res)
    });
    // 创建目录
    app.post('/cloud/serve/createFolder', authenticateToken, async (req, res) => {
        CloudAPI.createFolder(req.body, req.headers.cloud, res)
    });

    // 创建批量任务
    app.post('/cloud/serve/createBatchTask', authenticateToken, async (req, res) => {
        CloudAPI.createBatchTask(req.body, req.headers.cloud).then((el) => {
            CloudAPI.checkBatchTaskFn({ taskId: el.taskId, type: req.body.type, cookie: req.headers.cloud, result: res })
        }).catch((err) => {
            handleError(err, res, '创建批量任务 /cloud/serve/createBatchTask')
        })
    });
    // 重命名文件夹
    app.post('/cloud/serve/renameFolder', authenticateToken, async (req, res) => {
        CloudAPI.renameFolder(req.body, req.headers.cloud, res)
    });
    //  获取分享信息
    app.post('/cloud/serve/getShareInfoByCode', authenticateToken, async (req, res) => {
        CloudAPI.getShareInfoByCode(req.body.shareCode, req.headers.cloud, res)
    })
    // 获取分享目录列表
    app.post('/cloud/serve/getListShareDir', authenticateToken, async (req, res) => {
        CloudAPI.getListShareDir(req.body, req.headers.cloud, res)
    })
    // 获取下级目录节点
    app.post('/cloud/serve/getObjectFolderNodes', authenticateToken, async (req, res) => {
        CloudAPI.getObjectFolderNodes(req.body.id, req.headers.cloud, res)
    })
    // 获取下级目录节点
    app.post('/cloud/serve/getFullPath', authenticateToken, async (req, res) => {
        CloudAPI.getFullPath(req.body.fileId, req.headers.cloud, res).then((el) => {
            res.status(200).json({ res_code: 0, res_message: '获取成功', data: { ...el } })
        })
    })
    // 回收站
    app.post('/cloud/serve/getRecycleList', authenticateToken, async (req, res) => {
        CloudAPI.getRecycleList(req.headers.cloud, res)
    })


}