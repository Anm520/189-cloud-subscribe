import{c as r,I as z,z as x,p as C,N as P,r as y,a as H,b as l,d as f,o as p,e as s,f as h,v as U,a6 as j,i as I,q as D,x as g,t as L}from"./index-DVWsMLSs.js";import{_ as S}from"./_plugin-vue_export-helper-DlAUqK2U.js";import{u as B}from"./CloudDisk-CFN3zckg.js";import{h as $}from"./index-CbH7X_L3.js";import{U as N}from"./UserOutlined-FPKX1F7T.js";var F={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM115.4 518.9L271.7 642c5.8 4.6 14.4.5 14.4-6.9V388.9c0-7.4-8.5-11.5-14.4-6.9L115.4 505.1a8.74 8.74 0 000 13.8z"}}]},name:"menu-fold",theme:"outlined"};function k(n){for(var e=1;e<arguments.length;e++){var t=arguments[e]!=null?Object(arguments[e]):{},o=Object.keys(t);typeof Object.getOwnPropertySymbols=="function"&&(o=o.concat(Object.getOwnPropertySymbols(t).filter(function(a){return Object.getOwnPropertyDescriptor(t,a).enumerable}))),o.forEach(function(a){E(n,a,t[a])})}return n}function E(n,e,t){return e in n?Object.defineProperty(n,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[e]=t,n}var b=function(e,t){var o=k({},e,t.attrs);return r(z,k({},o,{icon:F}),null)};b.displayName="MenuFoldOutlined";b.inheritAttrs=!1;var R={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 000-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0014.4 7z"}}]},name:"menu-unfold",theme:"outlined"};function M(n){for(var e=1;e<arguments.length;e++){var t=arguments[e]!=null?Object(arguments[e]):{},o=Object.keys(t);typeof Object.getOwnPropertySymbols=="function"&&(o=o.concat(Object.getOwnPropertySymbols(t).filter(function(a){return Object.getOwnPropertyDescriptor(t,a).enumerable}))),o.forEach(function(a){V(n,a,t[a])})}return n}function V(n,e,t){return e in n?Object.defineProperty(n,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[e]=t,n}var O=function(e,t){var o=M({},e,t.attrs);return r(z,M({},o,{icon:R}),null)};O.displayName="MenuUnfoldOutlined";O.inheritAttrs=!1;const A=x({__name:"LayoutSider",props:{collapsed:Boolean},setup(n){const e=C(),t=P(),o=y([e.path]);function a(d){let c=[];return d.forEach(({path:v,name:m,children:_=null,meta:w={}})=>{c.push({key:v,icon:()=>U(w.icon),label:m,title:m,children:_?a(_):null})}),c}const i=H(a(j));function u(d){d.key.includes("/")&&t.push(d.key)}return(d,c)=>{const v=l("a-menu"),m=l("a-layout-sider");return p(),f(m,{collapsed:n.collapsed,trigger:null,collapsible:"",style:{background:"#000"},width:230},{default:s(()=>[c[1]||(c[1]=h("div",{class:"logo"},null,-1)),r(v,{selectedKeys:o.value,"onUpdate:selectedKeys":c[0]||(c[0]=_=>o.value=_),theme:"dark",mode:"inline",onClick:u,items:i},null,8,["selectedKeys","items"])]),_:1},8,["collapsed"])}}}),q=S(A,[["__scopeId","data-v-7ed8a8ab"]]),G={__name:"LayoutHeader",setup(n){const e=B(),t=I(()=>e.CloudDiskUserInfo.account?$(e.CloudDiskUserInfo.account):"");return D(()=>{}),(o,a)=>{const i=l("a-avatar"),u=l("a-space");return p(),f(u,{size:16},{default:s(()=>[r(i,null,{icon:s(()=>[r(g(N))]),_:1}),h("span",null,L(t.value),1)]),_:1})}}},J={class:"layout-header"},K=x({__name:"index",setup(n){P(),y(["1"]);const e=y(!1);return(t,o)=>{const a=l("router-view"),i=l("a-layout-content"),u=l("a-layout");return p(),f(u,{class:"layout"},{default:s(()=>[r(q,{collapsed:e.value},null,8,["collapsed"]),r(u,null,{default:s(()=>[h("div",J,[e.value?(p(),f(g(O),{key:0,class:"trigger",onClick:o[0]||(o[0]=()=>e.value=!e.value)})):(p(),f(g(b),{key:1,class:"trigger",onClick:o[1]||(o[1]=()=>e.value=!e.value)})),r(G)]),r(i,{class:"layout-content"},{default:s(()=>[r(a)]),_:1})]),_:1})]),_:1})}}}),Z=S(K,[["__scopeId","data-v-eea39258"]]);export{Z as default};
