import{g as de,a as ue,s as K,B as Be,_ as $,r as y,b as pe,u as $e,c as ze,j as g,d as t,e as he,f as X,h as fe,i as Y,k as we,l as Ie,m as Re,n as V,o as q,p as T,q as me,t as Me,v as Pe,w as je,x as Fe,y as re,z as J,A as Oe,C as ge,D as ve,T as P,S as A,I as D,E as O,P as Ve,F as qe,G as ke,H as Te,J as Le,K as De,L as Ee}from"./index-6b6ca9cd.js";import{d as Ne}from"./Home-682c527f.js";import{T as He,a as Ae,b as Qe,c as Q,d as Ue}from"./VolumeMute-b259d2fd.js";function Ge(e){return de("PrivateSwitchBase",e)}ue("PrivateSwitchBase",["root","checked","disabled","input","edgeStart","edgeEnd"]);const We=["autoFocus","checked","checkedIcon","className","defaultChecked","disabled","disableFocusRipple","edge","icon","id","inputProps","inputRef","name","onBlur","onChange","onFocus","readOnly","required","tabIndex","type","value"],Je=e=>{const{classes:n,checked:o,disabled:s,edge:i}=e,a={root:["root",o&&"checked",s&&"disabled",i&&`edge${X(i)}`],input:["input"]};return fe(a,Ge,n)},Ke=K(Be)(({ownerState:e})=>$({padding:9,borderRadius:"50%"},e.edge==="start"&&{marginLeft:e.size==="small"?-3:-12},e.edge==="end"&&{marginRight:e.size==="small"?-3:-12})),Xe=K("input")({cursor:"inherit",position:"absolute",opacity:0,width:"100%",height:"100%",top:0,left:0,margin:0,padding:0,zIndex:1}),Ye=y.forwardRef(function(n,o){const{autoFocus:s,checked:i,checkedIcon:a,className:p,defaultChecked:h,disabled:r,disableFocusRipple:d=!1,edge:f=!1,icon:u,id:c,inputProps:S,inputRef:_,name:k,onBlur:C,onChange:m,onFocus:b,readOnly:w,required:x=!1,tabIndex:I,type:z,value:E}=n,N=pe(n,We),[L,l]=$e({controlled:i,default:!!h,name:"SwitchBase",state:"checked"}),v=ze(),R=B=>{b&&b(B),v&&v.onFocus&&v.onFocus(B)},U=B=>{C&&C(B),v&&v.onBlur&&v.onBlur(B)},G=B=>{if(B.nativeEvent.defaultPrevented)return;const ie=B.target.checked;l(ie),m&&m(B,ie)};let M=r;v&&typeof M>"u"&&(M=v.disabled);const j=z==="checkbox"||z==="radio",F=$({},n,{checked:L,disabled:M,disableFocusRipple:d,edge:f}),H=Je(F);return g(Ke,$({component:"span",className:he(H.root,p),centerRipple:!0,focusRipple:!d,disabled:M,tabIndex:null,role:void 0,onFocus:R,onBlur:U,ownerState:F,ref:o},N,{children:[t(Xe,$({autoFocus:s,checked:i,defaultChecked:h,className:H.input,disabled:M,id:j?c:void 0,name:k,onChange:G,readOnly:w,ref:_,required:x,ownerState:F,tabIndex:I,type:z},z==="checkbox"&&E===void 0?{}:{value:E},S)),L?a:u]}))}),Ze=Ye,et=Y(t("path",{d:"M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"}),"CheckBoxOutlineBlank"),tt=Y(t("path",{d:"M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"}),"CheckBox"),nt=Y(t("path",{d:"M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"}),"IndeterminateCheckBox");function at(e){return de("MuiCheckbox",e)}const ot=ue("MuiCheckbox",["root","checked","disabled","indeterminate","colorPrimary","colorSecondary"]),W=ot,ct=["checkedIcon","color","icon","indeterminate","indeterminateIcon","inputProps","size","className"],st=e=>{const{classes:n,indeterminate:o,color:s}=e,i={root:["root",o&&"indeterminate",`color${X(s)}`]},a=fe(i,at,n);return $({},n,a)},it=K(Ze,{shouldForwardProp:e=>we(e)||e==="classes",name:"MuiCheckbox",slot:"Root",overridesResolver:(e,n)=>{const{ownerState:o}=e;return[n.root,o.indeterminate&&n.indeterminate,o.color!=="default"&&n[`color${X(o.color)}`]]}})(({theme:e,ownerState:n})=>$({color:(e.vars||e).palette.text.secondary},!n.disableRipple&&{"&:hover":{backgroundColor:e.vars?`rgba(${n.color==="default"?e.vars.palette.action.activeChannel:e.vars.palette.primary.mainChannel} / ${e.vars.palette.action.hoverOpacity})`:Ie(n.color==="default"?e.palette.action.active:e.palette[n.color].main,e.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}}},n.color!=="default"&&{[`&.${W.checked}, &.${W.indeterminate}`]:{color:(e.vars||e).palette[n.color].main},[`&.${W.disabled}`]:{color:(e.vars||e).palette.action.disabled}})),rt=t(tt,{}),lt=t(et,{}),dt=t(nt,{}),ut=y.forwardRef(function(n,o){var s,i;const a=Re({props:n,name:"MuiCheckbox"}),{checkedIcon:p=rt,color:h="primary",icon:r=lt,indeterminate:d=!1,indeterminateIcon:f=dt,inputProps:u,size:c="medium",className:S}=a,_=pe(a,ct),k=d?f:r,C=d?f:p,m=$({},a,{color:h,indeterminate:d,size:c}),b=st(m);return t(it,$({type:"checkbox",inputProps:$({"data-indeterminate":d},u),icon:y.cloneElement(k,{fontSize:(s=k.props.fontSize)!=null?s:c}),checkedIcon:y.cloneElement(C,{fontSize:(i=C.props.fontSize)!=null?i:c}),ownerState:m,ref:o,className:he(b.root,S)},_,{classes:b}))}),be=ut;var Z={},pt=q;Object.defineProperty(Z,"__esModule",{value:!0});var xe=Z.default=void 0,ht=pt(V()),ft=T,mt=(0,ht.default)((0,ft.jsx)("path",{d:"M10 8H8v4H4v2h4v4h2v-4h4v-2h-4zm4.5-1.92V7.9l2.5-.5V18h2V5z"}),"PlusOne");xe=Z.default=mt;var ee={},gt=q;Object.defineProperty(ee,"__esModule",{value:!0});var ye=ee.default=void 0,vt=gt(V()),kt=T,bt=(0,vt.default)((0,kt.jsx)("path",{d:"M12 5V2L8 6l4 4V7c3.31 0 6 2.69 6 6 0 2.97-2.17 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93 0-4.42-3.58-8-8-8zm-6 8c0-1.65.67-3.15 1.76-4.24L6.34 7.34C4.9 8.79 4 10.79 4 13c0 4.08 3.05 7.44 7 7.93v-2.02c-2.83-.48-5-2.94-5-5.91z"}),"RestartAlt");ye=ee.default=bt;var te={},xt=q;Object.defineProperty(te,"__esModule",{value:!0});var _e=te.default=void 0,yt=xt(V()),le=T,_t=(0,yt.default)([(0,le.jsx)("path",{d:"M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"},"0"),(0,le.jsx)("path",{d:"M17.5 10.5c.88 0 1.73.09 2.5.26V9.24c-.79-.15-1.64-.24-2.5-.24-1.7 0-3.24.29-4.5.83v1.66c1.13-.64 2.7-.99 4.5-.99zM13 12.49v1.66c1.13-.64 2.7-.99 4.5-.99.88 0 1.73.09 2.5.26V11.9c-.79-.15-1.64-.24-2.5-.24-1.7 0-3.24.3-4.5.83zm4.5 1.84c-1.7 0-3.24.29-4.5.83v1.66c1.13-.64 2.7-.99 4.5-.99.88 0 1.73.09 2.5.26v-1.52c-.79-.16-1.64-.24-2.5-.24z"},"1")],"MenuBook");_e=te.default=_t;var ne={},Ct=q;Object.defineProperty(ne,"__esModule",{value:!0});var ae=ne.default=void 0,St=Ct(V()),Bt=T,$t=(0,St.default)((0,Bt.jsx)("path",{d:"M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"}),"Visibility");ae=ne.default=$t;var oe={},zt=q;Object.defineProperty(oe,"__esModule",{value:!0});var ce=oe.default=void 0,wt=zt(V()),It=T,Rt=(0,wt.default)((0,It.jsx)("path",{d:"M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"}),"VisibilityOff");ce=oe.default=Rt;var se={},Mt=q;Object.defineProperty(se,"__esModule",{value:!0});var Ce=se.default=void 0,Pt=Mt(V()),jt=T,Ft=(0,Pt.default)((0,jt.jsx)("path",{d:"M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"}),"Close");Ce=se.default=Ft;const Nt=()=>{var L;const e=me(l=>l),n="/api",o=Me(l=>!l.theme),s=Pe(),i=je(),a=Fe(),[p,h]=y.useState(!1),[r,d]=y.useState({state:!((L=s.state)!=null&&L.viewState),toggleBtn:t(re,{}),text:"공부 모드"}),f=J("(max-width:830px)"),{data:u}=Oe(`/word-data/${i.id}`,"getData"),{mutate:c}=ge("/word-data/complete","patch"),S=ve(),[_,k]=y.useState([]),[C,m]=y.useState([]);y.useEffect(()=>{var l,v;k((l=u==null?void 0:u.wordData)==null?void 0:l.filter(R=>R.is_complete===0)),m((v=u==null?void 0:u.wordData)==null?void 0:v.filter(R=>R.is_complete===1))},[u]),y.useEffect(()=>{s.pathname.includes("/shared/")?h(!0):h(!1)},[s]),y.useEffect(()=>{r.state?d({...r,toggleBtn:t(re,{}),text:"공부 모드"}):d({...r,toggleBtn:t(_e,{}),text:"전체 보기"})},[r.state]);const b={modify:{title:"데이터 수정"},create:{title:"데이터 추가"},delete:{title:"데이터 삭제",text:"정말 데이터를 삭제하시겠습니까?"}},w=({type:l,id:v,word:R,meaning:U,example_sentence:G,example_sentence_meaning:M})=>{let j={title:""};l==="modify"?j=b.modify:l==="create"?j=b.create:l==="delete"&&(j=b.delete);const{title:F,text:H}=j;l==="delete"?e.setCheckDialog({isOpen:!0,title:F,text:H}):e.setPostDialog({isOpen:!0,title:F,label:"데이터 변경",content:"data"}),e.setSelectedFile({id:Number(i.id)}),e.setSelectedData({id:v||null,word:R||"",meaning:U||"",example_sentence:G||"",example_sentence_meaning:M||""})},x=(l,v)=>{c({body:{id:l,is_complete:v}},{onSuccess:()=>{S.invalidateQueries("getData")}})},I={backgroundColor:o?"hsl(0, 0%, 30%)":"white"},z={color:o?"lightgray":"hsl(0, 0%, 20%)"},[E,N]=y.useState(!1);return g("div",{children:[t(Ot,{matches:f,textColor:z,theme:o,navigate:a,fileName:u==null?void 0:u.name,handleData:w,share:p,view:r,setView:d,bgColor:I,setOpenComplete:N}),(_==null?void 0:_.length)>0?_==null?void 0:_.map((l,v)=>t(Se,{id:l.id,word:l.word,meaning:l.meaning,example_sentence:l.example_sentence,example_sentence_meaning:l.example_sentence_meaning,index:v,share:p,handleData:w,view:r,bgColor:I,theme:o,textColor:z,setView:d,url:n,is_complete:l.is_complete,onComplete:x},l.id)):t(P,{children:"아직 추가된 단어 데이터가 없습니다"}),t(Tt,{openComplete:E,setOpenComplete:N,completeData:C,share:p,handleData:w,view:r,bgColor:I,theme:o,textColor:z,setView:d,url:n,onComplete:x})]})},Ot=({matches:e,textColor:n,theme:o,navigate:s,fileName:i,handleData:a,share:p,view:h,setView:r,setOpenComplete:d})=>{const f=me(c=>c),u=ve();return g(A,{direction:e?"column":"row",spacing:2,mb:2,mt:10,children:[g(A,{direction:"row",spacing:2,children:[t(D,{sx:{...n,border:"1px solid lightgray","&:hover":{backgroundColor:o?"hsl(0, 0%, 45%)":"lightgray"}},onClick:()=>{s("/"),u.invalidateQueries("getWords"),f.setSelectedFolder("get_recent_file")},children:t(Ne,{})}),g(P,{fontSize:20,sx:{...n,pt:"5px"},children:["단어장 : ",i]})]}),g(A,{direction:"row",spacing:2,children:[t(O,{variant:o?"contained":"outlined",onClick:()=>{a({type:"create",id:null,word:"",meaning:"",example_sentence:"",example_sentence_meaning:""})},sx:{display:p?"none":"inlineBlock"},children:"단어 추가"}),t(O,{variant:o?"contained":"outlined",color:"primary",onClick:()=>{r&&r({...h,state:!h.state})},sx:{display:p?"none":"inlineBlock"},children:h.text}),t(O,{variant:o?"contained":"outlined",color:"primary",onClick:()=>d(!0),sx:{display:p?"none":"inlineBlock"},children:"완료 목록"})]})]})},Se=({id:e,word:n,meaning:o,example_sentence:s,example_sentence_meaning:i,index:a,handleData:p,view:h,bgColor:r,theme:d,textColor:f,share:u,url:c,onComplete:S,is_complete:_})=>{const[k,C]=y.useState({}),[m,b]=y.useState({}),w=[{title:"단어",label:n,url:c,key:"word"+a},{title:"단어 뜻",label:o,url:c,key:"meaning"+a},{title:"예문",label:s,url:c,key:"example_sentence"+a},{title:"예문 뜻",label:s,url:c,key:"example_sentence_meaning"+a}];return t(He,{component:Ve,sx:{mb:"20px",overflow:"hidden"},children:g(Ae,{"aria-label":"caption table",children:[g("caption",{style:{...r,padding:"10px",display:u?"none":"inlineBlock"},children:[g(qe,{variant:d?"contained":"outlined","aria-label":"outlined button group",children:[t(O,{sx:{fontSize:16},color:"primary",onClick:()=>p({type:"modify",id:e,word:n,meaning:o,example_sentence:s,example_sentence_meaning:i}),children:"수정"}),t(O,{color:"error",sx:{fontSize:16},onClick:()=>p({type:"delete",id:e,word:n,meaning:o,example_sentence:s,example_sentence_meaning:i}),children:"삭제"})]}),t(be,{sx:{...f,padding:0,display:h.state?"none":"inlineBlock",marginLeft:"10px"},checked:!!k["word"+a]&&!!k["meaning"+a]&&!!k["example_sentence"+a]&&!!k["example_sentence_meaning"+a],icon:t(ae,{}),checkedIcon:t(ce,{}),onChange:x=>{C({...k,["word"+a]:x.target.checked,["meaning"+a]:x.target.checked,["example_sentence"+a]:x.target.checked,["example_sentence_meaning"+a]:x.target.checked})}}),t(O,{variant:d?"contained":"outlined",sx:{fontSize:16,float:"right"},color:"primary",onClick:()=>S(e,_),children:_===0?"학습 완료":"완료 취소"})]}),g(Qe,{children:[w.map(x=>t(Vt,{title:x.title,label:x.label,checked:!!k[x.key],onChange:I=>{C({...k,[x.key]:I.target.checked})},view:h,textColor:f,bgColor:r,url:x.url},x.key)),g(ke,{sx:{display:h.state?"none":"inlineBlock"},children:[t(Q,{component:"th",scope:"row",sx:{...f,...r,width:"7%",borderRight:1,borderRightColor:"grey.300",fontSize:17},children:"따라읽기"}),g(Q,{align:"left",component:"th",scope:"row",sx:{...f,...r},children:[t(D,{sx:{...f,border:"1px solid lightgray"},onClick:()=>{b({...m,[a]:m!=null&&m[a]?m[a]+1:1})},children:t(xe,{})}),g(P,{sx:{display:"inline",margin:"10px"},children:["반복 횟수 : ",m[a]?m[a]:0]}),t(D,{sx:{border:"1px solid lightgray",color:d?"lightgray":void 0},onClick:()=>{b({...m,[a]:0})},children:t(ye,{})})]})]})]})]})},e)},Vt=({title:e,label:n,checked:o,onChange:s,view:i,textColor:a,bgColor:p,url:h})=>{const r=J("(max-width:1092px)"),f=J("(max-width:554px)")?"35%":r?"20%":"10%",{mutate:u}=ge("/word-data/tts","post"),c=async S=>{u({body:{text:S},config:{responseType:"arraybuffer"}},{onSuccess:k=>{const C=new AudioContext;C.decodeAudioData(k,m=>{const b=C.createBufferSource();b.buffer=m,b.connect(C.destination),b.start(0)})}})};return g(ke,{children:[g(Q,{component:"th",scope:"row",sx:{...a,...p,width:f,borderRight:1,borderRightColor:"grey.300",fontSize:17,padding:"0 15px"},children:[t(P,{sx:{display:"inline"},children:e}),t(D,{onClick:()=>{c(n)},sx:{...a,float:"right",padding:0},children:t(Ue,{})})]}),t(Q,{align:"left",sx:{...p,wordBreak:"break-all"},children:g(A,{direction:"row",children:[t(be,{sx:{...a,padding:0,display:i.state?"none":"block",marginRight:"10px"},checked:o,icon:t(ae,{}),checkedIcon:t(ce,{}),onChange:s}),t(P,{sx:{...a,fontSize:17,display:o||i.state?"block":"none"},children:n})]})})]})},qt=y.forwardRef(function(n,o){return t(Te,{direction:"up",ref:o,...n})}),Tt=({openComplete:e,setOpenComplete:n,completeData:o,share:s,handleData:i,view:a,bgColor:p,theme:h,textColor:r,setView:d,url:f,onComplete:u})=>t("div",{children:g(Le,{fullScreen:!0,open:e,onClose:()=>n(!open),TransitionComponent:qt,children:[t(De,{sx:{position:"relative",backgroundColor:"black"},children:g(Ee,{children:[t(D,{edge:"start",color:"inherit",onClick:()=>n(!open),"aria-label":"close",children:t(Ce,{})}),t(P,{sx:{ml:2,flex:1,mt:1},variant:"h6",component:"div",children:"학습 완료 목록"})]})}),t("div",{style:{padding:"10px"},children:(o==null?void 0:o.length)>0?o==null?void 0:o.map((c,S)=>t(Se,{id:c.id,word:c.word,meaning:c.meaning,example_sentence:c.example_sentence,example_sentence_meaning:c.example_sentence_meaning,index:S,share:s,handleData:i,view:a,bgColor:p,theme:h,textColor:r,setView:d,url:f,is_complete:c.is_complete,onComplete:u},c.id)):t(P,{children:"아직 추가된 단어 데이터가 없습니다"})})]})});export{Nt as default};