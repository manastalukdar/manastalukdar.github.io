import{p as B}from"./C5Cdrf4V.js";import{V as y,P as z,aF as U,_ as p,g as j,s as q,a as H,b as K,t as Z,q as J,l as F,c as Q,F as X,K as Y,a4 as tt,e as et,z as at,H as rt}from"./FWwcox_v.js";import{p as nt}from"./th4KDJHD.js";import{d as O}from"./CyzbtCkG.js";import{o as it}from"./CmKTTxBW.js";import"./6vk3UEUC.js";import"./nk_nMRXv.js";import"./DywCTW_X.js";import"./CtPChB5C.js";import"./C2J99K46.js";import"./v-pT9cP2.js";import"./DlAUqK2U.js";import"./BdSSKDOF.js";import"./Dq2Py4Ul.js";import"./DzRdPAyL.js";import"./cLFumz1x.js";import"./lyvBUpQL.js";import"./eXBKaKSl.js";import"./CXDFu72n.js";import"./BMSQkwth.js";import"./ryQlorFW.js";import"./DsRd_DMW.js";import"./D_LZ3y8A.js";import"./Gi6I4Gst.js";function ot(t,a){return a<t?-1:a>t?1:a>=t?0:NaN}function st(t){return t}function lt(){var t=st,a=ot,f=null,o=y(0),u=y(z),x=y(0);function i(e){var r,l=(e=U(e)).length,d,A,h=0,c=new Array(l),n=new Array(l),v=+o.apply(this,arguments),w=Math.min(z,Math.max(-z,u.apply(this,arguments)-v)),m,T=Math.min(Math.abs(w)/l,x.apply(this,arguments)),$=T*(w<0?-1:1),g;for(r=0;r<l;++r)(g=n[c[r]=r]=+t(e[r],r,e))>0&&(h+=g);for(a!=null?c.sort(function(S,C){return a(n[S],n[C])}):f!=null&&c.sort(function(S,C){return f(e[S],e[C])}),r=0,A=h?(w-l*$)/h:0;r<l;++r,v=m)d=c[r],g=n[d],m=v+(g>0?g*A:0)+$,n[d]={data:e[d],index:r,value:g,startAngle:v,endAngle:m,padAngle:T};return n}return i.value=function(e){return arguments.length?(t=typeof e=="function"?e:y(+e),i):t},i.sortValues=function(e){return arguments.length?(a=e,f=null,i):a},i.sort=function(e){return arguments.length?(f=e,a=null,i):f},i.startAngle=function(e){return arguments.length?(o=typeof e=="function"?e:y(+e),i):o},i.endAngle=function(e){return arguments.length?(u=typeof e=="function"?e:y(+e),i):u},i.padAngle=function(e){return arguments.length?(x=typeof e=="function"?e:y(+e),i):x},i}var ct=rt.pie,G={sections:new Map,showData:!1},b=G.sections,P=G.showData,pt=structuredClone(ct),ut=p(()=>structuredClone(pt),"getConfig"),dt=p(()=>{b=new Map,P=G.showData,at()},"clear"),gt=p(({label:t,value:a})=>{b.has(t)||(b.set(t,a),F.debug(`added new section: ${t}, with value: ${a}`))},"addSection"),mt=p(()=>b,"getSections"),ft=p(t=>{P=t},"setShowData"),ht=p(()=>P,"getShowData"),R={getConfig:ut,clear:dt,setDiagramTitle:J,getDiagramTitle:Z,setAccTitle:K,getAccTitle:H,setAccDescription:q,getAccDescription:j,addSection:gt,getSections:mt,setShowData:ft,getShowData:ht},vt=p((t,a)=>{B(t,a),a.setShowData(t.showData),t.sections.map(a.addSection)},"populateDb"),St={parse:p(async t=>{const a=await nt("pie",t);F.debug(a),vt(a,R)},"parse")},yt=p(t=>`
  .pieCircle{
    stroke: ${t.pieStrokeColor};
    stroke-width : ${t.pieStrokeWidth};
    opacity : ${t.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${t.pieOuterStrokeColor};
    stroke-width: ${t.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${t.pieTitleTextSize};
    fill: ${t.pieTitleTextColor};
    font-family: ${t.fontFamily};
  }
  .slice {
    font-family: ${t.fontFamily};
    fill: ${t.pieSectionTextColor};
    font-size:${t.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${t.pieLegendTextColor};
    font-family: ${t.fontFamily};
    font-size: ${t.pieLegendTextSize};
  }
`,"getStyles"),xt=yt,At=p(t=>{const a=[...t.entries()].map(o=>({label:o[0],value:o[1]})).sort((o,u)=>u.value-o.value);return lt().value(o=>o.value)(a)},"createPieArcs"),wt=p((t,a,f,o)=>{F.debug(`rendering pie chart
`+t);const u=o.db,x=Q(),i=X(u.getConfig(),x.pie),e=40,r=18,l=4,d=450,A=d,h=Y(a),c=h.append("g");c.attr("transform","translate("+A/2+","+d/2+")");const{themeVariables:n}=x;let[v]=tt(n.pieOuterStrokeWidth);v??=2;const w=i.textPosition,m=Math.min(A,d)/2-e,T=O().innerRadius(0).outerRadius(m),$=O().innerRadius(m*w).outerRadius(m*w);c.append("circle").attr("cx",0).attr("cy",0).attr("r",m+v/2).attr("class","pieOuterCircle");const g=u.getSections(),S=At(g),C=[n.pie1,n.pie2,n.pie3,n.pie4,n.pie5,n.pie6,n.pie7,n.pie8,n.pie9,n.pie10,n.pie11,n.pie12],D=it(C);c.selectAll("mySlices").data(S).enter().append("path").attr("d",T).attr("fill",s=>D(s.data.label)).attr("class","pieCircle");let W=0;g.forEach(s=>{W+=s}),c.selectAll("mySlices").data(S).enter().append("text").text(s=>(s.data.value/W*100).toFixed(0)+"%").attr("transform",s=>"translate("+$.centroid(s)+")").style("text-anchor","middle").attr("class","slice"),c.append("text").text(u.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText");const M=c.selectAll(".legend").data(D.domain()).enter().append("g").attr("class","legend").attr("transform",(s,k)=>{const E=r+l,L=E*D.domain().length/2,_=12*r,V=k*E-L;return"translate("+_+","+V+")"});M.append("rect").attr("width",r).attr("height",r).style("fill",D).style("stroke",D),M.data(S).append("text").attr("x",r+l).attr("y",r-l).text(s=>{const{label:k,value:E}=s.data;return u.getShowData()?`${k} [${E}]`:k});const I=Math.max(...M.selectAll("text").nodes().map(s=>s?.getBoundingClientRect().width??0)),N=A+e+r+l+I;h.attr("viewBox",`0 0 ${N} ${d}`),et(h,d,N,i.useMaxWidth)},"draw"),Ct={draw:wt},Kt={parser:St,db:R,renderer:Ct,styles:xt};export{Kt as diagram};
