import{v as k,q as B,t as C,y as D,A as w,r as y,j as r,F as P,S as q,d as e,I as S,T as b,P as z,z as f,E as A}from"./index-8acbbf6b.js";import{d as M}from"./Home-94f68ffa.js";import{T as R,a as j,b as E,c as v,d as F}from"./VolumeMute-711bcb9c.js";const W=()=>{const a=k(),s=B(t=>t),n="/api",o=C(t=>!t.theme),h=D(),{data:u,mutate:p}=w(`${n}/getdata/search`),c=y.useCallback(p,[a.state.value]),l={body:{word:a.state.value}};y.useEffect(()=>{c(l)},[a.state.value,c]);const i={color:o?"lightgray":"hsl(0, 0%, 20%)"};return r(P,{children:[r(q,{direction:"row",spacing:2,mb:2,mt:10,children:[e(S,{sx:{...i,border:"1px solid lightgray","&:hover":{backgroundColor:o?"hsl(0, 0%, 45%)":"lightgray"}},onClick:()=>{h("/"),s.setSelectedFolder("get_recent_file")},children:e(M,{})}),r(b,{fontSize:"18px",pt:"7px",sx:i,children:["검색 키워드 : ",a.state.value]})]}),u.data&&u.data.map(t=>e($,{data_id:t.data_id,voca:t.voca,voca_mean:t.voca_mean,exam:t.exam,exam_mean:t.exam_mean},t.data_id))]})},d=({title:a,label:s})=>{const n="/api",o=C(x=>!x.theme),h=f("(max-width:1092px)"),p=f("(max-width:554px)")?"35%":h?"20%":"10%",c={backgroundColor:o?"hsl(0, 0%, 30%)":"white"},l={color:o?"lightgray":"hsl(0, 0%, 20%)"},{mutate:i}=w(`${n}/getdata/tts`),t=async x=>{i({body:{text:x},responseType:{responseType:"arraybuffer"}},{onSuccess:T=>{const m=new AudioContext;m.decodeAudioData(T,_=>{const g=m.createBufferSource();g.buffer=_,g.connect(m.destination),g.start(0)})}})};return r(A,{children:[r(v,{component:"th",scope:"row",sx:{...c,...l,width:p,borderRight:1,borderRightColor:"grey.300",padding:"0 15px"},children:[e(b,{sx:{display:"inline"},children:a}),e(S,{onClick:()=>{t(s)},sx:{...l,float:"right",padding:0},children:e(F,{})})]}),e(v,{align:"left",sx:{...c,wordBreak:"break-all"},children:e(b,{sx:{...l,fontSize:17},children:s})})]})},$=({voca:a,voca_mean:s,exam:n,exam_mean:o})=>e(R,{component:z,sx:{mb:"20px"},children:e(j,{sx:{minWidth:650},"aria-label":"caption table",children:r(E,{children:[e(d,{title:"단어",label:a}),e(d,{title:"단어 뜻",label:s}),e(d,{title:"예문",label:n}),e(d,{title:"예문 뜻",label:o})]})})});export{W as default};