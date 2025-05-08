import url from "url";
import got from "got";
import NodeRSA from "node-rsa";
import { CookieJar } from "tough-cookie";
let cookieJar = new CookieJar();
const config = {
  clientId: "538135150693412",
  model: "KB2000",
  version: "9.0.6",
};
const headers = {
  "User-Agent": `Mozilla/5.0 (Linux; U; Android 11; ${config.model} Build/RP1A.201005.001) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.136 Mobile Safari/537.36 Ecloud/${config.version} Android/30 clientId/${config.clientId} clientModel/${config.model} clientChannelId/qq proVersion/1.0.6`,
  Referer:
    "https://m.cloud.189.cn/zhuanti/2016/sign/index.jsp?albumBackupOpened=1",
  "Accept-Encoding": "gzip, deflate",
  Host: "cloud.189.cn",
};
// 1.获取公钥
const getEncrypt = () =>
  got
    .post("https://open.e.189.cn/api/logbox/config/encryptConf.do")
    .json()
    .then((res) => res.data);
const getAppConf = (query) =>
  got
    .post("https://open.e.189.cn/api/logbox/oauth2/appConf.do", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:74.0) Gecko/20100101 Firefox/76.0",
        Referer: "https://open.e.189.cn/",
        lt: query.lt,
        REQID: query.reqId,
      },
      form: { version: "2.0", appKey: query.appId },
    })
    .json()
    .then((res) => res.data);

// 2.获取登录参数
const redirectURL = () =>
  got
    .get(
      "https://cloud.189.cn/api/portal/loginUrl.action?redirectURL=https://cloud.189.cn/web/redirect.html?returnURL=/main.action"
    )
    .then((res) => {
      const { query } = url.parse(res.url, true);
      //   console.log('query', query)
      return query;
    });

const builLoginForm = (encrypt, appConf, username, password) => {
  const keyData = `-----BEGIN PUBLIC KEY-----\n${encrypt.pubKey}\n-----END PUBLIC KEY-----`;
  var RsaJsencrypt = new NodeRSA(keyData, "public", {
    encryptionScheme: "pkcs1",
  });
  // 加密数据
  const usernameEncrypt = Buffer.from(
    RsaJsencrypt.encrypt(username).toString("base64"),
    "base64"
  ).toString("hex");
  const passwordEncrypt = Buffer.from(
    RsaJsencrypt.encrypt(password).toString("base64"),
    "base64"
  ).toString("hex");
  return {
    appKey: "cloud",
    version: "2.0",
    accountType: "01",
    mailSuffix: "@189.cn",
    validateCode: "",
    captchaToken: "",
    dynamicCheck: "FALSE",
    clientType: "1",
    cb_SaveName: "3",
    isOauth2: false,
    returnUrl: appConf.returnUrl,
    paramId: appConf.paramId,
    userName: `${encrypt.pre}${usernameEncrypt}`,
    password: `${encrypt.pre}${passwordEncrypt}`,
  };
};

/**
 * 登录流程
 * 1.获取公钥
 * 2.获取登录参数
 * 3.获取登录地址
 * 4.跳转到登录页
 * */
async function loginFn(username, password) {
  return new Promise(async (resolve, reject) => {
    try {
      let encrypt = await getEncrypt();
      let cacheQuery = await redirectURL();
      let appConf = await getAppConf(cacheQuery);
      let data = builLoginForm(encrypt, appConf, username, password);
      //3.获取登录地址
      let res = await got
        .post("https://open.e.189.cn/api/logbox/oauth2/loginSubmit.do", {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:74.0) Gecko/20100101 Firefox/76.0",
            Referer: "https://open.e.189.cn/",
            REQID: cacheQuery.REQID,
            lt: cacheQuery.lt,
          },
          form: data,
        })
        .json();
      if (res.result == 0) {
        return got.get(res.toUrl, { headers, cookieJar }).then((r) => {
          const cookies = JSON.parse(JSON.stringify(cookieJar)).cookies;
          cookieJar = null;
          cookieJar = new CookieJar();
          // console.log('cookies >>>', cookies)
          return resolve(cookies);
        });
      } else {
        console.log("登录失败1", res);
        return reject(res);
      }
    } catch (error) {
      console.log("登录失败2", error);
      reject(error);
    }
  });
}
export default loginFn;
