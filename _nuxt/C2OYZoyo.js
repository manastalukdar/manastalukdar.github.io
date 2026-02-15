import{r as u}from"./DEWgsSyj.js";const b=e=>{const t=u(),o=window.document.getElementById(e);if(o)t.value=o;else throw new Error(`Element with id '${e}' was not found.`);return{selectedElement:t}},h=e=>{var t;const o="_blank",l=["fullscreen=yes","titlebar=yes","scrollbars=yes"],a=window.document.title,n=!0,c=!0,i=u(""),r=u(""),s=u(""),d=u(!0),w=u(""),v=u(!0),f=m=>m?.filter(y=>y);return i.value=e?.target||o,r.value=(t=f(e?.features||l))==null?void 0:t.join(","),s.value=e?.windowTitle||a,d.value=e?.autoClose??n,w.value=e?.bodyClass??"",v.value=e?.autoPrint??c,{target:i.value,features:r.value,windowTitle:s.value,autoClose:d.value,bodyClass:w.value,autoPrint:v.value}},C=()=>({attachStyles:(e,t=[])=>{t.length&&t.forEach(o=>{let l=e.document.createElement("link");l.setAttribute("rel","stylesheet"),l.setAttribute("type","text/css"),l.setAttribute("href",o),e.document.getElementsByTagName("head")[0].appendChild(l)})}}),p=(e,t)=>{const o=u(),l=window.open("",e,t);return l&&(l.opener||(l.opener=self),l.focus(),o.value=l),{previewWindow:o}},g=()=>({writeWindowContent:(e,t,o)=>{e.document.write(`
      <html>
        <head>
          <title>${e.document.title}</title>
        </head>
        <body class="${o}">
          ${t.innerHTML}
        </body>
      </html>
    `)}}),E=(e,t,o=()=>{})=>{const l=a=>{const{target:n,features:c,windowTitle:i,autoClose:r,bodyClass:s,autoPrint:d}=h(a),{previewWindow:w}=p(n,c);return{defaultWindow:w.value,target:n,windowTitle:i,autoClose:r,bodyClass:s,autoPrint:d}};return{paperize:()=>{const{selectedElement:a}=b(e),{defaultWindow:n,target:c,windowTitle:i,autoClose:r,bodyClass:s,autoPrint:d}=l(t),{writeWindowContent:w}=g(),{attachStyles:v}=C();n&&a.value&&(n.document.title=i||document.title,w(n,a.value,s),v(n,t?.styles),setTimeout(()=>{n.document.close(),n.focus(),d&&(n.print(),setTimeout(function(){c==="_blank"&&r&&n.close()},1)),o()},1e3))}}};export{E as W};
