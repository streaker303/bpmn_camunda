<template>
	<div class="event event-wrapper add_template">
		<div class="event-content w100" v-loading="loading">
			<div class="ub w100 relative">
				<div class="list-tips">新建模板</div>
				<div class="ub" style="margin-left: 20px">
					<el-steps :space="100" :active="activeStep">
					  <el-step><i class="step1 step1Active" slot="icon">工单基本信息</i></el-step>
					  <el-step><i class="step2 step2Ready" slot="icon">配置流程信息</i></el-step>
					</el-steps>
				</div>
				<div class="btn-wrap" style="margin-left: auto;">
					<cancle-btn title="取 消" @click="cancel"></cancle-btn>
					<search-btn title="下一步" @click="next"></search-btn>
				</div>
			</div>
			<div class="w100 form-wrapper" style="color: #fff;">
				<div class="title w100">
					<span class="t1">基本信息</span>
				</div>
				<el-form  ref="formData" :model="formData" :rules="formDataRules" label-width="100px">
					<div class="ub" style="width:100%;">
						<el-form-item label="模板名称：" style="width: 45%" prop="name" size="small">
							<el-input clearable v-model.trim="formData.name" size="small" placeholder="请输入模板名称"></el-input>
						</el-form-item>
						<el-form-item label="发起对象：" style="width: 45%; margin-left:10%" prop="sendId" size="small">
							 <el-select filterable clearable v-model="formData.sendId" size="small" style="width: 100%" placeholder="请选择">
								<el-option v-for="(item, index) in sendObjectList" :key="index" :label="item.name" :value="item.id"></el-option>
							</el-select>
						</el-form-item>
					</div>
                    <div class="ub" style="width:100%;">
                        <el-form-item label="发起人范围：" style="width: 45%;" prop="userIds" size="small">
                            <el-select  v-model="formData.userIds" size="small" multiple collapse-tags style="width: 100%" placeholder="请选择">
                                <el-option v-for="(item, index) in allUserList" :key="index" :label="item.chineseName" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="ub" style="width:100%;">
                        <el-form-item label="工单描述：" style="width: 85%;" prop="des" size="small">
                            <vue-ueditor-wrap v-model="formData.des" :config="myConfig"></vue-ueditor-wrap>
                        </el-form-item>
                    </div>
				</el-form>
				<div class="title w100" v-if="this.formData.sendId == 1 || this.formData.sendId == 2">
					<span class="t1">触发条件</span>
				</div>
                <div style="min-height: 100px" v-if="this.formData.sendId == 1 || this.formData.sendId == 2">
                    <div style="padding: 10px 0 0 20px">
                        <div class="single-condition ub ub-ac" v-for="(item, index) in formData.startConditionObj" :key="index">
                            <el-divider v-if="index != 0">OR</el-divider>
                            <div class="left-condition">AND</div>
                            <div class="ub ub-ver">
                                <div class="part-condition" v-for="(_item, _index) in item.and" :key="_index">
                                    <el-select filterable clearable v-model="_item.field" size="small" style="" placeholder="请选择">
                                        <el-option v-for="(item, index) in formData.sendId == 1 ? alarmList : leakList" :key="index" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                    <el-select filterable clearable v-model="_item.condition" size="small" style="margin: 0 8px" placeholder="请选择">
                                        <el-option v-for="(item, index) in conditionList" :key="index" :label="item.name" :value="item.value"></el-option>
                                    </el-select>
                                    <el-input v-model="_item.val" clearable size="small" style="width: 200px" placeholder="请输入"></el-input>
                                    <i @click.stop="addConditionChild(item.and)"
                                       class="el-icon-plus"
                                       style="cursor: pointer;font-size:12px;color:#1cd7fa;margin-left: 5px"></i>
                                    <i @click.stop="deleteConditionChild(item.and,_item)"
                                       v-if="_index != 0"
                                       class="el-icon-close"
                                       style="cursor: pointer;font-size:12px;color:#1cd7fa"></i>
                                </div>
                                <p class="del-btn" v-if="index != 0">
                                    <i class="el-icon-close" @click="deleteCondition(item)"> 删除组</i>
                                </p>
                            </div>
                        </div>
                    </div>
                    <p class="operate-color">
                        <i class="el-icon-plus" @click="addCondition"> 添加触发条件</i>
                    </p>
                </div>
                <div class="title w100">
                    <span class="t1">结束后动作</span>
                </div>
                <div style="min-height: 100px;padding-top: 10px">
                    <p v-if="this.formData.endEventObj.type.length === 0" class="operate-color" @click="openFinishDialog"><i class="el-icon-plus"></i>添加结束动作</p>
                    <div v-else class="warn-wrapper">
                        <div class="ub ub-pj ub-ac">
                            <p style="font-size: 12px;color: #00ffff">提醒</p>
                            <p>
                                <i class="iconfont icon-xiugai" style="font-size: 12px;color: #00ffff;cursor: pointer" @click="openFinishDialog"></i>
                                <i class="el-icon-close" style="font-size: 12px;color: #00ffff;cursor: pointer" @click="deleteEndWarn"></i>
                            </p>
                        </div>
                        <div>
                            <p class="warn-top">提醒方式：</p>
                            <p class="warn-body">{{show_warn_type}}</p>
                            <p class="warn-top">提醒人员范围：</p>
                            <p class="warn-body">{{show_warn_user}}</p>
                            <p class="warn-top">提醒内容：</p>
                            <p class="warn-body" v-html="show_warn_mes"></p>
                        </div>
                    </div>
                </div>
			</div>
		</div>
        <el-dialog title="提醒" :visible.sync="finishWarnDialog" width="700px" custom-class="attendance-dialog" @click.native="closeDrop">
            <el-form :model="warnForm" :rules="warnRules" ref="warnForm" class="unit">
                <el-form-item label="提醒方式：" prop="type" label-width="90px">
                    <el-select filterable clearable v-model="warnForm.type" multiple size="small" style="width: 568px;" placeholder="请选择">
                        <el-option label="站内消息" value="0"></el-option>
                        <el-option label="邮件" value="1"></el-option>
                        <el-option label="短信" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="人员范围：" prop="users" label-width="90px" class="red-star">
                    <dropdown-box v-if="finishWarnDialog"
                                  :usersList="allUserList"
                                  :depList="allDepList"
                                  :rolesList="allRolesList"
                                  :usersShow="endWarnList"
                                  :dataList="dataList"
                                  ref="personRange"
                                  @confirmData="confirmData"
                    ></dropdown-box>
                    <span v-if="personFlag" class="red-warn warn-person">请选择人员</span>
                </el-form-item>
                <el-form-item label="提醒内容：" prop="content" label-width="90px" class="red-star">
                    <insert-fields v-if="finishWarnDialog" ref="field" :title="formData.endEventObj.title" :mes="formData.endEventObj.mes" :sendId="formData.sendId"></insert-fields>
                    <span v-if="mesFlag" class="red-warn warn-content">请填写提醒内容</span>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
				<searchBtn title="确 定" @click="handleFinishWarn" />
				<cancleBtn title="取 消" @click="cancelFinish" />
			</span>
        </el-dialog>
	</div>
</template>

<script>
import VueUeditorWrap from '../../components/vue-ueditor-wrap.vue' // ES6 Module
import insertFields from './workComponents/insertFields'
import dropdownBox from "./workComponents/dropdownBox";

import {
    getAllUsers,
    getAllDep,
    getAllRoles,
    getSendObject,
} from '../../server/define.js'

import {
    get_selested_all_fileds,
    get_condition,
    get_leak_fileds
} from '../../server/api.js'
	export default {
		name: 'work_base',
        components: {
            VueUeditorWrap,
            insertFields,
            dropdownBox
        },
		data() {
			return {
                myConfig: {
                    toolbars: [
                        ['fullscreen', 'source', '|', 'undo', 'redo', '|',
                            'bold', 'italic', 'underline', 'strikethrough', 'removeformat',
                            'formatmatch', 'blockquote', '|', 'forecolor', 'backcolor', 'insertorderedlist',
                            'insertunorderedlist', '|',
                            'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
                            'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
                            'link', '|',
                            'simpleupload', 'attachment', 'snapscreen', '|',
                            'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol',
                            'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', '|',
                            'searchreplace'
                        ]
                    ],
                    //禁用编辑器
                    //readonly: true,
                    // 编辑器不自动被内容撑高
                    autoHeightEnabled: false,
                    autoFloatEnabled: false,
                    //是否工具栏可浮动
                    // 初始容器高度
                    initialFrameHeight: 450,
                    zIndex: 100,
                    // 初始容器宽度
                    initialFrameWidth: '100%',
                    // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
                    BaseUrl: '',
                    //serverUrl: 'http://35.201.165.105:8000/controller.php',
                    // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
                    UEDITOR_HOME_URL: 'static/ueditor/'
                },
                count: 0,

				loading: false, //右侧整体loading
                formLabelWidth: '120px',
				tableData: [],
				activeStep: 0,
                conditionList: [],
                alarmList: [],
                leakList: [],
                endWarnList: [], // 记录选中的提醒人员item
                record_endWarnList: [], //打开弹框
				formData: {
					name: '',
                    userIds:[],
                    sendId: '',
                    startConditionObj: [
                        {
                            and: [
                                {
                                    field: '',
                                    condition: '',
                                    val: ''
                                }
                            ]
                        }
                    ],
                    id: '',
                    status: '',
                    endEventObj: {
					    users: [
                            // {
                            //     userType: '0',
                            //     ids: []
                            // }
                        ],
                        title: '',
                        mes: '',
                        type: []
                    },
                    des: '',
                    xml: '',
                    xmlName: ''
				},
                mesFlag: false,
                personFlag: false,
                finishWarnDialog: false,
                warnForm: { //消息提醒
                    type: [],
                    users: '',
                    title: '',
                    mes: ''
                },
                allUserList: [], // 所有人
                allDepList: [], // 所有部门
                allRolesList: [], // 所有角色
                sendObjectList: [], // 工单发起对象
                dataList: [
                    {
                        name: '资产负责人',
                        type: '3',
                        id: 0
                    },
                    {
                        name: '告警创建人',
                        type: '3',
                        id: 1
                    }
                ],
				formDataRules:{
					name: [
						{required: false,message: '请输入模板名称',trigger: 'blur'}
					],
					sendId: [
						{required: false,message: '请选择发起对象',trigger: ['change', 'blur']}
					],
					userIds:[
						{required: false,message: '请选择发起人范围',trigger: ['change', 'blur']}
					],
				},
                warnRules:{
                    type: [
                        {required: true,message: '请选择提醒方式',trigger: 'change'}
                    ],
                },
			}
		},
        async mounted() {
			this.$removesessionStorage('processId');
            await this.init();
			this.$nextTick(()=> {
                if (this.$route.query.record) {
                    this.formData = this.$getsessionStorage('baseForm');
                }
                /*复制新建或编辑*/
                if (this.$getsessionStorage('copyTemplate')) {
                    let form = this.$getsessionStorage('copyTemplate');
                    this.formData.name = form.name;
                    this.formData.xml = form.xml;
                    this.formData.xmlName = form.xmlName;
                    this.formData.sendId = form.sendId;
                    this.formData.endEventObj = form.endEventObj;
                    this.formData.startConditionObj = form.startConditionObj;
                    this.formData.id = form.id;
                    this.formData.userIds = form.userIds.map(item => item.userId);
                    this.formData.des = form.des;
                    this.warnForm.type = form.endEventObj.type ? form.endEventObj.type.map(item => item+'') : [];
                    this.copyEditShow(form.endEventObj.users)
                    /*编辑*/
                } else if (this.$getsessionStorage('editTemplate')) {
                    let form = this.$getsessionStorage('editTemplate');
                    this.formData.name = form.name;
                    this.formData.xml = form.xml;
                    this.formData.xmlName = form.xmlName;
                    this.formData.sendId = form.sendId;
                    this.formData.endEventObj = form.endEventObj;
                    this.formData.startConditionObj = form.startConditionObj;
                    this.formData.id = form.id;
                    this.formData.userIds = form.userIds.map(item => item.userId);
                    this.formData.des = form.des;
                    this.warnForm.type = form.endEventObj.type ? form.endEventObj.type.map(item => item+'') : [];
                    this.copyEditShow(form.endEventObj.users)
                }
                console.log(this.formData, '回显')
                this.copyEditShow(this.formData.endEventObj.users)
                this.$removesessionStorage('alarmList')
            })
		},
        beforeDestroy () {
            this.$removesessionStorage('copyTemplate');
            this.$removesessionStorage('editTemplate');
        },
		computed: {
            show_warn_type () {
                let str='';
                if (this.formData.endEventObj.type.length) {
                    this.formData.endEventObj.type.forEach(item => {
                        if (item == 0) {
                            str += '站内消息、';
                        } else if (item == 1) {
                            str+= '邮件、';
                        } else if (item == 2) {
                            str+= '短信、';
                        }else if (item == 3) {
                            str+= '蓝鲸快信、';
                        }
                    })
                }
                (str[str.length-1] === '、') && (str=str.slice(0,str.length-1))
                return str;

            },
            show_warn_user () {
                let str='';
                console.log(this.endWarnList)
                if (this.endWarnList.length) {
                    this.endWarnList.forEach(item => {
                        if (item !== '流程相关') {
                            item = JSON.parse(item)
                        }
                        if (item.type == 0) {
                            str += item.chineseName + '、';
                        } else if (item.type == 1) {
                            str+= item.name + '、';
                        } else if (item.type == 2) {
                            str+= item.roleName + '、';
                        } else if (item.type == 3) {
                            str+= item.name + '、';
                        } else if (item == '流程相关') {
                            str+= item + '、';
                        }
                    })
                }
                (str[str.length-1] === '、') && (str=str.slice(0,str.length-1))
                return str;
            },
            show_warn_mes () {
                return this.formData.endEventObj.mes;

            },
		},
		methods: {
            closeDrop() {
                if(this.$refs.field) {
                    this.$refs.field.showFidles = false;
                }
                if(this.$refs.personRange) {
                    this.$refs.personRange.showMore = false;
                }
            },
            async init() {
		        await this.get_dep();
		        await this.get_roles();
		        await this.get_users();
		        await this.get_sendObject();
		        await this.get_alarmList();
		        await this.get_conditionList();
            },
            async get_users() {
                await getAllUsers({}).then(res => {
                    console.log('所有人员', res)
                    res.forEach(item => {
                        item.type = '0'
                    })
                    this.allUserList = res;
                    this.$setsessionStorage('allUserList', res)
                }).catch(err => {
                    console.log(err, 'err')
                })
            },
            async get_roles() {
                await getAllRoles({}).then(res => {
                    console.log('所有角色', res)
                    res.forEach(item => {
                        item.type = '2'
                    })
                    this.allRolesList = res;
                    this.$setsessionStorage('allRolesList', res)
                }).catch(err => {
                    console.log(err, 'err')
                })
            },
            async get_dep() {
                await getAllDep({}).then(res => {
                    console.log('所有部门', res)
                    res.forEach(item => {
                        item.type = '1'
                    })
                    this.allDepList = res;
                    this.$setsessionStorage('allDepList', res)
                }).catch(err => {
                    console.log(err, 'err')
                })
            },
            async get_sendObject() {
                getSendObject({}).then(res => {
                    console.log('工单发起对象', res)
                    this.sendObjectList = res;
                    this.$setsessionStorage('sendObjectList', res)
                }).catch(err => {
                    console.log(err, 'err')
                })
            },
            async get_alarmList () {
                let data = {
                    paramsData: {},
                    queryData: {}
                }
                await get_selested_all_fileds(data).then(res=> {
                    console.log('告警字段', res);
                    this.alarmList = res;
                }).catch(err=> {
                    console.log(err);
                })
            },
            async get_conditionList () {
                let data = {
                    paramsData: {},
                    queryData: {}
                }
                await get_condition(data).then(res=> {
                    console.log('条件', res);
                    this.conditionList = res;
                }).catch(err=> {
                    console.log(err);
                })
            },
            async get_leakList () {
                let data = {
                    paramsData: {},
                    queryData: {}
                }
                await get_leak_fileds(data).then(res=> {
                    console.log('漏洞字段', res);
                    this.leakList = res;
                }).catch(err=> {
                    console.log(err);
                })
            },
            handleFinishWarn() {
		        let title = this.$refs.field.$refs['editHead'].innerHTML;
		        let mes = this.$refs.field.$refs['editBody'].innerHTML;

                if (title.trim() === '' || mes.trim()==='') {
                    this.mesFlag = true;
                    return ;
                } else if (this.formData.endEventObj.users.length == 0) {
                    this.personFlag = true;
                    return ;
                }

                this.$refs['warnForm'].validate((valid) => {
                    if (valid) {
                        this.mesFlag = this.personFlag = false;
                        this.formData.endEventObj.title = title;
                        this.formData.endEventObj.mes = mes;
                        this.formData.endEventObj.type = this.$deepCopy(this.warnForm.type);
                        this.finishWarnDialog = false;
                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
            },
            openFinishDialog () {
                console.log(this.formData)
                this.finishWarnDialog = true;
                this.$refs['warnForm'] && (this.$refs['warnForm'].resetFields());
                this.warnForm.type = this.$deepCopy(this.formData.endEventObj.type);
                this.warnForm.mes = this.formData.endEventObj.mes;
                this.warnForm.title = this.formData.endEventObj.title;
                this.record_endWarnList = this.$deepCopy(this.endWarnList);

            },
            cancelFinish () {
                this.finishWarnDialog = false;
                this.endWarnList = this.$deepCopy(this.record_endWarnList);
            },
            deleteEndWarn() {
		        this.formData.endEventObj.mes = '';
		        this.formData.endEventObj.title = '';
		        this.formData.endEventObj.type = [];
		        this.formData.endEventObj.users = [];
		        this.endWarnList = [];
            },
            confirmData (val) {
		        this.endWarnList = this.$deepCopy(val);
		        val = val.length ? val : [];
		        let type0 = [];
		        let type1 = [];
		        let type2 = [];
		        let type3 = [],type4;
		        this.formData.endEventObj.users = [];
		        val.forEach(item => {
                    if (item !== '流程相关') {
                        item = JSON.parse(item)
                    }
		            if (item.type === '0') {
		                type0.push(item.id)
                    } else if (item.type === '1') {
                        type1.push(item.id)
                    } else if (item.type === '2') {
                        type2.push(item.id)
                    } else if (item.type === '3') {
                        type3.push(item.id)
                    } else if (item === '流程相关') {
                        type4 = true;
                    }
                })
                type0.length && this.formData.endEventObj.users.push({userType: '0', ids: type0});
                type1.length && this.formData.endEventObj.users.push({userType: '1', ids: type1});
                type2.length && this.formData.endEventObj.users.push({userType: '2', ids: type2});
                type3.length && this.formData.endEventObj.users.push({userType: '3', ids: type3});
                type4 && this.formData.endEventObj.users.push({userType: '4'});
                //console.log(this.formData.endEventObj.users, '提醒人列表')
            },
            /*复制新建、编辑时回显*/
            copyEditShow(users) {
		        if (users.length) {
		            this.endWarnList = [];
		            let arr = [];
                    console.log(users)
		            users.forEach(item => {
                        console.log(item.userType)
		                if (item.userType == 0) {
                            console.log(22222)
		                    /*遍历所有人员*/
                            item.ids.forEach(_item => {
                                console.log(_item, this.allUserList)
                                let obj = this.allUserList.find(it => it.id == _item);
                                obj && (arr.push(JSON.stringify(obj)))
                            })
                        } else if (item.userType == 1) {
                            /*遍历所有部门*/
                            item.ids.forEach(_item => {
                                let obj = this.allDepList.find(it => it.id == _item);
                                obj && (arr.push(JSON.stringify(obj)))
                            })
                        } else if (item.userType == 2) {
                            /*遍历所有角色*/
                            item.ids.forEach(_item => {
                                let obj = this.allRolesList.find(it => it.id == _item);
                                obj && (arr.push(JSON.stringify(obj)))
                            })
                        } else if (item.userType == 3) {
                            /*遍历数据人员*/
                            item.ids.forEach(_item => {
                                let obj = this.dataList.find(it => it.id == _item);
                                obj && (arr.push(JSON.stringify(obj)))
                            })
                        } else if (item.userType == 4) {
                            let obj = {userType: '4'}
                            arr.push(JSON.stringify(obj));
                        }
                    })
                    this.endWarnList = this.$deepCopy(arr);
                    console.log(this.endWarnList, '11111111111111111111')
                }
            },
		    cancel() {
                this.$router.push('/home/work_template');
            },
            next() {
                this.$refs['formData'].validate((valid) => {
                    if (valid) {
                        this.formData.des = this.formData.des.replace(/&nbsp;/g,' ');
                        let data = this.$deepCopy(this.formData)
                        if (this.formData.sendId == 1) {
                            this.$setsessionStorage('alarmList', this.alarmList)
                        } else if (this.formData.sendId == 2) {
                            this.$setsessionStorage('alarmList', this.leakList)
                        } else {
                            this.$removesessionStorage('alarmList');
                        }
                        this.$setsessionStorage('baseForm', data)
                        setTimeout(() => {
                            this.$router.push('/home/work_template/work_config');
                        }, 500)
                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
            },
            addConditionChild (and) {
		        and.push({
                    field: '',
                    condition: '',
                    val: ''
                })
            },
            deleteConditionChild (and, item) {
		        and.splice(and.indexOf(item),1);
            },
            addCondition () {
                this.formData.startConditionObj.push({
                    and: [
                        {
                            field: '',
                            condition: '',
                            val: ''
                        }
                    ]
                })
            },
            deleteCondition (item) {
                this.formData.startConditionObj.splice(this.formData.startConditionObj.indexOf(item),1);
            }
		}
	}
</script>

<style lang="scss" scoped>
	.event-content{
		background-color: rgba(17, 29, 43, .9);
	}
	.add_template>>>.el-form {
		.el-form-item__label {
			font-size: 12px;
		}
	}
	.relative {
		position: relative;
		.btn-wrap {
			position: absolute;
			right: 0;
		}
	}

	.add_template>>>.is-disabled {
		.el-textarea__inner {
		    background: transparent;
		    border: 1px solid #1cd7fa;
		    box-shadow: 0px 0px 7px #389bf7 inset;
		    color: #ccc;
		}
	}
	.add_template>>>.el-steps {
		.el-step {
			.el-step__head {
				.el-step__line {
					display: none;
					height: 0px;
				}
				.is-text {
					width: 186px;
					height: 30px;
				    border-style: hidden;
				    background-color:transparent !important;
				}
			}
			.step1, .step2, .step3 {
				width: 186px;
				color: #ffffff;
				text-indent: 24px;
				margin-left: 6px;
				line-height: 30px;
				font-style: normal;
				height: 30px;
				background-size: 100% 100%;
			}
			.step2, .step3 {
				text-indent: 38px;
			}
			.step1Active {
				background-image: url(../../assets/img/active_step1.png);
			}
			.step2Active,.step3Active {
				background-image: url(../../assets/img/active_step.png);
			}
			.step1Finish {
				background-image: url(../../assets/img/finish_step1.png);
			}
			.step2Finish,.step3Finish {
				background-image: url(../../assets/img/finish_step.png);
			}
			.step1Ready,.step2Ready,.step3Ready {
				background-image: url(../../assets/img/ready_step.png);
			}
		}
	}

	.title {
		line-height: 2;
		border-bottom: 1px solid #00e9ff;
		.t1 {
			display: inline-block;
			font-size: 14px;
			letter-spacing: 1px;
			border-bottom: 1px solid #00e9ff;
			margin-left: 23px;
			color: #fff;
		}
		.tips {
			font-size: 12px;
			letter-spacing: 0px;
			color: #ffffff;
			opacity: 0.8;
			margin-left: 30px;
			.iconfont {
				font-size: 12px;
			}
		}
	}
	.form-wrapper {
		height: calc(100vh - 190px);
		overflow: auto;
	}
	.form-wrapper>>>.el-form {
		padding: 30px 40px 20px 20px;
	}
	.arrow {
		width: 52px;
		height: 31px;
		display: inline-block;
		margin-left: 84px;
		margin-right: 84px;
		background-image: url(../../assets/img/arrow.png);
	}

	.dis {
		cursor: no-drop;
	}
    .del-btn {
        font-size: 12px;
        color: #1cd7fa;
        margin-top: 10px;
        margin-left: 0px;
        cursor: pointer;

        i {
            margin-right: 4px;
        }
    }
    .operate-color {
        font-size: 12px;
        color: #1cd7fa;
        margin-top: 10px;
        margin-left: 60px;
        margin-bottom: 40px;
        cursor: pointer;

        i {
            margin-right: 4px;
        }
    }
    .single-condition {
        margin-top: 0px;
        flex-wrap: wrap;
    }
    .part-condition {
        margin-top: 10px;
    }
    .left-condition {
        font-size: 12px;
        margin-right: 10px;
        margin-top: 10px;
        width: 30px;
        height: 100%;

    }
    .single-condition >>> .el-divider {
        background-color: rgba(28,215,250,.2);
    }
    .single-condition >>>.el-divider__text {
        background-color: #0f1a27;
        color: #FFF;
    }
    .event >>> .edui-editor-iframeholder {
        height: 300px !important;
    }
    .event >>> .warn-wrapper {
        margin-top: 10px;
        margin-left: 60px;
        width: 640px;
        background: rgba(0,0,0,.2);
        border-radius: 2px;

        & p {
            font-size: 12px;
            margin: 5px 0;

            &.warn-top {
                color: #fff;
                opacity: .6;
            }
            &.warn-body {
                color: #fff;
                word-break: break-all;
            }
        }

    }
    .attendance-dialog .red-star {
        position: relative;
    }
    .attendance-dialog .red-star::before {
        content: '*';
        position: absolute;
        left: 8px;
        top: 8px;
        color: #F56C6C;
    }
    .attendance-dialog .red-warn {
        color: #F56C6C;
        font-size: 12px;
        position: absolute;
        top: calc(100% - 10px);
        left: 0;
    }
</style>
<style>
/*#ue1 {*/
/*    border: 1px solid #01e9ff !important;*/
/*}*/
.edui-default .edui-editor {
    border: 1px solid #01e9ff !important;
    background-color: rgba(0, 0, 0, 0) !important;
}

.edui-default .edui-editor-toolbarboxouter {
    border-bottom: 1px solid #01e9ff !important;
    background-color: rgba(0, 0, 0, 0) !important;
}
#edui_fixedlayer {
    z-index: 999999 !important;
}
</style>
