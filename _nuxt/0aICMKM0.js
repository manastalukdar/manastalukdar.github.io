import{h as A,k as E,u as R,e as j,w as a,V as N,o as O,b as o,a as s,i as n,f as i,g as U,m as z,t as G,B as J,d as W,_ as w}from"./9jrxGreP.js";import{W as $}from"./4GqsQFsH.js";import{M as q,f as T}from"./Bfz0ka7m.js";import{c as I}from"./1pqAfqdp.js";import{_ as F}from"./DBxI7RJa.js";import{u as K,a as Q}from"./f6UV4pIC.js";import{u as X}from"./DOrtmDgG.js";import{g as Y}from"./CXDFu72n.js";const Z=["innerHTML"],tt=["innerHTML"],k="Board Memberships.",dt={__name:"speaking",async setup(et){let d,m;const r=K(),M=Q(),g=X(),l=A(),f=l.public.baseUrl;async function C(){try{g.blogMetadata.length<l.public.blogPostCount&&await g.setupBlogMetadata(l.public.baseUrl)}catch(e){console.log(e)}}[d,m]=E(()=>C()),await d,m();const S=M.appOwner,b=r.about.aboutItems[0].professionalItems[3].engagementsItems[5].href,u=r.about.aboutItems[0].professionalItems[3].engagementsItems[6].text,y=r.about.aboutItems[0].professionalText,_=r.about.aboutItems[0].professionalItems[3].engagementsText,B=r.about.aboutItems[0].professionalItems[3].href,L=r.about.aboutText,c=u+" | "+_+" | "+y+" | "+r.about.aboutText+" || "+S,x=f+b,h=[{title:"Home",disabled:!1,href:"/",exact:!0},{title:L,disabled:!0,exact:!0},{title:y,disabled:!0,exact:!0},{title:_,disabled:!1,href:B,exact:!0},{title:u,disabled:!1,href:b,exact:!0}],V={"@context":"http://schema.org","@type":"BreadcrumbList",itemListElement:h.map((e,t)=>({"@type":"ListItem",position:t+1,item:{"@id":f+e.href,name:e.title}}))};R({title:c,meta:[{hid:"description",name:"description",content:k},{hid:"apple-mobile-web-app-title",name:"apple-mobile-web-app-title",content:c},{hid:"og-title",name:"og:title",property:"og:title",content:c},{hid:"og-url",name:"og:url",property:"og:url",content:x},{hid:"og-description",name:"og:description",property:"og:description",content:k}],link:[{rel:"canonical",href:x}],__dangerouslyDisableSanitizers:["script"],script:[{innerHTML:JSON.stringify(V),type:"application/ld+json"}]});const p=new q({html:!0,linkify:!0,typographer:!0});Y(p);const D=I(async()=>{try{const e=await w(()=>import("./BffH_geJ.js"),[],import.meta.url),t=T(e.default);return p.render(t.body)}catch(e){console.log(e)}}),H=I(async()=>{try{const e=await w(()=>import("./BMr43lAb.js"),[],import.meta.url),t=T(e.default);return p.render(t.body)}catch(e){console.log(e)}}),{paperize:v}=$("printMe",{styles:["/style/print-generic.css"]}),P=()=>{v()};return(e,t)=>(O(),j(N,null,{default:a(()=>[o(n(F),{breadcrumbs:h}),t[4]||(t[4]=s("p",null,null,-1)),o(i,null,{default:a(()=>[o(U,{cols:"12"},{default:a(()=>[o(z,{color:"cardColor",class:"pa-8",raised:"",elevation:"8",style:{height:"100%"},id:"printMe"},{default:a(()=>[o(i,{class:"text-h5 px-3 py-3 page-header justify-center"},{default:a(()=>[s("span",null,"Upcoming "+G(n(u))+" Engagements",1)]),_:1}),t[2]||(t[2]=s("p",null,null,-1)),s("div",{class:"pl-2 pb-2 markdown-content",innerHTML:n(D)},null,8,Z),o(i,{class:"text-h6 px-3 py-3 page-header justify-center"},{default:a(()=>t[0]||(t[0]=[s("span",null,"Recent Past",-1)])),_:1}),t[3]||(t[3]=s("p",null,null,-1)),s("div",{class:"pl-2 pb-2 markdown-content",innerHTML:n(H)},null,8,tt),o(i,{class:"printButton row py-10 justify-center"},{default:a(()=>[o(J,{class:"justify-center",onClick:P},{default:a(()=>t[1]||(t[1]=[W("mdi-printer")])),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}))}};export{dt as default};
