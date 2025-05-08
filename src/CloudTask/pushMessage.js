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
        "summary": summary,
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
const pushQXPushMessage = (text, key) => {
    const data = {
        msgtype: "text",
        text: {
            content: text
        }
    }
    try {
        return axios.post(`https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${key}`, data, {
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

            const { ding_talk_token = '', tg_bot_token = '', tg_chat_id = '', wx_push_spt = '', qx_push_token = '' } = rows[0]
            if (!ding_talk_token && !tg_bot_token && !wx_push_spt && !qx_push_token) return //没有token不发消息通知

            if (type == 'task') {
                let { task_name = '', added = [], account, } = params
                let title = `${task_name} 更新${added.length}集  \n`

                let text = ''
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
                        text: '###### 云盘更新通知 \n' + title + text,
                    },
                }
                tg_chat_id && tg_bot_token && pushTelegramMessage({ text: title + text, tg_chat_id, tg_bot_token })
                ding_talk_token && pushDingTalkMessage(msgCard, ding_talk_token)
                wx_push_spt && pushWxPushMessage(text, title, wx_push_spt)
                qx_push_token && pushQXPushMessage(title + text, qx_push_token)

            }

            if (type == 'cookieErr') {
                let title = `cookie失效，已重新登陆  \n`
                let text = ''
                params.forEach((item) => {
                    text += `- ${item.account} \n`
                })
                let msgCard = {
                    msgtype: 'markdown',
                    markdown: {
                        title: '云盘通知',
                        text: '###### 云盘更新通知 \n #### [cookie失效，已重新登陆](h)  \n' + text,
                    },
                }
                tg_chat_id && tg_bot_token && pushTelegramMessage({ text: title + text, tg_chat_id, tg_bot_token })
                ding_talk_token && pushDingTalkMessage(msgCard, ding_talk_token)
                wx_push_spt && pushWxPushMessage(text, title, wx_push_spt)
                qx_push_token && pushQXPushMessage(title + text, qx_push_token)
                return
            }
            if (type == 'err') {
                let text = `任务失败提醒 \n - ${params} \n`
                let msgCard = {
                    msgtype: 'markdown',
                    markdown: {
                        title: '云盘通知',
                        text: '###### 云盘更新通知 \n #### [任务失败提醒](h)  \n - ${params} \n',
                    },
                }
                tg_chat_id && tg_bot_token && pushTelegramMessage({ text, tg_chat_id, tg_bot_token })
                ding_talk_token && pushDingTalkMessage(msgCard, ding_talk_token)
                wx_push_spt && pushWxPushMessage(text, '任务失败提醒', wx_push_spt)
                qx_push_token && pushQXPushMessage(text, qx_push_token)
                return
            }

        }
    })

}