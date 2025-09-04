import{p as j}from"./Bgqj137g.js";import{Q as S,T as M,aF as q,_ as u,g as H,s as K,a as Q,b as Z,t as J,q as X,l as z,c as Y,F as tt,K as et,a4 as at,e as rt,z as nt,H as it}from"./DIuqYVlD.js";import{p as ot}from"./Bpq4S6sg.js";import{d as I}from"./CqW8VF75.js";import{o as st}from"./CmKTTxBW.js";import"./Bc4_OA0p.js";import"./Dfi906IK.js";import"./BxDw4ADF.js";import"./qO0vbPzS.js";import"./CsOQXfP2.js";import"./DEtSRg9O.js";import"./Db1tpaF3.js";import"./BPhcRojd.js";import"./IZNuYLzW.js";import"./BF3CIzWZ.js";import"./DqAMxU1p.js";import"./BZYfth3v.js";import"./CXDFu72n.js";import"./BMSQkwth.js";import"./dZZ2cbdB.js";import"./C5mNO2dE.js";import"./D_N0y_Or.js";import"./Gi6I4Gst.js";function lt(t,a){return a<t?-1:a>t?1:a>=t?0:NaN}function ct(t){return t}function pt(){var t=ct,a=lt,f=null,x=S(0),o=S(M),l=S(0);function s(e){var n,c=(e=q(e)).length,d,y,h=0,p=new Array(c),i=new Array(c),v=+x.apply(this,arguments),w=Math.min(M,Math.max(-M,o.apply(this,arguments)-v)),m,C=Math.min(Math.abs(w)/c,l.apply(this,arguments)),$=C*(w<0?-1:1),g;for(n=0;n<c;++n)(g=i[p[n]=n]=+t(e[n],n,e))>0&&(h+=g);for(a!=null?p.sort(function(A,D){return a(i[A],i[D])}):f!=null&&p.sort(function(A,D){return f(e[A],e[D])}),n=0,y=h?(w-c*$)/h:0;n<c;++n,v=m)d=p[n],g=i[d],m=v+(g>0?g*y:0)+$,i[d]={data:e[d],index:n,value:g,startAngle:v,endAngle:m,padAngle:C};return i}return s.value=function(e){return arguments.length?(t=typeof e=="function"?e:S(+e),s):t},s.sortValues=function(e){return arguments.length?(a=e,f=null,s):a},s.sort=function(e){return arguments.length?(f=e,a=null,s):f},s.startAngle=function(e){return arguments.length?(x=typeof e=="function"?e:S(+e),s):x},s.endAngle=function(e){return arguments.length?(o=typeof e=="function"?e:S(+e),s):o},s.padAngle=function(e){return arguments.length?(l=typeof e=="function"?e:S(+e),s):l},s}var ut=it.pie,G={sections:new Map,showData:!1},T=G.sections,N=G.showData,dt=structuredClone(ut),gt=u(()=>structuredClone(dt),"getConfig"),ft=u(()=>{T=new Map,N=G.showData,nt()},"clear"),mt=u(({label:t,value:a})=>{if(a<0)throw new Error(`"${t}" has invalid value: ${a}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);T.has(t)||(T.set(t,a),z.debug(`added new section: ${t}, with value: ${a}`))},"addSection"),ht=u(()=>T,"getSections"),vt=u(t=>{N=t},"setShowData"),St=u(()=>N,"getShowData"),L={getConfig:gt,clear:ft,setDiagramTitle:X,getDiagramTitle:J,setAccTitle:Z,getAccTitle:Q,setAccDescription:K,getAccDescription:H,addSection:mt,getSections:ht,setShowData:vt,getShowData:St},xt=u((t,a)=>{j(t,a),a.setShowData(t.showData),t.sections.map(a.addSection)},"populateDb"),yt={parse:u(async t=>{const a=await ot("pie",t);z.debug(a),xt(a,L)},"parse")},wt=u(t=>`
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
`,"getStyles"),At=wt,Dt=u(t=>{const a=[...t.values()].reduce((o,l)=>o+l,0),f=[...t.entries()].map(([o,l])=>({label:o,value:l})).filter(o=>o.value/a*100>=1).sort((o,l)=>l.value-o.value);return pt().value(o=>o.value)(f)},"createPieArcs"),Ct=u((t,a,f,x)=>{z.debug(`rendering pie chart
`+t);const o=x.db,l=Y(),s=tt(o.getConfig(),l.pie),e=40,n=18,c=4,d=450,y=d,h=et(a),p=h.append("g");p.attr("transform","translate("+y/2+","+d/2+")");const{themeVariables:i}=l;let[v]=at(i.pieOuterStrokeWidth);v??=2;const w=s.textPosition,m=Math.min(y,d)/2-e,C=I().innerRadius(0).outerRadius(m),$=I().innerRadius(m*w).outerRadius(m*w);p.append("circle").attr("cx",0).attr("cy",0).attr("r",m+v/2).attr("class","pieOuterCircle");const g=o.getSections(),A=Dt(g),D=[i.pie1,i.pie2,i.pie3,i.pie4,i.pie5,i.pie6,i.pie7,i.pie8,i.pie9,i.pie10,i.pie11,i.pie12];let b=0;g.forEach(r=>{b+=r});const W=A.filter(r=>(r.data.value/b*100).toFixed(0)!=="0"),E=st(D);p.selectAll("mySlices").data(W).enter().append("path").attr("d",C).attr("fill",r=>E(r.data.label)).attr("class","pieCircle"),p.selectAll("mySlices").data(W).enter().append("text").text(r=>(r.data.value/b*100).toFixed(0)+"%").attr("transform",r=>"translate("+$.centroid(r)+")").style("text-anchor","middle").attr("class","slice"),p.append("text").text(o.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText");const O=[...g.entries()].map(([r,F])=>({label:r,value:F})),k=p.selectAll(".legend").data(O).enter().append("g").attr("class","legend").attr("transform",(r,F)=>{const R=n+c,B=R*O.length/2,V=12*n,U=F*R-B;return"translate("+V+","+U+")"});k.append("rect").attr("width",n).attr("height",n).style("fill",r=>E(r.label)).style("stroke",r=>E(r.label)),k.append("text").attr("x",n+c).attr("y",n-c).text(r=>o.getShowData()?`${r.label} [${r.value}]`:r.label);const _=Math.max(...k.selectAll("text").nodes().map(r=>r?.getBoundingClientRect().width??0)),P=y+e+n+c+_;h.attr("viewBox",`0 0 ${P} ${d}`),rt(h,d,P,s.useMaxWidth)},"draw"),$t={draw:Ct},Qt={parser:yt,db:L,renderer:$t,styles:At};export{Qt as diagram};
