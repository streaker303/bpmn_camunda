webpackJsonp([3],{QT8e:function(t,e,n){"use strict";e.a=function(t,e){var n=null;return function(){var i=this,s=arguments;n&&clearTimeout(n),n=setTimeout(function(){t.apply(i,s)},e)}}},YX2J:function(t,e,n){"use strict";var i=n("d29D"),s={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",[e("script",{ref:"script",attrs:{name:this.name,type:"text/plain"}})])},staticRenderFns:[]},a=n("C7Lr")(i.a,s,!1,null,null,null);e.a=a.exports},"a+5H":function(t,e,n){"use strict";e.a=function(){this.listeners={},this.on=function(t,e){void 0===this.listeners[t]&&(this.listeners[t]=[]),this.listeners[t].push(e)},this.emit=function(t){this.listeners[t]&&this.listeners[t].forEach(function(t){return t()})}}},d29D:function(t,e,n){"use strict";(function(t){var i=n("a+5H"),s=n("QT8e");e.a={name:"VueUeditorWrap",data:function(){return{status:0,initValue:""}},props:{mode:{type:String,default:"observer",validator:function(t){return-1!==["observer","listener"].indexOf(t)}},value:{type:String,default:""},config:{type:Object,default:function(){return{}}},init:{type:Function,default:function(){return function(){}}},destroy:{type:Boolean,default:!1},name:{type:String,default:""},observerDebounceTime:{type:Number,default:50,validator:function(t){return t>=20}},observerOptions:{type:Object,default:function(){return{attributes:!0,attributeFilter:["src","style","type","name"],characterData:!0,childList:!0,subtree:!0}}},forceInit:{type:Boolean,default:!1},editorId:{type:String}},computed:{mixedConfig:function(){return Object.assign({},this.config)}},methods:{registerButton:function(t){var e=t.name,n=t.icon,i=t.tip,s=t.handler,a=t.index,r=t.UE,o=void 0===r?window.UE:r;o.registerUI(e,function(t,e){t.registerCommand(e,{execCommand:function(){s(t,e)}});var a=new o.ui.Button({name:e,title:i,cssRules:"background-image: url(".concat(n,") !important;background-size: cover;"),onclick:function(){t.execCommand(e)}});return t.addListener("selectionchange",function(){var n=t.queryCommandState(e);-1===n?(a.setDisabled(!0),a.setChecked(!1)):(a.setDisabled(!1),a.setChecked(n))}),a},a,this.id)},_initEditor:function(){var t=this;this.$refs.script.id=this.id=this.editorId||"editor_"+Math.random().toString(16).slice(-6),this.init(),this.$emit("before-init",this.id,this.mixedConfig),this.$emit("beforeInit",this.id,this.mixedConfig),this.editor=window.UE.getEditor(this.id,this.mixedConfig),this.editor.addListener("ready",function(){window.UE.dom.domUtils.setStyles(t.editor.body,{color:"#fff","font-family":"'Microsoft Yahei','Helvetica Neue', Helvetica, STHeiTi, Arial, sans-serif","font-size":"14px"}),2===t.status?t.editor.setContent(t.value):(t.status=2,t.$emit("ready",t.editor),t.initValue&&t.editor.setContent(t.initValue)),"observer"===t.mode&&window.MutationObserver?t._observerChangeListener():t._normalChangeListener()})},_checkDependencies:function(){var t=this;return new Promise(function(e,n){!!window.UE&&!!window.UEDITOR_CONFIG&&0!==Object.keys(window.UEDITOR_CONFIG).length&&!!window.UE.getEditor?e():window.$loadEnv?window.$loadEnv.on("scriptsLoaded",function(){e()}):(window.$loadEnv=new i.a,t._loadConfig().then(function(){return t._loadCore()}).then(function(){e(),window.$loadEnv.emit("scriptsLoaded")}))})},_loadConfig:function(){var t=this;return new Promise(function(e,n){if(window.UE&&window.UEDITOR_CONFIG&&0!==Object.keys(window.UEDITOR_CONFIG).length)e();else{var i=document.createElement("script");i.type="text/javascript",i.src=t.mixedConfig.UEDITOR_HOME_URL+"ueditor.config.js",document.getElementsByTagName("head")[0].appendChild(i),i.onload=function(){window.UE&&window.UEDITOR_CONFIG&&0!==Object.keys(window.UEDITOR_CONFIG).length&&e()}}})},_loadCore:function(){var t=this;return new Promise(function(e,n){if(window.UE&&window.UE.getEditor)e();else{var i=document.createElement("script");i.type="text/javascript",i.src=t.mixedConfig.UEDITOR_HOME_URL+"ueditor.all.min.js",document.getElementsByTagName("head")[0].appendChild(i),i.onload=function(){window.UE&&window.UE.getEditor&&e()}}})},_setContent:function(t){t===this.editor.getContent()||this.editor.setContent(t)},contentChangeHandler:function(){this.$emit("input",this.editor.getContent())},_normalChangeListener:function(){this.editor.addListener("contentChange",this.contentChangeHandler)},_observerChangeListener:function(){var t=this;this.observer=new MutationObserver(Object(s.a)(function(e){t.editor.document.getElementById("baidu_pastebin")||t.$emit("input",t.editor.getContent())},this.observerDebounceTime)),this.observer.observe(this.editor.body,this.observerOptions)}},deactivated:function(){this.editor&&this.editor.removeListener("contentChange",this.contentChangeHandler),this.observer&&this.observer.disconnect()},beforeDestroy:function(){this.destroy&&this.editor&&this.editor.destroy&&this.editor.destroy(),this.observer&&this.observer.disconnect&&this.observer.disconnect()},watch:{value:{handler:function(e){var n=this;switch(null===e&&(e=""),this.status){case 0:this.status=1,this.initValue=e,(this.forceInit||void 0!==t&&t.client||"undefined"!=typeof window)&&this._checkDependencies().then(function(){n.$refs.script?n._initEditor():n.$nextTick(function(){return n._initEditor()})});break;case 1:this.initValue=e;break;case 2:this._setContent(e)}},immediate:!0}}}}).call(e,n("V0EG"))},mfen:function(t,e){},rMDZ:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n("YX2J"),s=n("fex3"),a=n("xqRH"),r=n("XxfO"),o=n("JA8L");function l(t,e,n,i,s,a,r){try{var o=t[a](r),l=o.value}catch(t){return void n(t)}o.done?e(l):Promise.resolve(l).then(i,s)}function c(t){return function(){var e=this,n=arguments;return new Promise(function(i,s){var a=t.apply(e,n);function r(t){l(a,i,s,r,o,"next",t)}function o(t){l(a,i,s,r,o,"throw",t)}r(void 0)})}}var d={name:"work_base",components:{VueUeditorWrap:i.a,insertFields:s.a,dropdownBox:a.a},data:function(){return{myConfig:{toolbars:[["fullscreen","source","|","undo","redo","|","bold","italic","underline","strikethrough","removeformat","formatmatch","blockquote","|","forecolor","backcolor","insertorderedlist","insertunorderedlist","|","customstyle","paragraph","fontfamily","fontsize","|","justifyleft","justifycenter","justifyright","justifyjustify","|","link","|","simpleupload","attachment","snapscreen","|","inserttable","deletetable","insertparagraphbeforetable","insertrow","deleterow","insertcol","deletecol","mergecells","mergeright","mergedown","splittocells","splittorows","splittocols","|","searchreplace"]],autoHeightEnabled:!1,autoFloatEnabled:!1,initialFrameHeight:450,zIndex:100,initialFrameWidth:"100%",BaseUrl:"",UEDITOR_HOME_URL:"static/ueditor/"},count:0,loading:!1,formLabelWidth:"120px",tableData:[],activeStep:0,conditionList:[],alarmList:[],leakList:[],endWarnList:[],record_endWarnList:[],formData:{name:"",userIds:[],sendId:"",startConditionObj:[{and:[{field:"",condition:"",val:""}]}],id:"",status:"",endEventObj:{users:[],title:"",mes:"",type:[]},des:"",xml:"",xmlName:""},mesFlag:!1,personFlag:!1,finishWarnDialog:!1,warnForm:{type:[],users:"",title:"",mes:""},allUserList:[],allDepList:[],allRolesList:[],sendObjectList:[],dataList:[{name:"资产负责人",type:"3",id:0},{name:"告警创建人",type:"3",id:1}],formDataRules:{name:[{required:!1,message:"请输入模板名称",trigger:"blur"}],sendId:[{required:!1,message:"请选择发起对象",trigger:["change","blur"]}],userIds:[{required:!1,message:"请选择发起人范围",trigger:["change","blur"]}]},warnRules:{type:[{required:!0,message:"请选择提醒方式",trigger:"change"}]}}},mounted:function(){var t=this;return c(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t.$removesessionStorage("processId"),e.next=3,t.init();case 3:t.$nextTick(function(){if(t.$route.query.record&&(t.formData=t.$getsessionStorage("baseForm")),t.$getsessionStorage("copyTemplate")){var e=t.$getsessionStorage("copyTemplate");t.formData.name=e.name,t.formData.xml=e.xml,t.formData.xmlName=e.xmlName,t.formData.sendId=e.sendId,t.formData.endEventObj=e.endEventObj,t.formData.startConditionObj=e.startConditionObj,t.formData.id=e.id,t.formData.userIds=e.userIds.map(function(t){return t.userId}),t.formData.des=e.des,t.warnForm.type=e.endEventObj.type?e.endEventObj.type.map(function(t){return t+""}):[],t.copyEditShow(e.endEventObj.users)}else if(t.$getsessionStorage("editTemplate")){var n=t.$getsessionStorage("editTemplate");t.formData.name=n.name,t.formData.xml=n.xml,t.formData.xmlName=n.xmlName,t.formData.sendId=n.sendId,t.formData.endEventObj=n.endEventObj,t.formData.startConditionObj=n.startConditionObj,t.formData.id=n.id,t.formData.userIds=n.userIds.map(function(t){return t.userId}),t.formData.des=n.des,t.warnForm.type=n.endEventObj.type?n.endEventObj.type.map(function(t){return t+""}):[],t.copyEditShow(n.endEventObj.users)}t.copyEditShow(t.formData.endEventObj.users),t.$removesessionStorage("alarmList")});case 4:case"end":return e.stop()}},e)}))()},beforeDestroy:function(){this.$removesessionStorage("copyTemplate"),this.$removesessionStorage("editTemplate")},computed:{show_warn_type:function(){var t="";return this.formData.endEventObj.type.length&&this.formData.endEventObj.type.forEach(function(e){0==e?t+="站内消息、":1==e?t+="邮件、":2==e?t+="短信、":3==e&&(t+="蓝鲸快信、")}),"、"===t[t.length-1]&&(t=t.slice(0,t.length-1)),t},show_warn_user:function(){var t="";return this.endWarnList.length&&this.endWarnList.forEach(function(e){"流程相关"!==e&&(e=JSON.parse(e)),0==e.type?t+=e.chineseName+"、":1==e.type?t+=e.name+"、":2==e.type?t+=e.roleName+"、":3==e.type?t+=e.name+"、":"流程相关"==e&&(t+=e+"、")}),"、"===t[t.length-1]&&(t=t.slice(0,t.length-1)),t},show_warn_mes:function(){return this.formData.endEventObj.mes}},methods:{closeDrop:function(){this.$refs.field&&(this.$refs.field.showFidles=!1),this.$refs.personRange&&(this.$refs.personRange.showMore=!1)},init:function(){var t=this;return c(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.get_dep();case 2:return e.next=4,t.get_roles();case 4:return e.next=6,t.get_users();case 6:return e.next=8,t.get_sendObject();case 8:return e.next=10,t.get_alarmList();case 10:return e.next=12,t.get_conditionList();case 12:case"end":return e.stop()}},e)}))()},get_users:function(){var t=this;return c(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(r.h)({}).then(function(e){e.forEach(function(t){t.type="0"}),t.allUserList=e,t.$setsessionStorage("allUserList",e)}).catch(function(t){});case 2:case"end":return e.stop()}},e)}))()},get_roles:function(){var t=this;return c(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(r.g)({}).then(function(e){e.forEach(function(t){t.type="2"}),t.allRolesList=e,t.$setsessionStorage("allRolesList",e)}).catch(function(t){});case 2:case"end":return e.stop()}},e)}))()},get_dep:function(){var t=this;return c(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(r.f)({}).then(function(e){e.forEach(function(t){t.type="1"}),t.allDepList=e,t.$setsessionStorage("allDepList",e)}).catch(function(t){});case 2:case"end":return e.stop()}},e)}))()},get_sendObject:function(){var t=this;return c(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:Object(r.i)({}).then(function(e){t.sendObjectList=e,t.$setsessionStorage("sendObjectList",e)}).catch(function(t){});case 1:case"end":return e.stop()}},e)}))()},get_alarmList:function(){var t=this;return c(regeneratorRuntime.mark(function e(){var n;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n={paramsData:{},queryData:{}},e.next=3,Object(o.e)(n).then(function(e){t.alarmList=e}).catch(function(t){});case 3:case"end":return e.stop()}},e)}))()},get_conditionList:function(){var t=this;return c(regeneratorRuntime.mark(function e(){var n;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n={paramsData:{},queryData:{}},e.next=3,Object(o.b)(n).then(function(e){t.conditionList=e}).catch(function(t){});case 3:case"end":return e.stop()}},e)}))()},get_leakList:function(){var t=this;return c(regeneratorRuntime.mark(function e(){var n;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n={paramsData:{},queryData:{}},e.next=3,Object(o.c)(n).then(function(e){t.leakList=e}).catch(function(t){});case 3:case"end":return e.stop()}},e)}))()},handleFinishWarn:function(){var t=this,e=this.$refs.field.$refs.editHead.innerHTML,n=this.$refs.field.$refs.editBody.innerHTML;""!==e.trim()&&""!==n.trim()?0!=this.formData.endEventObj.users.length?this.$refs.warnForm.validate(function(i){if(!i)return!1;t.mesFlag=t.personFlag=!1,t.formData.endEventObj.title=e,t.formData.endEventObj.mes=n,t.formData.endEventObj.type=t.$deepCopy(t.warnForm.type),t.finishWarnDialog=!1}):this.personFlag=!0:this.mesFlag=!0},openFinishDialog:function(){this.finishWarnDialog=!0,this.$refs.warnForm&&this.$refs.warnForm.resetFields(),this.warnForm.type=this.$deepCopy(this.formData.endEventObj.type),this.warnForm.mes=this.formData.endEventObj.mes,this.warnForm.title=this.formData.endEventObj.title,this.record_endWarnList=this.$deepCopy(this.endWarnList)},cancelFinish:function(){this.finishWarnDialog=!1,this.endWarnList=this.$deepCopy(this.record_endWarnList)},deleteEndWarn:function(){this.formData.endEventObj.mes="",this.formData.endEventObj.title="",this.formData.endEventObj.type=[],this.formData.endEventObj.users=[],this.endWarnList=[]},confirmData:function(t){this.endWarnList=this.$deepCopy(t),t=t.length?t:[];var e,n=[],i=[],s=[],a=[];this.formData.endEventObj.users=[],t.forEach(function(t){"流程相关"!==t&&(t=JSON.parse(t)),"0"===t.type?n.push(t.id):"1"===t.type?i.push(t.id):"2"===t.type?s.push(t.id):"3"===t.type?a.push(t.id):"流程相关"===t&&(e=!0)}),n.length&&this.formData.endEventObj.users.push({userType:"0",ids:n}),i.length&&this.formData.endEventObj.users.push({userType:"1",ids:i}),s.length&&this.formData.endEventObj.users.push({userType:"2",ids:s}),a.length&&this.formData.endEventObj.users.push({userType:"3",ids:a}),e&&this.formData.endEventObj.users.push({userType:"4"})},copyEditShow:function(t){var e=this;if(t.length){this.endWarnList=[];var n=[];t.forEach(function(t){if(0==t.userType)t.ids.forEach(function(t){var i=e.allUserList.find(function(e){return e.id==t});i&&n.push(JSON.stringify(i))});else if(1==t.userType)t.ids.forEach(function(t){var i=e.allDepList.find(function(e){return e.id==t});i&&n.push(JSON.stringify(i))});else if(2==t.userType)t.ids.forEach(function(t){var i=e.allRolesList.find(function(e){return e.id==t});i&&n.push(JSON.stringify(i))});else if(3==t.userType)t.ids.forEach(function(t){var i=e.dataList.find(function(e){return e.id==t});i&&n.push(JSON.stringify(i))});else if(4==t.userType){n.push(JSON.stringify({userType:"4"}))}}),this.endWarnList=this.$deepCopy(n)}},cancel:function(){this.$router.push("/home/work_template")},next:function(){var t=this;this.$refs.formData.validate(function(e){if(!e)return!1;t.formData.des=t.formData.des.replace(/&nbsp;/g," ");var n=t.$deepCopy(t.formData);1==t.formData.sendId?t.$setsessionStorage("alarmList",t.alarmList):2==t.formData.sendId?t.$setsessionStorage("alarmList",t.leakList):t.$removesessionStorage("alarmList"),t.$setsessionStorage("baseForm",n),setTimeout(function(){t.$router.push("/home/work_template/work_config")},500)})},addConditionChild:function(t){t.push({field:"",condition:"",val:""})},deleteConditionChild:function(t,e){t.splice(t.indexOf(e),1)},addCondition:function(){this.formData.startConditionObj.push({and:[{field:"",condition:"",val:""}]})},deleteCondition:function(t){this.formData.startConditionObj.splice(this.formData.startConditionObj.indexOf(t),1)}}},u={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"event event-wrapper add_template"},[n("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticClass:"event-content w100"},[n("div",{staticClass:"ub w100 relative"},[n("div",{staticClass:"list-tips"},[t._v("新建模板")]),t._v(" "),n("div",{staticClass:"ub",staticStyle:{"margin-left":"20px"}},[n("el-steps",{attrs:{space:100,active:t.activeStep}},[n("el-step",[n("i",{staticClass:"step1 step1Active",attrs:{slot:"icon"},slot:"icon"},[t._v("工单基本信息")])]),t._v(" "),n("el-step",[n("i",{staticClass:"step2 step2Ready",attrs:{slot:"icon"},slot:"icon"},[t._v("配置流程信息")])])],1)],1),t._v(" "),n("div",{staticClass:"btn-wrap",staticStyle:{"margin-left":"auto"}},[n("cancle-btn",{attrs:{title:"取 消"},on:{click:t.cancel}}),t._v(" "),n("search-btn",{attrs:{title:"下一步"},on:{click:t.next}})],1)]),t._v(" "),n("div",{staticClass:"w100 form-wrapper",staticStyle:{color:"#fff"}},[t._m(0),t._v(" "),n("el-form",{ref:"formData",attrs:{model:t.formData,rules:t.formDataRules,"label-width":"100px"}},[n("div",{staticClass:"ub",staticStyle:{width:"100%"}},[n("el-form-item",{staticStyle:{width:"45%"},attrs:{label:"模板名称：",prop:"name",size:"small"}},[n("el-input",{attrs:{clearable:"",size:"small",placeholder:"请输入模板名称"},model:{value:t.formData.name,callback:function(e){t.$set(t.formData,"name","string"==typeof e?e.trim():e)},expression:"formData.name"}})],1),t._v(" "),n("el-form-item",{staticStyle:{width:"45%","margin-left":"10%"},attrs:{label:"发起对象：",prop:"sendId",size:"small"}},[n("el-select",{staticStyle:{width:"100%"},attrs:{filterable:"",clearable:"",size:"small",placeholder:"请选择"},model:{value:t.formData.sendId,callback:function(e){t.$set(t.formData,"sendId",e)},expression:"formData.sendId"}},t._l(t.sendObjectList,function(t,e){return n("el-option",{key:e,attrs:{label:t.name,value:t.id}})}),1)],1)],1),t._v(" "),n("div",{staticClass:"ub",staticStyle:{width:"100%"}},[n("el-form-item",{staticStyle:{width:"45%"},attrs:{label:"发起人范围：",prop:"userIds",size:"small"}},[n("el-select",{staticStyle:{width:"100%"},attrs:{size:"small",multiple:"","collapse-tags":"",placeholder:"请选择"},model:{value:t.formData.userIds,callback:function(e){t.$set(t.formData,"userIds",e)},expression:"formData.userIds"}},t._l(t.allUserList,function(t,e){return n("el-option",{key:e,attrs:{label:t.chineseName,value:t.id}})}),1)],1)],1),t._v(" "),n("div",{staticClass:"ub",staticStyle:{width:"100%"}},[n("el-form-item",{staticStyle:{width:"85%"},attrs:{label:"工单描述：",prop:"des",size:"small"}},[n("vue-ueditor-wrap",{attrs:{config:t.myConfig},model:{value:t.formData.des,callback:function(e){t.$set(t.formData,"des",e)},expression:"formData.des"}})],1)],1)]),t._v(" "),1==this.formData.sendId||2==this.formData.sendId?n("div",{staticClass:"title w100"},[n("span",{staticClass:"t1"},[t._v("触发条件")])]):t._e(),t._v(" "),1==this.formData.sendId||2==this.formData.sendId?n("div",{staticStyle:{"min-height":"100px"}},[n("div",{staticStyle:{padding:"10px 0 0 20px"}},t._l(t.formData.startConditionObj,function(e,i){return n("div",{key:i,staticClass:"single-condition ub ub-ac"},[0!=i?n("el-divider",[t._v("OR")]):t._e(),t._v(" "),n("div",{staticClass:"left-condition"},[t._v("AND")]),t._v(" "),n("div",{staticClass:"ub ub-ver"},[t._l(e.and,function(i,s){return n("div",{key:s,staticClass:"part-condition"},[n("el-select",{attrs:{filterable:"",clearable:"",size:"small",placeholder:"请选择"},model:{value:i.field,callback:function(e){t.$set(i,"field",e)},expression:"_item.field"}},t._l(1==t.formData.sendId?t.alarmList:t.leakList,function(t,e){return n("el-option",{key:e,attrs:{label:t.label,value:t.value}})}),1),t._v(" "),n("el-select",{staticStyle:{margin:"0 8px"},attrs:{filterable:"",clearable:"",size:"small",placeholder:"请选择"},model:{value:i.condition,callback:function(e){t.$set(i,"condition",e)},expression:"_item.condition"}},t._l(t.conditionList,function(t,e){return n("el-option",{key:e,attrs:{label:t.name,value:t.value}})}),1),t._v(" "),n("el-input",{staticStyle:{width:"200px"},attrs:{clearable:"",size:"small",placeholder:"请输入"},model:{value:i.val,callback:function(e){t.$set(i,"val",e)},expression:"_item.val"}}),t._v(" "),n("i",{staticClass:"el-icon-plus",staticStyle:{cursor:"pointer","font-size":"12px",color:"#1cd7fa","margin-left":"5px"},on:{click:function(n){return n.stopPropagation(),t.addConditionChild(e.and)}}}),t._v(" "),0!=s?n("i",{staticClass:"el-icon-close",staticStyle:{cursor:"pointer","font-size":"12px",color:"#1cd7fa"},on:{click:function(n){return n.stopPropagation(),t.deleteConditionChild(e.and,i)}}}):t._e()],1)}),t._v(" "),0!=i?n("p",{staticClass:"del-btn"},[n("i",{staticClass:"el-icon-close",on:{click:function(n){return t.deleteCondition(e)}}},[t._v(" 删除组")])]):t._e()],2)],1)}),0),t._v(" "),n("p",{staticClass:"operate-color"},[n("i",{staticClass:"el-icon-plus",on:{click:t.addCondition}},[t._v(" 添加触发条件")])])]):t._e(),t._v(" "),t._m(1),t._v(" "),n("div",{staticStyle:{"min-height":"100px","padding-top":"10px"}},[0===this.formData.endEventObj.type.length?n("p",{staticClass:"operate-color",on:{click:t.openFinishDialog}},[n("i",{staticClass:"el-icon-plus"}),t._v("添加结束动作")]):n("div",{staticClass:"warn-wrapper"},[n("div",{staticClass:"ub ub-pj ub-ac"},[n("p",{staticStyle:{"font-size":"12px",color:"#00ffff"}},[t._v("提醒")]),t._v(" "),n("p",[n("i",{staticClass:"iconfont icon-xiugai",staticStyle:{"font-size":"12px",color:"#00ffff",cursor:"pointer"},on:{click:t.openFinishDialog}}),t._v(" "),n("i",{staticClass:"el-icon-close",staticStyle:{"font-size":"12px",color:"#00ffff",cursor:"pointer"},on:{click:t.deleteEndWarn}})])]),t._v(" "),n("div",[n("p",{staticClass:"warn-top"},[t._v("提醒方式：")]),t._v(" "),n("p",{staticClass:"warn-body"},[t._v(t._s(t.show_warn_type))]),t._v(" "),n("p",{staticClass:"warn-top"},[t._v("提醒人员范围：")]),t._v(" "),n("p",{staticClass:"warn-body"},[t._v(t._s(t.show_warn_user))]),t._v(" "),n("p",{staticClass:"warn-top"},[t._v("提醒内容：")]),t._v(" "),n("p",{staticClass:"warn-body",domProps:{innerHTML:t._s(t.show_warn_mes)}})])])])],1)]),t._v(" "),n("el-dialog",{attrs:{title:"提醒",visible:t.finishWarnDialog,width:"700px","custom-class":"attendance-dialog"},on:{"update:visible":function(e){t.finishWarnDialog=e}},nativeOn:{click:function(e){return t.closeDrop.apply(null,arguments)}}},[n("el-form",{ref:"warnForm",staticClass:"unit",attrs:{model:t.warnForm,rules:t.warnRules}},[n("el-form-item",{attrs:{label:"提醒方式：",prop:"type","label-width":"90px"}},[n("el-select",{staticStyle:{width:"568px"},attrs:{filterable:"",clearable:"",multiple:"",size:"small",placeholder:"请选择"},model:{value:t.warnForm.type,callback:function(e){t.$set(t.warnForm,"type",e)},expression:"warnForm.type"}},[n("el-option",{attrs:{label:"站内消息",value:"0"}}),t._v(" "),n("el-option",{attrs:{label:"邮件",value:"1"}}),t._v(" "),n("el-option",{attrs:{label:"短信",value:"2"}})],1)],1),t._v(" "),n("el-form-item",{staticClass:"red-star",attrs:{label:"人员范围：",prop:"users","label-width":"90px"}},[t.finishWarnDialog?n("dropdown-box",{ref:"personRange",attrs:{usersList:t.allUserList,depList:t.allDepList,rolesList:t.allRolesList,usersShow:t.endWarnList,dataList:t.dataList},on:{confirmData:t.confirmData}}):t._e(),t._v(" "),t.personFlag?n("span",{staticClass:"red-warn warn-person"},[t._v("请选择人员")]):t._e()],1),t._v(" "),n("el-form-item",{staticClass:"red-star",attrs:{label:"提醒内容：",prop:"content","label-width":"90px"}},[t.finishWarnDialog?n("insert-fields",{ref:"field",attrs:{title:t.formData.endEventObj.title,mes:t.formData.endEventObj.mes,sendId:t.formData.sendId}}):t._e(),t._v(" "),t.mesFlag?n("span",{staticClass:"red-warn warn-content"},[t._v("请填写提醒内容")]):t._e()],1)],1),t._v(" "),n("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[n("searchBtn",{attrs:{title:"确 定"},on:{click:t.handleFinishWarn}}),t._v(" "),n("cancleBtn",{attrs:{title:"取 消"},on:{click:t.cancelFinish}})],1)],1)],1)},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"title w100"},[e("span",{staticClass:"t1"},[this._v("基本信息")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"title w100"},[e("span",{staticClass:"t1"},[this._v("结束后动作")])])}]};var f=n("C7Lr")(d,u,!1,function(t){n("zkBO"),n("mfen")},"data-v-160dbf1b",null);e.default=f.exports},zkBO:function(t,e){}});