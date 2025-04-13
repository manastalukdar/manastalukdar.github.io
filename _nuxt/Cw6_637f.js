import{_ as j}from"./BtMuNDgU.js";import{_ as A}from"./DBxI7RJa.js";import{u as R,a as U}from"./f6UV4pIC.js";import{u as O}from"./DOrtmDgG.js";import{j as q,h as z,k as E,l as G,u as J,e as Y,w as t,V as $,o as K,b as e,a as r,i as n,f as x,g as V,t as c,m as Q,n as W,p as X,q as Z,s as tt,v as et,d,B as ot}from"./9jrxGreP.js";const at={class:"text-left"},S="List of all post formats from blog.",dt={__name:"post-formats",async setup(st){let g,f;const s=R(),w=U(),i=O(),m=z();q();const b=m.public.baseUrl;async function I(){try{i.blogMetadata.length<m.public.blogPostCount&&await i.setupBlogMetadata(m.public.baseUrl)}catch(a){console.log(a)}}[g,f]=E(()=>I()),await g,f();const B=w.appOwner,C=s.blog.blogItems[3].text+" | "+s.blog.blogText;i.getBlogMetadata();const D=s.blog.blogItems[3].text,F=s.blog.blogItems[0].href,_=s.blog.blogItems[3].href,k=s.blog.blogItems[3].text,T=s.blog.dynamicItems.postFormat.href,p=C+" || "+B,y=b+_,M=i.getPostFormats(),u=G(""),P=[{title:"Post Format",align:"left",sortable:!0,key:"name"},{title:"Number of posts",align:"left",sortable:!0,key:"count"}],h=[{title:"Home",disabled:!1,href:"/",exact:!0},{title:"Blog",disabled:!1,href:F,exact:!0},{title:k,disabled:!1,href:_,exact:!0}],v={"@context":"http://schema.org","@type":"BreadcrumbList",itemListElement:h.map((a,o)=>({"@type":"ListItem",position:o+1,item:{"@id":b+a.href,name:a.title}}))};J({title:p,meta:[{hid:"description",name:"description",content:S},{hid:"apple-mobile-web-app-title",name:"apple-mobile-web-app-title",content:p},{hid:"og-title",name:"og:title",property:"og:title",content:p},{hid:"og-url",name:"og:url",property:"og:url",content:y},{hid:"og-description",name:"og:description",property:"og:description",content:S}],link:[{rel:"canonical",href:y}],__dangerouslyDisableSanitizers:["script"],script:[{innerHTML:JSON.stringify(v),type:"application/ld+json"}]});function L(a){return T+a+"/"}function N(a){return i.getPostFormatIcon(a)}return(a,o)=>{const H=j;return K(),Y($,null,{default:t(()=>[e(n(A),{breadcrumbs:h}),o[3]||(o[3]=r("p",null,null,-1)),e(x,{class:"text-justify"},{default:t(()=>[e(V,{cols:"12"},{default:t(()=>[e(x,{class:"text-center py-2",justify:"center"},{default:t(()=>[r("h1",null,c(n(D)),1)]),_:1})]),_:1}),e(V,{cols:"12"},{default:t(()=>[e(Q,{class:"my-3 pa-2",color:"cardColor",raised:"",elevation:"8"},{default:t(()=>[e(W,null,{default:t(()=>[o[1]||(o[1]=r("div",{class:"flex-grow-1"},null,-1)),e(X,{modelValue:n(u),"onUpdate:modelValue":o[0]||(o[0]=l=>Z(u)?u.value=l:null),"append-icon":"mdi-magnify",label:"Search","single-line":"","hide-details":""},null,8,["modelValue"])]),_:1}),e(tt,{headers:P,items:n(M),search:n(u),"items-per-page":10},{item:t(({item:l})=>[r("tr",null,[r("td",null,[e(H,{to:L([l.slug])},{default:t(()=>[d(c(l.name),1)]),_:2},1032,["to"]),o[2]||(o[2]=d("    ")),e(ot,null,{default:t(()=>[d(c(N(l.name)),1)]),_:2},1024)]),r("td",at,c(l.count),1)])]),"no-results":t(()=>[e(et,null,{default:t(()=>[d(' Your search for "'+c(n(u))+'" found no results. ',1)]),_:1})]),_:1},8,["items","search"])]),_:1})]),_:1})]),_:1})]),_:1})}}};export{dt as default};
