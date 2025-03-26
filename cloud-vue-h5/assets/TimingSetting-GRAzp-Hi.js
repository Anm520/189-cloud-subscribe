import{r as v,o as C,a as U,e as l,u as T,j as q,f as u,w as o,b as d,i as r,A as g,k as z,y as B}from"./index-DSrsZ53b.js";import{u as S}from"./config-DV-X8sFF.js";import{U as N,e as E}from"./excel-DaSyHz_z.js";import"./_commonjsHelpers-Cpj98o6Y.js";const I={style:{margin:"16px"}},A={style:{margin:"16px"}},P={style:{margin:"16px"}},M={__name:"TimingSetting",setup(R){const t=v({is_execute:0,time_interval:"",ding_talk_token:"",tg_bot_token:"",tg_chat_id:"",wx_push_spt:"",chanel_url:"",qx_push_token:""}),i=v(!1),x=S(),k=s=>{i.value=!0,g.updateConfig(t.value).then(e=>{B({type:"success",message:"保存成功",duration:1e3}),t.value.chanel_url&&x.setChangelUrl(t.value.chanel_url),p.back()}).finally(()=>{i.value=!1})},f=()=>{E.exportToExcel([t.value],"定时配置.xlsx"),showRight.value=!1},V=s=>{t.value=s[0]},p=q(),b=()=>{g.getConfig().then(s=>{t.value=s[0]})};return C(()=>{b()}),(s,e)=>{const y=u("van-nav-bar"),_=u("van-radio"),w=u("van-radio-group"),n=u("van-field"),c=u("van-cell-group"),m=u("van-button"),h=u("van-form");return z(),U("div",null,[l(y,{title:"定时设置","left-arrow":"",onClickLeft:e[0]||(e[0]=a=>T(p).back())}),l(h,{onSubmit:k,required:"auto"},{default:o(()=>[l(c,{inset:""},{default:o(()=>[l(n,{name:"is_execute",label:"执行状态",rules:[{required:!0,message:"请选择执行状态"}]},{input:o(()=>[l(w,{modelValue:t.value.is_execute,"onUpdate:modelValue":e[1]||(e[1]=a=>t.value.is_execute=a),direction:"horizontal"},{default:o(()=>[l(_,{name:1},{default:o(()=>e[9]||(e[9]=[r("执行")])),_:1}),l(_,{name:0},{default:o(()=>e[10]||(e[10]=[r("暂停")])),_:1})]),_:1},8,["modelValue"])]),_:1}),l(n,{modelValue:t.value.time_interval,"onUpdate:modelValue":e[2]||(e[2]=a=>t.value.time_interval=a),name:"time_interval",label:"执行间隔",placeholder:"执行间隔时间",type:"digit",rules:[{required:!0,message:"请填写执行间隔时间"}]},{"right-icon":o(()=>e[11]||(e[11]=[r(" 分钟 ")])),_:1},8,["modelValue"]),l(n,{modelValue:t.value.ding_talk_token,"onUpdate:modelValue":e[3]||(e[3]=a=>t.value.ding_talk_token=a),type:"textarea",name:"ding_talk_token",label:"钉钉机器人token",placeholder:"钉钉机器人token",rows:"2",autosize:""},null,8,["modelValue"]),l(n,{modelValue:t.value.qx_push_token,"onUpdate:modelValue":e[4]||(e[4]=a=>t.value.qx_push_token=a),type:"textarea",name:"qx_push_token",label:"企信机器人key",placeholder:"企信机器人key",rows:"2",autosize:""},null,8,["modelValue"]),l(n,{modelValue:t.value.wx_push_spt,"onUpdate:modelValue":e[5]||(e[5]=a=>t.value.wx_push_spt=a),type:"textarea",name:"wx_push_spt",label:"WXPushSpt",placeholder:"wx_push_spt",rows:"1",autosize:""},null,8,["modelValue"]),l(n,{modelValue:t.value.tg_bot_token,"onUpdate:modelValue":e[6]||(e[6]=a=>t.value.tg_bot_token=a),type:"textarea",name:"tg_bot_token",label:"TgBotToken",placeholder:"TgBotToken",rows:"1",autosize:""},null,8,["modelValue"]),l(n,{modelValue:t.value.tg_chat_id,"onUpdate:modelValue":e[7]||(e[7]=a=>t.value.tg_chat_id=a),type:"textarea",name:"tg_chat_id",label:"TgChatId",placeholder:"TgChatId",rows:"1",autosize:""},null,8,["modelValue"]),l(n,{modelValue:t.value.chanel_url,"onUpdate:modelValue":e[8]||(e[8]=a=>t.value.chanel_url=a),type:"textarea",name:"chanel_url",label:"频道地址",placeholder:"例：http://127.0.0.1:3001",rows:"1",autosize:""},null,8,["modelValue"])]),_:1}),d("div",I,[l(m,{block:"",type:"primary","native-type":"submit",loading:i.value},{default:o(()=>e[12]||(e[12]=[r(" 提交 ")])),_:1},8,["loading"])]),d("div",A,[l(m,{block:"",type:"primary",onClick:f},{default:o(()=>e[13]||(e[13]=[r(" 导出配置 ")])),_:1})]),d("div",P,[l(N,{onOk:V,type:"btn",title:"导入配置",style:{width:"100%"}})])]),_:1})])}}};export{M as default};
