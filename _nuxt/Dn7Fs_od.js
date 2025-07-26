import{p as y}from"./C5Cdrf4V.js";import{_ as l,s as B,g as S,t as z,q as F,a as P,b as E,F as v,K as W,e as T,z as D,G as _,H as A,l as w}from"./FWwcox_v.js";import{p as N}from"./th4KDJHD.js";import"./6vk3UEUC.js";import"./nk_nMRXv.js";import"./DywCTW_X.js";import"./CtPChB5C.js";import"./C2J99K46.js";import"./v-pT9cP2.js";import"./DlAUqK2U.js";import"./BdSSKDOF.js";import"./Dq2Py4Ul.js";import"./DzRdPAyL.js";import"./cLFumz1x.js";import"./lyvBUpQL.js";import"./eXBKaKSl.js";import"./CXDFu72n.js";import"./BMSQkwth.js";import"./ryQlorFW.js";import"./DsRd_DMW.js";import"./D_LZ3y8A.js";var x={packet:[]},u=structuredClone(x),L=A.packet,Y=l(()=>{const t=v({...L,..._().packet});return t.showBits&&(t.paddingY+=10),t},"getConfig"),G=l(()=>u.packet,"getPacket"),H=l(t=>{t.length>0&&u.packet.push(t)},"pushWord"),I=l(()=>{D(),u=structuredClone(x)},"clear"),h={pushWord:H,getPacket:G,getConfig:Y,clear:I,setAccTitle:E,getAccTitle:P,setDiagramTitle:F,getDiagramTitle:z,getAccDescription:S,setAccDescription:B},K=1e4,M=l(t=>{y(t,h);let e=-1,o=[],i=1;const{bitsPerRow:s}=h.getConfig();for(let{start:a,end:r,bits:c,label:f}of t.blocks){if(a!==void 0&&r!==void 0&&r<a)throw new Error(`Packet block ${a} - ${r} is invalid. End must be greater than start.`);if(a??=e+1,a!==e+1)throw new Error(`Packet block ${a} - ${r??a} is not contiguous. It should start from ${e+1}.`);if(c===0)throw new Error(`Packet block ${a} is invalid. Cannot have a zero bit field.`);for(r??=a+(c??1)-1,c??=r-a+1,e=r,w.debug(`Packet block ${a} - ${e} with label ${f}`);o.length<=s+1&&h.getPacket().length<K;){const[d,p]=O({start:a,end:r,bits:c,label:f},i,s);if(o.push(d),d.end+1===i*s&&(h.pushWord(o),o=[],i++),!p)break;({start:a,end:r,bits:c,label:f}=p)}}h.pushWord(o)},"populate"),O=l((t,e,o)=>{if(t.start===void 0)throw new Error("start should have been set during first phase");if(t.end===void 0)throw new Error("end should have been set during first phase");if(t.start>t.end)throw new Error(`Block start ${t.start} is greater than block end ${t.end}.`);if(t.end+1<=e*o)return[t,void 0];const i=e*o-1,s=e*o;return[{start:t.start,end:i,label:t.label,bits:i-t.start},{start:s,end:t.end,label:t.label,bits:t.end-s}]},"getNextFittingBlock"),q={parse:l(async t=>{const e=await N("packet",t);w.debug(e),M(e)},"parse")},R=l((t,e,o,i)=>{const s=i.db,a=s.getConfig(),{rowHeight:r,paddingY:c,bitWidth:f,bitsPerRow:d}=a,p=s.getPacket(),n=s.getDiagramTitle(),k=r+c,g=k*(p.length+1)-(n?0:r),m=f*d+2,b=W(e);b.attr("viewbox",`0 0 ${m} ${g}`),T(b,g,m,a.useMaxWidth);for(const[C,$]of p.entries())U(b,$,C,a);b.append("text").text(n).attr("x",m/2).attr("y",g-k/2).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","packetTitle")},"draw"),U=l((t,e,o,{rowHeight:i,paddingX:s,paddingY:a,bitWidth:r,bitsPerRow:c,showBits:f})=>{const d=t.append("g"),p=o*(i+a)+a;for(const n of e){const k=n.start%c*r+1,g=(n.end-n.start+1)*r-s;if(d.append("rect").attr("x",k).attr("y",p).attr("width",g).attr("height",i).attr("class","packetBlock"),d.append("text").attr("x",k+g/2).attr("y",p+i/2).attr("class","packetLabel").attr("dominant-baseline","middle").attr("text-anchor","middle").text(n.label),!f)continue;const m=n.end===n.start,b=p-2;d.append("text").attr("x",k+(m?g/2:0)).attr("y",b).attr("class","packetByte start").attr("dominant-baseline","auto").attr("text-anchor",m?"middle":"start").text(n.start),m||d.append("text").attr("x",k+g).attr("y",b).attr("class","packetByte end").attr("dominant-baseline","auto").attr("text-anchor","end").text(n.end)}},"drawWord"),X={draw:R},j={byteFontSize:"10px",startByteColor:"black",endByteColor:"black",labelColor:"black",labelFontSize:"12px",titleColor:"black",titleFontSize:"14px",blockStrokeColor:"black",blockStrokeWidth:"1",blockFillColor:"#efefef"},J=l(({packet:t}={})=>{const e=v(j,t);return`
	.packetByte {
		font-size: ${e.byteFontSize};
	}
	.packetByte.start {
		fill: ${e.startByteColor};
	}
	.packetByte.end {
		fill: ${e.endByteColor};
	}
	.packetLabel {
		fill: ${e.labelColor};
		font-size: ${e.labelFontSize};
	}
	.packetTitle {
		fill: ${e.titleColor};
		font-size: ${e.titleFontSize};
	}
	.packetBlock {
		stroke: ${e.blockStrokeColor};
		stroke-width: ${e.blockStrokeWidth};
		fill: ${e.blockFillColor};
	}
	`},"styles"),ut={parser:q,db:h,renderer:X,styles:J};export{ut as diagram};
