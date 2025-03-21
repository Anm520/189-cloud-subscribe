import db from "../DB/db.js";
import axios from "axios";

// 推送钉钉机器人通知
export const pushDingTalkMessage = (data, ding_talk_token) => {
    //   console.log('推送钉钉机器人通知 >>>', ding_talk_token)
    const url = `https://oapi.dingtalk.com/robot/send?access_token=${ding_talk_token}`
    try {
        return axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                accept: 'application/json;charset=UTF-8',
            },
        })
    } catch (error) {
        console.error('Error occurred:', error)
    }
}
// 推送TG机器人通知
export const pushTelegramMessage = (params) => {
    const { text, tg_chat_id, tg_bot_token } = params
    const data = {
        chat_id: tg_chat_id,
        text,
    }
    //   console.log('推送TG机器人通知 >>>', tg_chat_id, tg_bot_token)
    try {
        return axios.post(`https://api.telegram.org/bot${tg_bot_token}/sendMessage`, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
    } catch (error) {
        console.error('Error occurred:', error)
    }
}
const pushWxPushMessage = (content, summary, spt) => {
    const sptList = spt.split(',')
    const data = {
        "content": content,
        "summary": summary + '更新',
        "contentType": 3,
        "sptList": sptList,
    }
    try {
        return axios.post(`https://wxpusher.zjiecode.com/api/send/message/simple-push`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    } catch (error) {
        console.error('Error occurred:', error)
    }
}
// { task_name = null, added = null, account = null, } 
export const pushMessage = async (type, params) => {
    db.all(`SELECT * FROM config`, (err, rows) => {
        if (rows && rows[0]) {
            // 钉钉消息推送
            let ding_talk_token = rows[0].ding_talk_token
            let tg_bot_token = rows[0].tg_bot_token
            let tg_chat_id = rows[0].tg_chat_id
            let wx_push_spt = rows[0].wx_push_spt
            if (!ding_talk_token && !tg_bot_token && !wx_push_spt) return //没有token不发消息通知

            if (type == 'task') {
                let { task_name = '', added = [], account, } = params
                let text = `###### 云盘更新通知 \n #### [${task_name} 更新${added.length}集](h)  \n`
                added.slice(0, 10).forEach((file) => {
                    text += `- ${file.name} \n`
                })
                if (added.length > 10) {
                    text += `- ...\n - ${added.length - 10} 个文件未显示 \n `
                }
                let msgCard = {
                    msgtype: 'markdown',
                    markdown: {
                        title: '云盘通知',
                        text,
                    },
                }
                tg_chat_id && tg_bot_token && pushTelegramMessage({ text, tg_chat_id, tg_bot_token })
                ding_talk_token && pushDingTalkMessage(msgCard, ding_talk_token)
                wx_push_spt && pushWxPushMessage(text, task_name, wx_push_spt)
            }

            if (type == 'cookieErr') {
                let text = `###### 云盘更新通知 \n #### [cookie失效，已重新登陆](h)  \n`
                params.forEach((item) => {
                    text += `- ${item.account} \n`
                })
                let msgCard = {
                    msgtype: 'markdown',
                    markdown: {
                        title: '云盘通知',
                        text,
                    },
                }
                tg_chat_id && tg_bot_token && pushTelegramMessage({ text, tg_chat_id, tg_bot_token })
                ding_talk_token && pushDingTalkMessage(msgCard, ding_talk_token)
                return
            }
            if (type == 'err') {
                let text = `###### 云盘更新通知 \n #### [任务失败提醒](h)  \n - ${params} \n`
                let msgCard = {
                    msgtype: 'markdown',
                    markdown: {
                        title: '云盘通知',
                        text,
                    },
                }
                tg_chat_id && tg_bot_token && pushTelegramMessage({ text, tg_chat_id, tg_bot_token })
                ding_talk_token && pushDingTalkMessage(msgCard, ding_talk_token)
                return
            }

        }
    })

}