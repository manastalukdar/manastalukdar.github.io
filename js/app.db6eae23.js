(function(t){function e(e){for(var n,o,s=e[0],l=e[1],u=e[2],f=0,v=[];f<s.length;f++)o=s[f],i[o]&&v.push(i[o][0]),i[o]=0;for(n in l)Object.prototype.hasOwnProperty.call(l,n)&&(t[n]=l[n]);c&&c(e);while(v.length)v.shift()();return r.push.apply(r,u||[]),a()}function a(){for(var t,e=0;e<r.length;e++){for(var a=r[e],n=!0,s=1;s<a.length;s++){var l=a[s];0!==i[l]&&(n=!1)}n&&(r.splice(e--,1),t=o(o.s=a[0]))}return t}var n={},i={app:0},r=[];function o(e){if(n[e])return n[e].exports;var a=n[e]={i:e,l:!1,exports:{}};return t[e].call(a.exports,a,a.exports,o),a.l=!0,a.exports}o.m=t,o.c=n,o.d=function(t,e,a){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},o.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(o.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)o.d(a,n,function(e){return t[e]}.bind(null,n));return a},o.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="/";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],l=s.push.bind(s);s.push=e,s=s.slice();for(var u=0;u<s.length;u++)e(s[u]);var c=l;r.push([0,"chunk-vendors"]),a()})({0:function(t,e,a){t.exports=a("56d7")},"0588":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-footer",{attrs:{app:"",dark:"",height:"auto"}},[a("v-card",{staticClass:"flex",attrs:{flat:"",tile:""}},[a("v-card-actions",{staticClass:"dark blue darken-3 py-3 justify-center"},[t._v("\n      © "+t._s(t.copyrightStartYear)+"—"+t._s(t.copyrightEndYear)+" "),a("strong",[t._v(t._s(t.appOwner))])])],1)],1)},i=[],r=a("2f62"),o={computed:Object(r["c"])({appOwner:function(t){return t.GlobalData.appOwner},copyrightStartYear:function(t){return t.GlobalData.copyrightStartYear},copyrightEndYear:function(t){return t.GlobalData.copyrightEndYear}})},s=o,l=a("2877"),u=a("6544"),c=a.n(u),f=a("b0af"),v=a("99d9"),d=a("553a"),m=Object(l["a"])(s,n,i,!1,null,null,null);e["default"]=m.exports;c()(m,{VCard:f["a"],VCardActions:v["a"],VFooter:d["a"]})},"0d1a":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",[a("v-layout",{attrs:{wrap:""}},[a("v-flex",{attrs:{xs12:""}},[t._v("\n        This a personal website and has nothing to do with my employers, past and present. Any content here or in embedded sites, particularly in the blog section, does not constitute endorsement or guarantees of anything including veracity. I hold the right to determine exclusions. My resume, provided via this site, being an obvious choice.\n    ")])],1)],1)},i=[],r={},o=r,s=a("2877"),l=a("6544"),u=a.n(l),c=a("a523"),f=a("0e8f"),v=a("a722"),d=Object(s["a"])(o,n,i,!1,null,null,null);e["default"]=d.exports;u()(d,{VContainer:c["a"],VFlex:f["a"],VLayout:v["a"]})},"124a":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("v-list-tile",{attrs:{to:t.contactForm.href}},[a("v-list-tile-avatar",[a("v-icon",[t._v(t._s(t.contactForm.icon))])],1),a("v-list-tile-title",{domProps:{textContent:t._s(t.contactForm.text)}})],1),a("v-divider"),a("v-subheader",{domProps:{textContent:t._s(t.subHeaderTextSocialMedia.text)}}),t._l(t.socialMediaItems,function(e){return a("v-list-tile",{key:e.text,attrs:{href:e.href,target:e.target}},[a("v-list-tile-avatar",[a("v-icon",[t._v(t._s(e.icon))])],1),a("v-list-tile-title",{domProps:{textContent:t._s(e.text)}})],1)})],2)},i=[],r=a("2f62"),o={computed:Object(r["c"])({subHeaderTextSocialMedia:function(t){return t.MainNavMenu.contact.subHeaderTextSocialMedia},contactForm:function(t){return t.MainNavMenu.contact.contactForm},socialMediaItems:function(t){return t.MainNavMenu.contact.socialMediaItems}}),data:function(){return{}}},s=o,l=a("2877"),u=a("6544"),c=a.n(u),f=a("ce7e"),v=a("132d"),d=a("ba95"),m=a("c954"),b=a("5d23"),p=a("e0c7"),h=Object(l["a"])(s,n,i,!1,null,null,null);e["default"]=h.exports;c()(h,{VDivider:f["a"],VIcon:v["a"],VListTile:d["a"],VListTileAvatar:m["a"],VListTileTitle:b["a"],VSubheader:p["a"]})},"13a2":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",t._l(t.aboutItems,function(e){return a("v-list-tile",{key:e.text,attrs:{to:e.href}},[a("v-list-tile-avatar",[a("v-icon",[t._v(t._s(e.icon))])],1),a("v-list-tile-title",{domProps:{textContent:t._s(e.text)}})],1)}),1)},i=[],r=(a("cadf"),a("551c"),a("f751"),a("097d"),a("2f62")),o={computed:Object(r["c"])({aboutItems:function(t){return t.MainNavMenu.about.aboutItems}}),data:function(){return{}}},s=o,l=a("2877"),u=a("6544"),c=a.n(u),f=a("132d"),v=a("ba95"),d=a("c954"),m=a("5d23"),b=Object(l["a"])(s,n,i,!1,null,null,null);e["default"]=b.exports;c()(b,{VIcon:f["a"],VListTile:v["a"],VListTileAvatar:d["a"],VListTileTitle:m["a"]})},"402e":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",[a("v-layout",{attrs:{"text-xs-center":"",wrap:""}},[a("v-flex",{attrs:{xs12:""}},[a("v-list",[a("v-layout",{attrs:{row:"","justify-center":""}},t._l(t.socialMediaItems,function(e){return a("v-list-tile",{key:e.text,attrs:{href:e.href,target:e.target}},[a("v-list-tile-avatar",[a("v-icon",[t._v(t._s(e.icon))])],1)],1)}),1)],1)],1),a("v-flex",{attrs:{xs12:""}},[a("v-list",[a("v-layout",{attrs:{row:"","justify-center":""}},[a("v-list-tile",{key:t.aboutItems[0].text,attrs:{to:t.aboutItems[0].href}},[a("v-list-tile-title",{domProps:{textContent:t._s(t.aboutItems[0].text)}})],1)],1)],1)],1)],1)],1)},i=[],r=a("2f62"),o={computed:Object(r["c"])({socialMediaItems:function(t){return t.MainNavMenu.contact.socialMediaItems},aboutItems:function(t){return t.MainNavMenu.about.aboutItems}})},s=o,l=(a("ef7e"),a("2877")),u=a("6544"),c=a.n(u),f=a("a523"),v=a("0e8f"),d=a("132d"),m=a("a722"),b=a("8860"),p=a("ba95"),h=a("c954"),x=a("5d23"),g=Object(l["a"])(s,n,i,!1,null,"384cd525",null);e["default"]=g.exports;c()(g,{VContainer:f["a"],VFlex:v["a"],VIcon:d["a"],VLayout:m["a"],VList:b["a"],VListTile:p["a"],VListTileAvatar:h["a"],VListTileTitle:x["a"]})},4292:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-toolbar",{attrs:{color:"blue darken-3",dark:"",app:""}},[a("v-toolbar-title",{staticClass:"headline"},[a("router-link",{staticStyle:{cursor:"pointer"},attrs:{to:"/",tag:"span"}},[t._v("\n        "+t._s(t.appTitle)+"\n    ")])],1),a("v-spacer"),a("v-toolbar-items",{staticClass:"hidden-sm-and-down"},[a("main-nav-menu-blog"),a("main-nav-menu-about"),a("main-nav-menu-legal"),a("main-nav-menu-contact")],1),a("v-menu",{staticClass:"hidden-md-and-up"},[a("v-toolbar-side-icon",{attrs:{slot:"activator"},on:{click:t.flipSidebarVisibility},slot:"activator"})],1)],1)},i=[],r=a("2f62"),o={computed:Object(r["c"])({appTitle:function(t){return t.GlobalData.appTitle}}),methods:Object(r["b"])("MainNavMenu",["flipSidebarVisibility"]),data:function(){return{}}},s=o,l=a("2877"),u=a("6544"),c=a.n(u),f=a("e449"),v=a("9910"),d=a("71d9"),m=a("2a7f"),b=a("706c"),p=Object(l["a"])(s,n,i,!1,null,null,null);e["default"]=p.exports;c()(p,{VMenu:f["a"],VSpacer:v["a"],VToolbar:d["a"],VToolbarItems:m["a"],VToolbarSideIcon:b["a"],VToolbarTitle:m["b"]})},"445b":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-menu",{attrs:{attach:"",bottom:"",left:"","offset-y":"","max-height":"500"}},[a("v-btn",{staticStyle:{"min-width":"48px"},attrs:{slot:"activator","aria-label":t.aboutText,flat:""},slot:"activator"},[a("span",{staticClass:"hidden-sm-and-down mr-1",domProps:{textContent:t._s(t.aboutText)}}),a("v-icon",{attrs:{dark:""}},[t._v("arrow_drop_down")])],1),a("v-list",{attrs:{dense:""}},[a("main-nav-menu-aboutMenuItems")],1)],1)},i=[],r=a("2f62"),o={computed:Object(r["c"])({aboutText:function(t){return t.MainNavMenu.about.aboutText}}),data:function(){return{}}},s=o,l=a("2877"),u=a("6544"),c=a.n(u),f=a("8336"),v=a("132d"),d=a("8860"),m=a("e449"),b=Object(l["a"])(s,n,i,!1,null,null,null);e["default"]=b.exports;c()(b,{VBtn:f["a"],VIcon:v["a"],VList:d["a"],VMenu:m["a"]})},"56d7":function(t,e,a){"use strict";a.r(e);a("cadf"),a("551c"),a("f751"),a("097d"),a("5363"),a("d1e7");var n=a("a026"),i=a("bb71");a("da64");n["a"].use(i["a"],{iconfont:"md"});a("bf40");var r=a("ecee"),o=a("c074"),s=a("f2d1"),l=a("ad3d"),u=a("0284"),c=a.n(u),f=(a("d48d"),a("2f62")),v={appTitle:"Manas Talukdar",appOwner:"Manas Talukdar",copyrightStartYear:"2018",copyrightEndYear:(new Date).getFullYear()},d={},m={},b={},p={state:v,getters:d,actions:m,mutations:b},h={sidebarVisible:!1,blog:{blogText:"Blog",blogItems:[{href:"/blog/posts",target:"_blank",icon:"mdi-newspaper",text:"Posts"},{href:"/blog/categories",target:"_blank",icon:"mdi-domain",text:"Categories"},{href:"/blog/tags",target:"_blank",icon:"mdi-tag-multiple",text:"Tags"},{href:"/blog/archive",target:"_blank",icon:"mdi-archive",text:"Archive"}]},about:{aboutText:"About",aboutItems:[{href:"/about/resume",target:"_blank",icon:"mdi-file-document-box",text:"Resume"}]},legal:{legalText:"Legal",legalPath:"/legal/"},contact:{contactText:"Contact",subHeaderTextSocialMedia:{text:"Social Media"},contactForm:{text:"Form",icon:"mdi-email-box",href:"/contact/"},socialMediaItems:[{href:"https://www.linkedin.com/in/manastalukdar/",target:"_blank",icon:"mdi-linkedin",text:"LinkedIn"},{href:"https://github.com/manastalukdar",target:"_blank",icon:"mdi-github-circle",text:"GitHub"},{href:"https://www.twitter.com/manastalukdar/",target:"_blank",icon:"mdi-twitter",text:"Twitter"}]}},x={},g={flipSidebarVisibility:function(t){var e=t.commit;e("flipSidebarVisibility")},setSidebarVisibility:function(t,e){var a=t.commit;a("setSidebarVisibility",e)}},y={flipSidebarVisibility:function(t){t.sidebarVisible=!t.sidebarVisible},setSidebarVisibility:function(t,e){t.sidebarVisible=e}},_={namespaced:!0,state:h,getters:x,actions:g,mutations:y};a("54ba");n["a"].use(f["a"]);var V=!1,w=new f["a"].Store({modules:{GlobalData:p,MainNavMenu:_},strict:V}),M=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-app",{attrs:{dark:""}},[a("main-nav-menu-navigationDrawer"),a("main-nav-menu-topNavBar"),a("v-content",[a("router-view")],1),a("layout-footer")],1)},T=[],j={name:"App",components:{}},k=j,C=a("2877"),O=a("6544"),I=a.n(O),L=a("7496"),N=a("549c"),S=Object(C["a"])(k,M,T,!1,null,null,null),E=S.exports;I()(S,{VApp:L["a"],VContent:N["a"]});a("a481"),a("ac6a");var P=a("8103"),$=a.n(P),F=a("bba4"),A=a.n(F),D=function(t){return{name:"v-".concat(t),render:function(e){return e("div",{staticClass:t},this.$slots.default)}}};n["a"].component("v-headline",D("headline")),n["a"].component("v-display-1",D("display-1")),n["a"].component("v-display-2",D("display-2")),n["a"].component("v-overline",D("overline")),n["a"].component("v-subtitle-1",D("subtitle-1")),n["a"].component("v-subtitle-2",D("subtitle-2"));var B=a("ffe0");n["a"].component("v-paper",{render:function(t){return t("v-card",this.$slots.default)}}),B.keys().forEach(function(t){var e=$()(A()(t.replace(/^\.\//,"").replace(/\.\w+$/,"")));n["a"].component(e,function(e){var a=B(t);e(a.default||a)})});var H=a("8c4f"),Y=a("402e"),G=a("933e"),U=a("b8f7"),q=a("0d1a"),W=a("f79b");n["a"].use(H["a"]);var J=new H["a"]({mode:"history",routes:[{path:"/",name:"Home",component:Y["default"]},{path:"/blog/posts",name:"blog-posts",component:G["default"]},{path:"/about/resume",name:"about-resume",component:U["default"]},{path:"/legal/",name:"about-legal",component:q["default"]},{path:"*",name:"NotFound",component:W["default"]}]});n["a"].use("./plugins/vuetify",{iconfont:"mdi"}),r["c"].add(o["b"],o["a"],s["b"],s["a"],s["c"]),n["a"].component("font-awesome-icon",l["a"]),n["a"].component("font-awesome-layers",l["b"]),n["a"].component("font-awesome-layers-text",l["c"]),n["a"].config.productionTip=!1;var z=!0;n["a"].use(c.a,{id:"UA-118888630-1",router:J,debug:{enabled:!z,sendHitTask:z}}),new n["a"]({router:J,store:w,render:function(t){return t(E)},created:function(){}}).$mount("#app")},"5bda":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-menu",{attrs:{attach:"",bottom:"",left:"","offset-y":"","max-height":"500"}},[a("v-btn",{staticStyle:{"min-width":"48px"},attrs:{slot:"activator","aria-label":t.contactText,flat:""},slot:"activator"},[a("span",{staticClass:"hidden-sm-and-down mr-1",domProps:{textContent:t._s(t.contactText)}}),a("v-icon",{attrs:{dark:""}},[t._v("arrow_drop_down")])],1),a("v-list",{attrs:{dense:""}},[a("main-nav-menu-contactMenuItems")],1)],1)},i=[],r=a("2f62"),o={computed:Object(r["c"])({contactText:function(t){return t.MainNavMenu.contact.contactText}}),data:function(){return{}}},s=o,l=a("2877"),u=a("6544"),c=a.n(u),f=a("8336"),v=a("132d"),d=a("8860"),m=a("e449"),b=Object(l["a"])(s,n,i,!1,null,null,null);e["default"]=b.exports;c()(b,{VBtn:f["a"],VIcon:v["a"],VList:d["a"],VMenu:m["a"]})},"5d72":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",t._l(t.blogItems,function(e){return a("v-list-tile",{key:e.text,attrs:{to:e.href}},[a("v-list-tile-avatar",[a("v-icon",[t._v(t._s(e.icon))])],1),a("v-list-tile-title",{domProps:{textContent:t._s(e.text)}})],1)}),1)},i=[],r=a("2f62"),o={computed:Object(r["c"])({blogItems:function(t){return t.MainNavMenu.blog.blogItems}}),data:function(){return{}}},s=o,l=a("2877"),u=a("6544"),c=a.n(u),f=a("132d"),v=a("ba95"),d=a("c954"),m=a("5d23"),b=Object(l["a"])(s,n,i,!1,null,null,null);e["default"]=b.exports;c()(b,{VIcon:f["a"],VListTile:v["a"],VListTileAvatar:d["a"],VListTileTitle:m["a"]})},"6fa2":function(t,e,a){},8836:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-container",[n("v-layout",{attrs:{"text-xs-center":"",wrap:""}},[n("v-flex",{attrs:{xs12:""}},[n("v-img",{staticClass:"my-3",attrs:{src:a("9b19"),contain:"",height:"200"}})],1),n("v-flex",{attrs:{"mb-4":""}},[n("h1",{staticClass:"display-2 font-weight-bold mb-3"},[t._v("\n        Welcome to Vuetify\n      ")]),n("p",{staticClass:"subheading font-weight-regular"},[t._v("\n        For help and collaboration with other Vuetify developers,\n        "),n("br"),t._v("please join our online\n        "),n("a",{attrs:{href:"https://community.vuetifyjs.com",target:"_blank"}},[t._v("Discord Community")])])]),n("v-flex",{attrs:{"mb-5":"",xs12:""}},[n("h2",{staticClass:"headline font-weight-bold mb-3"},[t._v("What's next?")]),n("v-layout",{attrs:{"justify-center":""}},t._l(t.whatsNext,function(e,a){return n("a",{key:a,staticClass:"subheading mx-3",attrs:{href:e.href,target:"_blank"}},[t._v("\n          "+t._s(e.text)+"\n        ")])}),0)],1),n("v-flex",{attrs:{xs12:"","mb-5":""}},[n("h2",{staticClass:"headline font-weight-bold mb-3"},[t._v("Important Links")]),n("v-layout",{attrs:{"justify-center":""}},t._l(t.importantLinks,function(e,a){return n("a",{key:a,staticClass:"subheading mx-3",attrs:{href:e.href,target:"_blank"}},[t._v("\n          "+t._s(e.text)+"\n        ")])}),0)],1),n("v-flex",{attrs:{xs12:"","mb-5":""}},[n("h2",{staticClass:"headline font-weight-bold mb-3"},[t._v("Ecosystem")]),n("v-layout",{attrs:{"justify-center":""}},t._l(t.ecosystem,function(e,a){return n("a",{key:a,staticClass:"subheading mx-3",attrs:{href:e.href,target:"_blank"}},[t._v("\n          "+t._s(e.text)+"\n        ")])}),0)],1)],1)],1)},i=[],r={data:function(){return{ecosystem:[{text:"vuetify-loader",href:"https://github.com/vuetifyjs/vuetify-loader"},{text:"github",href:"https://github.com/vuetifyjs/vuetify"},{text:"awesome-vuetify",href:"https://github.com/vuetifyjs/awesome-vuetify"}],importantLinks:[{text:"Documentation",href:"https://vuetifyjs.com"},{text:"Chat",href:"https://community.vuetifyjs.com"},{text:"Made with Vuetify",href:"https://madewithvuetifyjs.com"},{text:"Twitter",href:"https://twitter.com/vuetifyjs"},{text:"Articles",href:"https://medium.com/vuetify"}],whatsNext:[{text:"Explore components",href:"https://vuetifyjs.com/components/api-explorer"},{text:"Select a layout",href:"https://vuetifyjs.com/layout/pre-defined"},{text:"Frequently Asked Questions",href:"https://vuetifyjs.com/getting-started/frequently-asked-questions"}]}}},o=r,s=a("2877"),l=a("6544"),u=a.n(l),c=a("a523"),f=a("0e8f"),v=a("adda"),d=a("a722"),m=Object(s["a"])(o,n,i,!1,null,null,null);e["default"]=m.exports;u()(m,{VContainer:c["a"],VFlex:f["a"],VImg:v["a"],VLayout:d["a"]})},"933e":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",[a("v-layout",{attrs:{"text-xs-center":"",wrap:""}},[a("v-flex",{attrs:{xs12:""}},[t._v("\n        Under construction.\n    ")])],1)],1)},i=[],r={},o=r,s=a("2877"),l=a("6544"),u=a.n(l),c=a("a523"),f=a("0e8f"),v=a("a722"),d=Object(s["a"])(o,n,i,!1,null,null,null);e["default"]=d.exports;u()(d,{VContainer:c["a"],VFlex:f["a"],VLayout:v["a"]})},"9b19":function(t,e,a){t.exports=a.p+"img/logo.07d1e22e.svg"},aeff:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-menu",{attrs:{attach:"",bottom:"",left:"","offset-y":"","max-height":"500"}},[a("v-btn",{staticStyle:{"min-width":"48px"},attrs:{slot:"activator","aria-label":t.legalText,flat:"",to:t.legalPath},slot:"activator"},[a("span",{staticClass:"hidden-sm-and-down mr-1",domProps:{textContent:t._s(t.legalText)}})])],1)},i=[],r=a("2f62"),o={computed:Object(r["c"])({legalText:function(t){return t.MainNavMenu.legal.legalText},legalPath:function(t){return t.MainNavMenu.legal.legalPath}}),data:function(){return{}}},s=o,l=a("2877"),u=a("6544"),c=a.n(u),f=a("8336"),v=a("e449"),d=Object(l["a"])(s,n,i,!1,null,null,null);e["default"]=d.exports;c()(d,{VBtn:f["a"],VMenu:v["a"]})},b374:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-navigation-drawer",{staticClass:"hidden-md-and-up",attrs:{app:"",right:"","disable-resize-watcher":!0,"disable-route-watcher":!0},model:{value:t.sidebarVisibility,callback:function(e){t.sidebarVisibility=e},expression:"sidebarVisibility"}},[a("v-list",[a("v-list-group",{attrs:{"no-action":""}},[a("v-list-tile",{attrs:{slot:"activator"},slot:"activator"},[a("v-list-tile-action",[a("v-icon",[t._v("mdi-blogger")])],1),a("v-list-tile-title",[t._v(t._s(t.blogText))])],1),a("main-nav-menu-blobMenuItems")],1),a("v-list-group",{attrs:{"no-action":""}},[a("v-list-tile",{attrs:{slot:"activator"},slot:"activator"},[a("v-list-tile-action",[a("v-icon",[t._v("mdi-information")])],1),a("v-list-tile-title",[t._v(t._s(t.aboutText))])],1),a("main-nav-menu-aboutMenuItems")],1),a("v-list-tile",{attrs:{to:t.legalPath}},[a("v-list-tile-action",[a("v-icon",[t._v("mdi-gavel")])],1),a("v-list-tile-title",[t._v(t._s(t.legalText))])],1),a("v-list-group",{attrs:{"no-action":""}},[a("v-list-tile",{attrs:{slot:"activator"},slot:"activator"},[a("v-list-tile-action",[a("v-icon",[t._v("mdi-contact-mail")])],1),a("v-list-tile-title",[t._v(t._s(t.contactText))])],1),a("main-nav-menu-contactMenuItems")],1)],1)],1)},i=[],r=a("cebc"),o=a("2f62"),s={computed:Object(r["a"])({sidebarVisibility:{get:function(){return this.$store.state.MainNavMenu.sidebarVisible},set:function(t){this.$store.commit("MainNavMenu/setSidebarVisibility",t)}}},Object(o["c"])({blogText:function(t){return t.MainNavMenu.blog.blogText},aboutText:function(t){return t.MainNavMenu.about.aboutText},aboutPath:function(t){return t.MainNavMenu.about.aboutPath},legalText:function(t){return t.MainNavMenu.legal.legalText},legalPath:function(t){return t.MainNavMenu.legal.legalPath},contactText:function(t){return t.MainNavMenu.contact.contactText}}))},l=s,u=a("2877"),c=a("6544"),f=a.n(c),v=a("132d"),d=a("8860"),m=a("56b0"),b=a("ba95"),p=a("40fe"),h=a("5d23"),x=a("f774"),g=Object(u["a"])(l,n,i,!1,null,null,null);e["default"]=g.exports;f()(g,{VIcon:v["a"],VList:d["a"],VListGroup:m["a"],VListTile:b["a"],VListTileAction:p["a"],VListTileTitle:h["a"],VNavigationDrawer:x["a"]})},b8f7:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-card",{staticClass:"resume-wrapper"},[a("iframe",{attrs:{frameborder:"0",scrolling:"no",src:"https://manastalukdar.github.io/resume-cv",name:"resumeBox",id:"resumeBox"}},[a("p",[t._v("iframes are not supported by your browser.")])])])},i=[],r={},o=r,s=(a("e93e"),a("2877")),l=a("6544"),u=a.n(l),c=a("b0af"),f=Object(s["a"])(o,n,i,!1,null,null,null);e["default"]=f.exports;u()(f,{VCard:c["a"]})},c462:function(t,e,a){},e356:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-menu",{attrs:{attach:"",bottom:"",left:"","offset-y":"","max-height":"500"}},[a("v-btn",{staticStyle:{"min-width":"48px"},attrs:{slot:"activator","aria-label":t.blogText,flat:""},slot:"activator"},[a("span",{staticClass:"hidden-sm-and-down mr-1",domProps:{textContent:t._s(t.blogText)}}),a("v-icon",{attrs:{dark:""}},[t._v("arrow_drop_down")])],1),a("v-list",{attrs:{dense:""}},[a("main-nav-menu-blobMenuItems")],1)],1)},i=[],r=(a("cadf"),a("551c"),a("f751"),a("097d"),a("2f62")),o={computed:Object(r["c"])({blogText:function(t){return t.MainNavMenu.blog.blogText}}),data:function(){return{}}},s=o,l=a("2877"),u=a("6544"),c=a.n(u),f=a("8336"),v=a("132d"),d=a("8860"),m=a("e449"),b=Object(l["a"])(s,n,i,!1,null,null,null);e["default"]=b.exports;c()(b,{VBtn:f["a"],VIcon:v["a"],VList:d["a"],VMenu:m["a"]})},e93e:function(t,e,a){"use strict";var n=a("c462"),i=a.n(n);i.a},ef7e:function(t,e,a){"use strict";var n=a("6fa2"),i=a.n(n);i.a},f79b:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",[a("v-layout",{attrs:{"text-xs-center":"",wrap:""}},[a("v-flex",{attrs:{xs12:""}},[a("v-layout",{attrs:{"justify-center":""}},[t._v("\n        Not Found (404) / Under Construction\n      ")])],1)],1)],1)},i=[],r={},o=r,s=a("2877"),l=a("6544"),u=a.n(l),c=a("a523"),f=a("0e8f"),v=a("a722"),d=Object(s["a"])(o,n,i,!1,null,null,null);e["default"]=d.exports;u()(d,{VContainer:c["a"],VFlex:f["a"],VLayout:v["a"]})},ffe0:function(t,e,a){var n={"./layout/footer.vue":"0588","./main-nav-menu/About.vue":"445b","./main-nav-menu/AboutMenuItems.vue":"13a2","./main-nav-menu/BlobMenuItems.vue":"5d72","./main-nav-menu/Blog.vue":"e356","./main-nav-menu/Contact.vue":"5bda","./main-nav-menu/ContactMenuItems.vue":"124a","./main-nav-menu/Legal.vue":"aeff","./main-nav-menu/NavigationDrawer.vue":"b374","./main-nav-menu/TopNavBar.vue":"4292","./pages/HelloWorld.vue":"8836","./pages/Home.vue":"402e","./pages/Legal.vue":"0d1a","./pages/NotFound.vue":"f79b","./pages/about/resume.vue":"b8f7","./pages/blog/posts.vue":"933e"};function i(t){var e=r(t);return a(e)}function r(t){var e=n[t];if(!(e+1)){var a=new Error("Cannot find module '"+t+"'");throw a.code="MODULE_NOT_FOUND",a}return e}i.keys=function(){return Object.keys(n)},i.resolve=r,t.exports=i,i.id="ffe0"}});
//# sourceMappingURL=app.db6eae23.js.map