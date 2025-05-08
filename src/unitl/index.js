import crypto from "crypto";
import { CRYPTO_SECRET_KEY } from "../config.js";
import dayjs from "dayjs";
// 定义密钥和初始化向量 (IV) - 在实际应用中，请确保这些值的安全性
const IV_LENGTH = 16; // AES 块大小固定为 16 字节
/**
 * 加密函数
 * @param {string} message - 要加密的消息
 * @returns {string} - 加密后的消息（包含 IV 和加密内容）
 */
export function encrypt(message) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(CRYPTO_SECRET_KEY),
    iv
  );
  let encrypted = cipher.update(message);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

/**
 * 解密函数
 * @param {string} encryptedMessage - 要解密的加密消息（包含 IV 和加密内容）
 * @returns {string} - 解密后的原始消息
 */
export function decrypt(encryptedMessage) {
  const textParts = encryptedMessage.split(":");
  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(CRYPTO_SECRET_KEY),
    iv
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
/**
 * 设置cookies
 * @param {string} cookies - 要设置的cookies
 * @returns {string} - 设置后的cookies
 */
export function setCookies(cookies) {
  // console.log(' setCookies>>>>>:', cookies.map(cookie => `${cookie.key}=${cookie.value}`).join('; '));
  return cookies.map((cookie) => `${cookie.key}=${cookie.value}`).join("; ");
}
export function handleError(err, result, FnName) {
  console.log(`handleError ${FnName}>>>>>:`, err.message);
  let obj;
  if (err.message) {
    obj = {
      res_code: -1,
      res_message: err.message,
    };
  } else {
    obj = {
      res_code: -1,
      ...err,
    };
  }
  result && result.status(200).json(obj);
}
/**
 * 获取文件大小
 * @param {number} bytes - 文件大小（以字节为单位）
 * @returns {string} - 文件大小（带单位）
 */
export function getFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}
/**
 * 获取差异文件
 * @param {string} arr1 - 列表
 * @returns {string} idKey - 差异判断字段
 */
export function findDifference(arr1, arr2, idKey) {
  const map1 = new Map();
  const map2 = new Map();
  const added = [];
  const removed = [];

  // 填充map1
  arr1.forEach((item) => {
    map1.set(item[idKey], item);
  });

  // 检查arr2中的元素是否存在于map1中
  arr2.forEach((item) => {
    if (!map1.has(item[idKey])) {
      added.push(item);
    } else {
      map2.set(item[idKey], item);
    }
  });

  // 检查arr1中的元素是否存在于map2中
  map1.forEach((item, key) => {
    if (!map2.has(key)) {
      removed.push(item);
    }
  });

  return { added, removed };
}
export const errorCode = {
  AccessDenyOfHighFrequency: "由于访问频率过高，拒绝访问",
  ErrorDownloadFileNotFound: "下载时文件不存在",
  ErrorDownloadFileDeleted: "下载时文件已被删除",
  ErrorDownloadFileInvalidParam: "下载时无效的下载参数",
  ErrorDownloadFileInternalError: "下载时内部错误",
  ErrorDownloadFileInvalidSessionKey: "下载时无效的sessionKey",
  ErrorDownloadFileShareTimeOut: "下载时分享文件超时",
  FileAlreadyExists: "文件或文件夹已存在",
  FileNotFound: "文件或文件夹不存在",
  FileTooLarge: "上传文件超过最大限制",
  InsufficientStorageSpace: "剩余存储空间不足",
  InternalError: "内部错误",
  InvalidArgument: "非法参数",
  InvalidPassword: "密码不正确",
  InvalidParentFolder: "无效的父目录",
  InvalidSessionKey: "非法登录会话Key",
  InvalidSignature: "非法签名",
  MoveFileValidError: "文件移动类型检查错误",
  MyIDQRCodeNotLogin: "MyID二维码未登录",
  MyIDSignatureVerfiyFailed: "MyID数字签名验证失败",
  NoSuchUser: "用户账号不存在",
  ParentNotFolder: "父文件夹类型不正确",
  PermissionDenied: "访问权限不足",
  QRCodeNotBind: "二维码未绑定",
  QRCodeNotFound: "二维码不存在",
  ServiceNotOpen: "云存储服务尚未开通",
  UploadFileAccessViolation: "上传文件访问冲突",
  UploadFileNotFound: "上传文件不存在",
  UploadFileSaveFailed: "上传文件保存至云存储失败",
  UploadFileVerifyFailed: "上传文件校验失败",
  ShareSpecialDirError: "共享特殊目录",
  SpecialDirShareError: "特殊目录分享",
  BatchOperSuccessed: "批量操作部分成功",
  BatchOperFileFailed: "批量操作失败",
  ShareInfoNotFound: "没有找到分享信息",
  InvalidUploadFileStatus: "无效的上传文件状态",
  ShareOverLimitedNumber: "分享次数超限",
  NotFoundPersonQuestion: "没有设置个人问题",
  InfoSecurityErrorCode: "违反信安规则",
  CopyFileOverLimitedSpaceError: "转存文件总大小超限",
  CopyFileOverLimitedNumError: "转存次数超限",
  InfosecuMD5CheckError: "违反信安规则",
  "ShareAuditNo/ShareAuditNotPass": "分享审核不通过",
  ShareAuditNo: "分享审核不通过",
  ShareAuditNotPass: "分享审核不通过",
  TextAuditErrorCode: "敏感词检查不通过",
  UserInvalidOpenToken: "无效的天翼账号Token",
  CommonOperNotSupport: "操作不支持，建议升级版本",
  PhotoNumOverLimited: "照片数量超限",
  FileCopyToSubFolderError: "父目录拷贝或移动至自身子目录错误",
  UserDayFlowOverLimited: "用户当日流量超过上限",
  PayMoneyNumErrorCode: "支付金额有误",
  UserOrderNotExists: "用户订单不存在",
  CreateSaleOrderErrorCode: "创建用户订单异常",
  ShareDumpFileNumOverLimited: "分享转存文件数超限",
  ShareAuditWaiting: "分享审核中",
  UploadSingleFileOverLimited: "上传单文件大小超限",
  PrivateFileError: "private space file",
  SpeedOrderRecordExist: "已经生成订购关系",
  SpeedOrderRecordNotExist: "没有找到订购关系",
  SpeedProdAlreadyOrder: "该宽带已订购该产品",
  SpeedDialaccountNotFound: "找不到宽带账号",
  SpeedNotGdBroadbandUser: "非广东宽带拨号用户",
  SpeedUnOrder: "智能提速套餐未订购",
  SpeedInfoNotExist: "智能提速套餐信息不存在",
  SpeedInfoAlreadyExist: "智能提速套餐信息已存在",
  UnSpeedUpError: "用户处于未提速状态",
  NotOpenAccount: "手机号未创建天翼帐号",
  ObjectIdVerifyFailed: "objectId校验失败",
  ErrorAccessCode: "分享访问吗错误",
  ShareNotReceiver: "好友分享，访问者非接受者",
  CommonInvalidSessionKey: "分享相关接口时，好友分享，需要登陆",
  ParasTimeOut: "paras参数超时",
  TokenAlreadyExist: "该天翼云盘已绑定",
  FileStatusInvalid: "FMUserFile fileStatus is invalid",
  ShareNotFoundFlatDir: "分享平铺目录未找到",
  ShareDumpFileOverload: "分享转存文件数目超限",
  ShareNotFound: "分享未找到",
  ShareAccessOverload: "分享访问次数超限",
  ShareCreateFailed: "分享创建失败",
  ShareExpiredError: "分享已过期",
  ShareFileNotBelong: "文件不属于当前分享文件或目录",
  ShareCreateOverload: "用户创建分享次数超限",
  AccountNoAccess: "出口ip不在白名单列表中",
  ErrorLogin: "登录账号失败，paras只有1分钟有效，且只能请求一次",
  InvalidAccessToken: "AccessToken无效",
};

export function isWithinTaskTimeRange(task_start_time, task_end_time) {
  if (task_start_time && task_end_time) {
    const now = dayjs(); // 当前时间
    const today = now.format("YYYY-MM-DD"); // 今天的日期
    // 将任务开始时间和结束时间拼接为完整的日期时间格式
    const startTime = dayjs(`${today} ${task_start_time}`);
    const endTime = dayjs(`${today} ${task_end_time}`);
    // 判断当前时间是否在任务时间范围内
    if (task_start_time > task_end_time) {
      // 跨天的情况
      return now.isAfter(startTime) || now.isBefore(endTime);
    } else {
      // 正常情况
      return now.isAfter(startTime) && now.isBefore(endTime);
    }
  }
  return false; // 如果任务时间未定义，返回 false
}
/**  获取 ISO 标准的星期几（1-7）*/
export function getIsoWeekday() {
  const day = dayjs().day(); // 获取当前星期几（0-6）
  return day === 0 ? 7 : day; // 星期日映射为 7
}
/**  判断当前时间是否在任务时间范围内 */
export function isWithinTaskWeekRange(week) {
  const currentDay = getIsoWeekday();
  let days = [];
  try {
    days = JSON.parse(week);
  } catch (e) {
    console.log(e);
  }

  if (days.includes(currentDay) || days.includes(8)) {
    return true;
  }
  return false;
}
// 提取剧集的数字
export function extractEpisodeNumber(str) {
  const match = str.match(/E(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
}
