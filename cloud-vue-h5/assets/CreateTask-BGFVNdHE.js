import{S as O,r as v,D as z,f as r,a as N,k as x,e as t,w as s,F as $,v as J,N as P,Q as j,T as A,o as E,x as R,O as B,u as o,j as Q,b as W,i as b,A as I,y as D}from"./index-Bfi-kTiU.js";import{_ as G,F as H}from"./FloderSelect-BD5Eo0oX.js";import"./hooks-DbFPZXyn.js";import"./_commonjsHelpers-Cpj98o6Y.js";const K={__name:"WeekSelect",props:{modelValue:{default:"[8]"},modelModifiers:{}},emits:["update:modelValue"],setup(w){const _=O(w,"modelValue"),p=v(""),f=v(!1),c=[{text:"每日",value:8},{text:"周一",value:1},{text:"周二",value:2},{text:"周三",value:3},{text:"周四",value:4},{text:"周五",value:5},{text:"周六",value:6},{text:"周日",value:7}],n=v([]);z(()=>_.value,l=>{if(console.log("newValue >>>>>:",l),l)try{n.value=JSON.parse(l)}catch{n.value=[]}else n.value=[];p.value=c.filter(u=>n.value.includes(u.value)).map(u=>u.text).join("、"),console.log("showValue.value >>>>>:",p.value)},{deep:!0,immediate:!0});const U=()=>{console.log("checked.value >>>>>:",JSON.stringify(n.value)),n.value.length>0?_.value=JSON.stringify(n.value):_.value="",j(()=>{console.log("value.value >>>>>:",_.value),f.value=!1})},g=()=>{f.value=!1};return(l,u)=>{const k=r("van-field"),V=r("van-nav-bar"),q=r("van-checkbox"),S=r("van-cell"),i=r("van-cell-group"),e=r("van-checkbox-group"),y=r("van-popup");return x(),N($,null,[t(k,{"model-value":p.value,readonly:"",name:"task_week",label:"执行时间",placeholder:"点击选择时间",onClick:u[0]||(u[0]=m=>{f.value=!0}),rules:[{required:!0,message:"请填写执行时间"}]},null,8,["model-value"]),t(y,{show:f.value,position:"bottom",style:{height:"60%"}},{default:s(()=>[t(V,{title:"选择时间","left-text":"取消",onClickLeft:g,"right-text":"确认",onClickRight:U}),t(e,{modelValue:n.value,"onUpdate:modelValue":u[2]||(u[2]=m=>n.value=m)},{default:s(()=>[t(i,{inset:""},{default:s(()=>[(x(),N($,null,J(c,(m,C)=>t(S,{clickable:"",key:m,title:m.text},{"right-icon":s(()=>[t(q,{name:m.value,onClick:u[1]||(u[1]=P(()=>{},["stop"]))},null,8,["name"])]),_:2},1032,["title"])),64))]),_:1})]),_:1},8,["modelValue"])]),_:1},8,["show"])],64)}}},X={style:{margin:"16px"}},ae={__name:"CreateTask",props:{shareUrl:{type:String,default:""}},emits:["close"],setup(w,{emit:_}){const p=w,f=_,c=Q(),n=A();v(!1);const U=v(n.query.id?"编辑任务":"创建任务"),g=v(!1);let l=v({share_url:"",share_code:"",task_name:"",share_id:"",share_file_id:"",save_path_id:"",status:1,share_mode:3,save_type:0,episode_total:0,episode:0,task_week:""});const u=i=>{let e="";if(i?(e=l.value.share_url&&l.value.share_url.match(/\/t\/([^\/]+)/)[1]||"",l.value.share_code=e):e=l.value.share_code,console.log("shareCode",e),!e)return D({type:"warning",message:"请输入分享链接或分享码",duration:1e3});I.getShareInfoByCode({shareCode:e}).then(y=>{const{shareMode:m,shareId:C,fileId:d,fileName:h}=y;l.value.share_id=String(C),l.value.share_mode=m,l.value.share_file_id=d,l.value.task_name=h})},k=v(!1),V=v(!1),q=i=>{g.value=!0,l.value.id?(console.log("updateTask >>>>>:",l.value),I.updateTask(l.value).then(e=>{D({type:"success",message:"保存成功",duration:1e3}),c.back()}).finally(()=>{g.value=!1})):I.createTask({...i,account:i.account?i.account:window.localStorage.getItem("account")}).then(e=>{D({type:"success",message:"创建成功",duration:1e3}),p.shareUrl?f("close"):c.back()}).finally(()=>{g.value=!1})},S=()=>{n.query&&n.query.id&&I.getTaskDetail({id:n.query.id}).then(i=>{l.value={...i}}),n.query&&n.query.url&&(console.log("123",n.query.url),l.value.share_url=n.query.url,u(!0)),p.shareUrl&&(l.value.share_url=p.shareUrl,u(!0))};return E(()=>{S()}),(i,e)=>{const y=r("van-icon"),m=r("van-nav-bar"),C=r("van-sticky"),d=r("van-field"),h=r("van-radio"),T=r("van-radio-group"),F=r("van-cell-group"),M=r("van-button"),L=r("van-form");return x(),N("div",null,[t(C,null,{default:s(()=>[t(m,{title:U.value,"left-arrow":"",onClickLeft:e[1]||(e[1]=a=>o(c).back())},{right:s(()=>[t(y,{name:"bars",size:"18",onClick:e[0]||(e[0]=a=>i.showRight=!0)})]),_:1},8,["title"])]),_:1}),t(L,{onSubmit:q,style:{"margin-top":"10px"},required:"auto"},{default:s(()=>[t(F,{inset:""},{default:s(()=>[t(d,{modelValue:o(l).share_url,"onUpdate:modelValue":e[2]||(e[2]=a=>o(l).share_url=a),name:"share_url",label:"分享链接",placeholder:"分享链接","right-icon":"search",onClickRightIcon:e[3]||(e[3]=a=>u(!0))},null,8,["modelValue"]),t(d,{modelValue:o(l).share_code,"onUpdate:modelValue":e[4]||(e[4]=a=>o(l).share_code=a),name:"share_code",label:"share_code",placeholder:"share_code",rules:[{required:!0,message:"请填写share_code"}],"right-icon":"search",onClickRightIcon:e[5]||(e[5]=a=>u(!1))},null,8,["modelValue"]),t(d,{modelValue:o(l).task_name,"onUpdate:modelValue":e[6]||(e[6]=a=>o(l).task_name=a),name:"task_name",label:"任务名称",placeholder:"任务名称"},null,8,["modelValue"]),t(d,{modelValue:o(l).share_id,"onUpdate:modelValue":e[7]||(e[7]=a=>o(l).share_id=a),name:"share_id",label:"分享ID",placeholder:"分享ID",rules:[{required:!0,message:"请填写分享ID"}]},null,8,["modelValue"]),t(d,{modelValue:o(l).share_file_id,"onUpdate:modelValue":e[8]||(e[8]=a=>o(l).share_file_id=a),name:"share_file_id",label:"分享目录ID",placeholder:"分享目录ID",rules:[{required:!0,message:"请填写分享目录ID"}],"right-icon":"search",onClickRightIcon:e[9]||(e[9]=a=>k.value=!0)},null,8,["modelValue"]),t(d,{modelValue:o(l).share_mode,"onUpdate:modelValue":e[10]||(e[10]=a=>o(l).share_mode=a),name:"share_mode",label:"分享模式",placeholder:"3-pc,5-移动端订阅链接"},null,8,["modelValue"]),t(d,{modelValue:o(l).save_path_id,"onUpdate:modelValue":e[11]||(e[11]=a=>o(l).save_path_id=a),name:"save_path_id",label:"保存目录ID",placeholder:"保存目录ID",rules:[{required:!0,message:"请选择保存目录ID"}],"right-icon":"search",onClickRightIcon:e[12]||(e[12]=a=>V.value=!0)},null,8,["modelValue"]),t(K,{modelValue:o(l).task_week,"onUpdate:modelValue":e[13]||(e[13]=a=>o(l).task_week=a)},null,8,["modelValue"]),t(d,{name:"status",label:"任务状态",rules:[{required:!0,message:"请选择任务状态"}]},{input:s(()=>[t(T,{modelValue:o(l).status,"onUpdate:modelValue":e[14]||(e[14]=a=>o(l).status=a),direction:"horizontal"},{default:s(()=>[t(h,{name:1},{default:s(()=>e[22]||(e[22]=[b("执行")])),_:1}),t(h,{name:0},{default:s(()=>e[23]||(e[23]=[b("暂停")])),_:1})]),_:1},8,["modelValue"])]),_:1}),t(d,{name:"save_type",label:"保存模式",rules:[{required:!0,message:"请选择保存模式"}]},{input:s(()=>[t(T,{modelValue:o(l).save_type,"onUpdate:modelValue":e[15]||(e[15]=a=>o(l).save_type=a),direction:"horizontal"},{default:s(()=>[t(h,{name:0},{default:s(()=>e[24]||(e[24]=[b("仅文件")])),_:1}),t(h,{name:1},{default:s(()=>e[25]||(e[25]=[b("文件和文件夹")])),_:1})]),_:1},8,["modelValue"])]),_:1}),t(d,{modelValue:o(l).episode_total,"onUpdate:modelValue":e[16]||(e[16]=a=>o(l).episode_total=a),name:"episode_total",label:"总集数",placeholder:"总集数"},null,8,["modelValue"]),t(d,{modelValue:o(l).episode,"onUpdate:modelValue":e[17]||(e[17]=a=>o(l).episode=a),name:"episode",label:"已更集数",placeholder:"已更集数"},null,8,["modelValue"])]),_:1}),W("div",X,[t(M,{round:"",block:"",type:"primary","native-type":"submit",loading:g.value},{default:s(()=>e[26]||(e[26]=[b(" 提交 ")])),_:1},8,["loading"])])]),_:1}),k.value?(x(),R(G,{key:0,modelValue:k.value,"onUpdate:modelValue":e[18]||(e[18]=a=>k.value=a),fileId:o(l).share_file_id,shareCode:o(l).share_code,onSelect:e[19]||(e[19]=a=>o(l).share_file_id=a)},null,8,["modelValue","fileId","shareCode"])):B("",!0),V.value?(x(),R(H,{key:1,modelValue:V.value,"onUpdate:modelValue":e[20]||(e[20]=a=>V.value=a),onSelect:e[21]||(e[21]=a=>o(l).save_path_id=a),id:o(l).save_path_id,name:o(l).task_name},null,8,["modelValue","id","name"])):B("",!0)])}}};export{ae as default};
