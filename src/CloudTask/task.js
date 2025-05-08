// 执行任务相关逻辑，复杂，单独放一个文件

import CloudAPI from "../CloudServe/send.js";
import db from "../DB/db.js";
import { handleError } from "../unitl/index.js";
import { findDifference, extractEpisodeNumber } from "../unitl/index.js";
import SQLAPI from "./sqlLite.js";
import { pushMessage } from "./pushMessage.js";
import {
  errorCode,
  isWithinTaskTimeRange,
  isWithinTaskWeekRange,
} from "../unitl/index.js";
import dayjs from "dayjs";
let timer = null;
/** 判断当前时间是否在任务时间范围内 */
const isCurrentTimeInTaskRange = () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM config`, (err, rows) => {
      if (err) {
        console.log("isCurrentTimeInTaskRange >>>", err);
        reject(false);
      } else {
        const { task_start_time = "", task_end_time = "" } = rows[0];
        if (task_start_time && task_end_time) {
          const res = isWithinTaskTimeRange(task_start_time, task_end_time);
          res ? resolve(true) : resolve(false);
        }
        reject(false);
      }
    });
  });
};

/**
 * 单独 立即执行一个任务，执行此函数必须已验证cookie正常未失效
 * @param {*} taskRow 任务信息
 * @param {*} cookie cookie
 * @param {*} result 返回结果
 */
async function executeTaskFn(taskRow, result) {
  const shareParams = {
    noCache: Math.random(),
    shareId: taskRow.share_id,
    fileId: taskRow.share_file_id,
    shareDirFileId: taskRow.share_file_id,
    isFolder: true,
    shareMode: taskRow.share_mode,
    orderBy: "filename",
    descending: false,
  };
  // console.log(' taskRow>>>>>:', taskRow);
  const accountInfo = await SQLAPI.getOneData(
    "cloud_users",
    "account",
    taskRow.account
  );
  const cookie = (accountInfo && accountInfo.cookies) || "";
  // console.log('accountInfo >>>>>:', accountInfo);
  if (!cookie)
    return handleError(
      { message: "executeTaskFn 任务执行，获取cookie失败" },
      result,
      "executeTaskFn 任务执行，获取cookie失败"
    );
  // return console.log('executeTaskFn结束 >>>>>:', accountInfo);
  // 获取分享文件列表
  let shareFilesInfo = await CloudAPI.getListShareDir(shareParams, cookie);
  // console.log('executeTaskFn shareFilesInfo>>>>>:', shareFilesInfo);
  // 错误处理
  if (shareFilesInfo.res_code != 0) {
    handleError(
      shareFilesInfo,
      result,
      "executeTaskFn 任务执行，获取分享目录系信息失败"
    );
    if (errorCode[shareFilesInfo.res_code]) {
      const errorMsg = `【${taskRow.task_name}】:${
        errorCode[shareFilesInfo.res_code]
      }`;
      console.log(errorMsg);
      pushMessage("err", errorMsg);
    }
    return;
  }
  if (taskRow.filter_text) {
    if (taskRow.filter_text_type == 2) {
      // 不包含匹配文字
      shareFilesInfo.fileListAO.fileList =
        shareFilesInfo.fileListAO.fileList.filter((item) => {
          return !item.name.includes(taskRow.filter_text);
        });
    } else {
      // 包含匹配的文字
      shareFilesInfo.fileListAO.fileList =
        shareFilesInfo.fileListAO.fileList.filter((item) => {
          return item.name.includes(taskRow.filter_text);
        });
    }
  }
  if (taskRow.episode_filter_num && taskRow.episode_filter_num > 0) {
    shareFilesInfo.fileListAO.fileList =
      shareFilesInfo.fileListAO.fileList.filter((item) => {
        const num = extractEpisodeNumber(item.name);
        if (!num && num != 0) return true;
        if (taskRow.episode_filter_type == 2) {
          // 小于
          return num < taskRow.episode_filter_num;
        }
        return num > taskRow.episode_filter_num;
      });
  }
  const params = {
    mediaType: "0",
    folderId: String(taskRow.save_path_id),
    orderBy: "filename",
    descending: false,
  };
  // 获取自己云盘保存目录的文件列表
  const ListFilesInfo = await CloudAPI.getListFiles(params, cookie);
  if (!ListFilesInfo.fileListAO) {
    handleError(
      ListFilesInfo,
      result,
      "executeTaskFn 任务执行，获取自己云盘保存目录的文件列表失败"
    );
    return;
  }
  //   console.log('OwnFilesInfo >>>>>:', ListFilesInfo)
  // 自己的文件列表
  const OwnFilesInfo = ListFilesInfo.fileListAO;

  // 自己的文件列表和分享目录的文件列表 进行对比 找出差异文件和目录
  // added 新增的文件
  const { added: addedFile } = findDifference(
    OwnFilesInfo.fileList,
    shareFilesInfo.fileListAO.fileList,
    "md5"
  );
  let added = [];
  if (taskRow.save_type == 1) {
    const { added: addedFolder } = findDifference(
      OwnFilesInfo.folderList,
      shareFilesInfo.fileListAO.folderList,
      "name"
    );
    added = [...addedFile, ...addedFolder];
  } else {
    added = [...addedFile];
  }
  //   console.log('addedFile >>>>>:', added)
  if (added.length <= 0 || !added) {
    console.log("executeTaskFn 没有需要同步的文件 >>>>>:", taskRow.task_name);
    result &&
      result
        .status(200)
        .json({ res_code: 0, res_message: "没有需要同步的文件" });
    return;
  }
  const taskInfos = added.map((item) => {
    return { fileId: item.id, fileName: item.name, isFolder: 0 };
  });
  const taskParams = {
    type: "SHARE_SAVE",
    taskInfos: JSON.stringify(taskInfos),
    targetFolderId: taskRow.save_path_id,
    shareId: taskRow.share_id,
  };
  // 创建批量转村任务
  CloudAPI.createBatchTask(taskParams, cookie)
    .then((el) => {
      SQLAPI.updateDataFn("task", "id", {
        id: taskRow.id,
        episode: shareFilesInfo.fileListAO.fileList.length,
      });
      // 校验批量任务是否执行完毕
      CloudAPI.checkBatchTaskFn(
        {
          taskId: el.taskId,
          type: taskParams.type,
          cookie,
          result,
          task_name: taskRow.task_name,
        },
        0,
        { task_name: taskRow.task_name, added, account: taskRow.account }
      );
    })
    .catch((err) => {
      handleError(
        err,
        result,
        "任务执行失败：executeTaskFn ==> CloudAPI.createBatchTask :"
      );
    });
}
/* 获取任务信息
 */
function getTaskInfo(id) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM task WHERE id = ?`, [id], (err, row) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(row);
      }
    });
  });
}
// 根据任务id单次执行同步任务
export function executeTaskByID(id, result) {
  getTaskInfo(id)
    .then((res) => {
      // console.log('executeTaskByID >>>>>:', res);
      executeTaskFn(res, result);
    })
    .catch((err) => {
      handleError(
        err,
        result,
        "任务执行失败：executeTaskByID ==> getTaskInfo :"
      );
    });
}
// 批量执行
export async function batchExecuteTaskByAcc(account, result) {
  let sql = "SELECT * FROM task WHERE status = 1";
  let params = [];
  if (account) {
    sql += " AND account = ?";
    params.push(account);
  }
  db.all(sql, params, (err, rows) => {
    if (err) {
      handleError(err, result, "任务执行失败：batchExecuteTask ==> db.all :");
    } else {
      // console.log(' batchExecuteTaskByAcc>>>', rows)
      rows.forEach(async (row) => {
        if (result) {
          // 手动执行
          executeTaskFn(row);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          return;
        }
        if (isWithinTaskWeekRange(row.task_week)) {
          //自动执行任务
          executeTaskFn(row);
          // 添加延时，防止并发错误
          await new Promise((resolve) => setTimeout(resolve, 2000));
          return;
        }
      });
      result &&
        result.status(200).json({ res_code: 0, res_message: "任务已执行" });
    }
  });
}
// 校验cookie函数
async function checkCookieFn(accountRow, errMsgList) {
  const res = await CloudAPI.getFullPath({ fileId: "-11" }, accountRow.cookies);
  if (res.errorCode == "InvalidSessionKey") {
    console.log(
      "cookie过期，正在尝试重新登录 >>>>>:",
      accountRow.account,
      dayjs().format("YYYY-MM-DD HH:mm:ss")
    );
    return SQLAPI.LoginByAccountFn(accountRow.account).then((el) => {
      errMsgList.push(el);
    });
  }
}
// 批量校验cookie函数 并执行任务
async function batchCheckCookieFn() {
  const isTaskExecutionTime = await isCurrentTimeInTaskRange();
  if (!isTaskExecutionTime) return; // 未在执行时间范围内就停止
  SQLAPI.GetAllData("cloud_users", ["account", "cookies"]).then((rows) => {
    let errMsgList = [];
    let requestList = rows.map((row) => checkCookieFn(row, errMsgList));
    Promise.all(requestList).then((res) => {
      if (errMsgList.length > 0) {
        pushMessage("cookieErr", errMsgList);
      }
      batchExecuteTaskByAcc("");
    });
  });
}
function createTimedTask(result) {
  db.all(`SELECT * FROM config`, (err, rows) => {
    if (err) {
      console.log("createTimedTask >>>", err);
      result && result.status(500).json(err);
    } else {
      const row = rows[0];
      if (row && row.is_execute == 1) {
        timer && clearInterval(timer);
        timer = setInterval(() => {
          console.log(
            "定时任务执行开始...",
            dayjs().format("YYYY-MM-DD HH:mm:ss")
          );
          batchCheckCookieFn();
        }, 1000 * 60 * row.time_interval);
        console.log(
          "定时任务执行开始......",
          dayjs().format("YYYY-MM-DD HH:mm:ss")
        );
        result &&
          result
            .status(200)
            .json({ res_code: 0, res_message: "定时任务已执行" });
      }
      if (row && row.is_execute == 0) {
        if (timer) {
          console.log("定时任务已关闭 >>>>>:");
          clearInterval(timer);
        }
        result &&
          result
            .status(200)
            .json({ res_code: 0, res_message: "定时任务已关闭" });
      }
    }
  });
}
export { createTimedTask };
