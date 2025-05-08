import qs from 'qs'
import axios from '../unitl/axios.js'
import { handleError, setCookies } from '../unitl/index.js'
import { pushMessage } from '../CloudTask/pushMessage.js'

//获取文件列表
/**
 * @param {Object} params - 请求参数
 * @param {String} cookies - cookie
 * @param {Object} result - 返回结果
 */
async function getListFiles(params, cookie, result) {
    const { pageSize, pageNum, mediaType, folderId, iconOption, orderBy, descending, noCache = Math.random() } = params
    const url = `https://cloud.189.cn/api/open/file/listFiles.action?${qs.stringify({
        pageSize,
        pageNum,
        mediaType,
        folderId,
        iconOption,
        orderBy,
        descending,
        noCache,
    })}`
    return axios
        .get(url, {
            headers: {
                accept: 'application/json;charset=UTF-8',
                'sign-type': '1',
                cookie: cookie,
            },
        })
        .then((res) => {
            result && result.status(200).json(res)
            return Promise.resolve(res)
        })
        .catch((err) => {
            handleError(err, result, '获取文件列表 getListFiles')
            return Promise.reject(err)
        })
}

/**
 * 获取目录文件夹
 * @param {*} id - 文件夹ID
 * @param {*} cookie - cookie
 * @param {*} result - 返回结果
 */
async function getObjectFolderNodes(id, cookie, result) {
    axios
        .post(
            `https://cloud.189.cn/api/portal/getObjectFolderNodes.action?noCache=${Math.random()}`,
            qs.stringify({ id: id, orderBy: 1, order: 'ASC' }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Accept: 'application/json;charset=UTF-8',
                    cookie: cookie,
                },
            },
        )
        .then((res) => {
            // console.log('获取目录文件夹 getObjectFolderNodes>>>>>:', res);
            if (res.errorCode) {
                handleError(res, result, '获取目录文件夹 getObjectFolderNodes')
            } else {
                result &&
                    result.status(200).json({
                        data: res,
                        res_code: 0,
                        res_msg: '查询成功',
                    })
            }

        })
        .catch((err) => {
            handleError(err, result, '获取目录文件夹 getObjectFolderNodes')
        })
}

/**
 * 获取用户存储空间信息
 * @param {*} cookie - cookie
 * @param {*} result - 返回结果
 */
function getUserSizeInfo(cookie, result) {
    // console.log('getUserSizeInfo cookie>>>>>:', cookie);
    axios
        .get(`https://cloud.189.cn/api/portal/getUserSizeInfo.action?noCache=${Math.random()}`, {
            headers: {
                accept: 'application/json;charset=UTF-8',
                'sign-type': '1',
                cookie: cookie,
            },
        })
        .then((res) => {
            result && result.status(200).json(res)
        })
        .catch((err) => {
            handleError(err, result, '获取文件列表 getListFiles')
        })
}
/**
 * @description: 创建文件夹
 * @param {*} params ==> {folderName: '',parentFolderId:11}
 * @param {*} cookie
 * @return {*}
 */
async function createFolder(params, cookie, result) {
    const url = `https://cloud.189.cn/api/open/file/createFolder.action?noCache${Math.random()}`
    return axios
        .post(url, qs.stringify(params), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                accept: 'application/json;charset=UTF-8',
                'sign-type': '1',
                cookie: cookie,
            },
        })
        .then((res) => {
            result && result.status(200).json(res)
        })
        .catch((err) => {
            handleError(err, result, '创建文件夹 createFolder')
        })
}

/**
 * 创建批量任务
 * @param {Object} params - 请求所需的参数对象，通常包括但不限于：
 *   - type: {String} 任务类型标识符 （例如："SHARE_SAVE"）
 *   - taskInfos: {Array} 需要处理的文件列表
 *   - targetFolderId: {String} 保存目录ID
 *   - shareId: {Object} 分享ID
 * @param {Object} cookies - 包含用户会话信息的cookies对象
 * @returns {Promise} - 返回axios库发起的POST请求的Promise对象
 */
const createBatchTask = (params, cookie) => {
    const url = `https://cloud.189.cn/api/open/batch/createBatchTask.action?noCache${Math.random()}`
    try {
        return axios.post(url, qs.stringify(params), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                accept: 'application/json;charset=UTF-8',
                'sign-type': '1',
                // 'Browser-Id': 'f8947534d7a9fd164b23469f8341bc71',
                cookie: cookie,
                // origin: 'https://cloud.189.cn',
            },
        })
    } catch (error) {
        console.error('Error occurred:')
    }
}
/**
 * 校验任务状态
 * @param {Object} params - 请求所需的参数对象，通常包括但不限于：
 *   - type: {String} 任务类型标识符 （例如："SHARE_SAVE"）
 *   - taskId: {String｜Number} 任务ID
 * @param {Object} cookies - 包含用户会话信息的cookies对象
 * @returns {Promise} - 返回axios库发起的POST请求的Promise对象
 */
const checkBatchTask = (params, cookie) => {
    const url = `https://cloud.189.cn/api/open/batch/checkBatchTask.action?noCache=${Math.random()}`
    return axios.post(url, qs.stringify(params), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            accept: 'application/json;charset=UTF-8',
            'sign-type': '1',
            // 'Browser-Id': '0a7189968638bf30042cd837e65b617f',
            cookie: cookie,
        },
    })
}

/**
 * @description: 执行检查任务状态函数
 * @param {*} params  taskId, type, cookie, result = null
 * @param {*} count 计数，循环20次还没结果就结束
 * @param {*} executeTaskParams 执行订阅任务时才需要的的参数，用来推送消息通知
 * @return {*}
 */
const checkBatchTaskFn = (params, count = 0, executeTaskParams = null) => {
    const { taskId, type, cookie, result = null, task_name = '' } = params
    console.log(' count>>>>>:', count)
    count++
    if (count > 30) {
        return handleError(new Error(`${task_name}查询任务状态超时`), result, 'checkBatchTaskFn')
    }
    checkBatchTask(
        {
            taskId,
            type,
        },
        cookie,
    )
        .then((res) => {
            if (res.res_code == 0 && res.taskStatus == 4) {
                result && result.status(200).json(res)
                // executeTaskParams && console.log('executeTaskParams >>>>>:', executeTaskParams);
                executeTaskParams && pushMessage('task', executeTaskParams)
                return
            }
            if (res.res_code == 0 && res.taskStatus == -1) {
                handleError(res, result, '执行检查任务状态函数1')
            }
            if (res.res_code == 0 && res.taskStatus != 4 && res.taskStatus != -1) {
                // 进入循环
                setTimeout(() => {
                    checkBatchTaskFn(params, count, executeTaskParams)
                }, 2000)
            } else {
                handleError(res, result, '执行检查任务状态函数2')
            }
        })
        .catch((err) => {
            // console.log('执行检查任务状态函数失败 2222222>>>>>:', err);
            handleError(err, result, '执行检查任务状态函数3')
        })
}
/**
 * 文件重命名
 * @param {Object} params - 请求所需的参数对象，通常包括但不限于：
 *   - folderId: {String} 文件夹ID
 *   - destFolderName: {String} 文件夹重命名后的名称
 * @param {Object} cookie - 包含用户会话信息的cookies对象
 * @returns {result} - 返回axios库发起的POST请求的Promise对象
 */
async function renameFolder(params, cookie, result) {
    //   console.log('sendRenameFolder >>>', params)
    const url = `https://cloud.189.cn/api/open/file/renameFolder.action?noCache=${Math.random()}`
    const data = { folderId: params.folderId, destFolderName: params.destFolderName }
    axios
        .post(url, qs.stringify(data), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json;charset=UTF-8',
                cookie: cookie,
            },
        })
        .then((res) => {
            result && result.status(200).json(res)
        })
        .catch((err) => {
            handleError(err, result, '文件重命名 renameFolder')
        })
}
//  获取分享链接信息
function getShareInfoByCode(shareCode, cookie, result) {
    axios
        .get(`https://cloud.189.cn/api/open/share/getShareInfoByCodeV2.action?shareCode=${shareCode}`, {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                accept: 'application/json;charset=UTF-8',
                cookie: cookie,
                'sign-type': '1',
                // 'Browser-Id': '0a7189968638bf30042cd837e65b617f',
            },
        })
        .then((res) => {
            result && result.status(200).json(res)
        })
        .catch((err) => {
            handleError(err, result, '获取分享链接信息 getShareInfoByCode')
        })
}

//  获取分享目录信息
async function getListShareDir(params, cookie, result) {
    try {
        const res = await axios
            .get(`https://cloud.189.cn/api/open/share/listShareDir.action?${qs.stringify(params)}`, {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    accept: 'application/json;charset=UTF-8',
                    cookie: cookie,
                    'sign-type': '1',
                    'Browser-Id': '0a7189968638bf30042cd837e65b617f',
                },
            })
        // console.log('getListShareDir获取分享目录信息 >>>>>:', res);
        result && result.status(200).json(res)
        return await Promise.resolve(res)
    } catch (err) {
        handleError(err, result, '获取分享目录信息 getListShareDir')
        return await Promise.reject(err)
    }
}
//获取目录路径
async function getFullPath(fileId, cookie, result) {

    console.log('fileId >>>', fileId)
    const url = `https://cloud.189.cn/api/portal/listFiles.action?${qs.stringify({
        fileId,
        noCache: Math.random(),
    })}`
    try {
        return axios.get(url, {
            headers: {
                accept: 'application/json;charset=UTF-8',
                'sign-type': '1',
                cookie: cookie,
            },
        })
    } catch (error) {
        handleError(error, result, '获取目录路径 sendFullPath')
    }
}
// 获取回收站列表
function getRecycleList(cookie, result) {
    const url = `https://cloud.189.cn/api/portal/listRecycleBinFilesV3.action?${qs.stringify({
        pageNum: 1,
        pageSize: 3000,
        iconOption: 1,
        family: false,
        noCache: Math.random(),
    })}`
    axios.get(url, {
        headers: {
            accept: 'application/json;charset=UTF-8',
            cookie: cookie,
        },
    }).then(res => {
        result && result.status(200).json(res)
    }).catch(err => {
        handleError(err, result, '获取回收站列表 getRecycleList')
    })
}
export default {
    getFullPath,
    getListFiles,
    createFolder,
    getObjectFolderNodes,
    renameFolder,
    getShareInfoByCode,
    getListShareDir,
    getUserSizeInfo,
    createBatchTask,
    checkBatchTaskFn,
    checkBatchTask, getRecycleList
}
