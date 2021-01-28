<template>
    <div class="wrapper">
        <x-form ref="xForm" v-model="formData" :config="formConfig">
            <template #line1>
                <el-divider></el-divider>
            </template>
            <template #dealType>
                <div>
                    <el-select style="width:100%;" size="mini" v-model="dealType" placeholder="请选择">
                        <el-option label="编辑对象" value="0"></el-option>
                        <el-option label="操作对象" value="1"></el-option>
                    </el-select>
                </div>
            </template>
            <template #operation>
                <div>
                    <el-select style="width:100%;" size="mini" v-model="operation" placeholder="请选择">
                        <el-option label="分析" value="0"></el-option>
                        <el-option label="状态变更" value="1"></el-option>
                        <el-option label="处置" value="2"></el-option>
                        <el-option label="溯源" value="3"></el-option>
                        <el-option label="二线分析" value="4"></el-option>
                    </el-select>
                </div>
            </template>
            <template #fields>
                <div>
                    <div class="ub ub-pc">
                        <el-button style="width:258px;" size="mini" type="primary"
                                   @click="dialogName = 'approvalListenerDialog'">配置要编辑的字段
                        </el-button>
                    </div>
                    <div>
                        <div class="mb0 roles">
                           <el-tag :class="{'must':item.type==1,'read':item.type==0}" size="mini" type="success" v-for="(item,index) in fieldsReal" :key="index">
                               {{ item.name }}
                           </el-tag>
                        </div>
                    </div>
                </div>
            </template>
            <template #line2>
                <el-divider></el-divider>
            </template>
            <template #approvalPeople>
                <div style="position: relative;">
                    <el-button style="position: absolute;top:-30px;right:0; color:#fff584;" size="mini" type="text"
                               @click="dialogName = 'approvalUsersListenerDialog'">编辑
                    </el-button>
                    <!--<div class="user-tips">
                        <i class="el-icon-info"></i><span>此审批需要所有审批人批复</span>
                    </div>-->
                    <div>
                        <div class="no-data-tips" v-if="approvalUsers.length==0">
                            暂未分配审批人
                        </div>
                        <div v-else>
                            <div class="user-item" v-for="(item,index) in approvalUsersNames">
                                <div class="ub w100">
                                    <div class="user-title">{{ item.dealUserTypeNmae }}:</div>
                                    <div class="ub ub-f1 user-box">{{ item.userStr }}</div>
                                </div>
                                <el-divider v-if="index<approvalUsersNames.length-1" class="small-line"></el-divider>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template #line3>
                <el-divider></el-divider>
            </template>
            <template #timeObj>
                <div class="ub ub-ver w100">
                    <div class="ub w100">
                        <div style="font-size:12px;">停留</div>
                        <div>
                            <el-input style="width:70px;margin-left: 10px;" size="mini" v-model="timeObjReal.waitTime" placeholder="请输入"></el-input>
                        </div>
                        <div>
                            <el-select style="width:90px;margin-left: 10px;" size="mini" v-model="timeObjReal.waitTimeType" placeholder="请选择">
                                <el-option label="分钟" value="0"></el-option>
                                <el-option label="小时" value="1"></el-option>
                                <el-option label="天" value="2"></el-option>
                            </el-select>
                        </div>
                        <div style="font-size:12px;">&nbsp;&nbsp;后超时</div>
                    </div>
                    <span v-if="isSetOverTime&&timeObjReal.waitTime==''" class="red-warn warn-content">请填写停留超时时间</span>
                </div>
            </template>
            <template #line4>
                <el-divider></el-divider>
            </template>
            <template #warnSlot>
                <div class="warn-wrapper" style="position: relative;">
                    <el-button style="position: absolute;top:-40px;right:0; color:#fff584;" size="mini" type="text"
                               @click="dialogName = 'autoWarningDialog'">编辑
                    </el-button>
                    <div style="background-color: rgba(0,0,0,.3);padding:10px;border-radius:4px;margin-bottom: 10px;" v-for="(item,index) in usersName" :key="index">
                        <div class="ub ub-pj ub-ac">
                            <p style="font-size: 12px;color: #00ffff">提醒</p>
                            <p>
                                <!-- <i class="iconfont icon-xiugai" style="font-size: 12px;color: #00ffff;cursor: pointer" @click="dialogName = 'autoWarningDialog'"></i> -->
                                <i class="el-icon-close" style="font-size: 12px;color: #00ffff;cursor: pointer" @click="deleteWarnItem(index)"></i>
                            </p>
                        </div>
                        <div style="font-size:12px;">
                            <p class="warn-top">提醒方式：</p>
                            <p class="warn-body">{{item.warnType|getTypeStr}}</p>
                            <p class="warn-top">提醒人员范围：</p>
                            <p class="warn-body" v-if="item.warnUserType==0">工单发起人</p>
                        	<p class="warn-body" v-else-if="item.warnUserType==1">{{item.type|getSomeUsersStr}}</p>
                        	<p class="warn-body" v-else-if="item.warnUserType==2">节点处理人</p>
                        	<p class="warn-body" v-else-if="item.warnUserType==3">{{item.usersName|getUsersStr}}</p>
                            <p class="warn-top">提醒内容：</p>
                            <p class="warn-body" v-html="item.warnMessage"></p>
                        </div>
                    </div>
                </div>
            </template>
        
        </x-form>
        <executionListenerDialog
            v-if="dialogName === 'executionListenerDialog'"
            :element="element"
            :modeler="modeler"
            @close="finishExecutionListener"
        />
        <taskListenerDialog
            v-if="dialogName === 'taskListenerDialog'"
            :element="element"
            :modeler="modeler"
            @close="finishTaskListener"
        />
        <multiInstanceDialog
            v-if="dialogName === 'multiInstanceDialog'"
            :element="element"
            :modeler="modeler"
            @close="finishMultiInstance"
        />
        <approvalDialog
            v-if="dialogName === 'approvalListenerDialog'"
            :element="element"
            :modeler="modeler"
            :fields="fieldsReal"
            :type="2"
			title="配置要编辑的字段"
            @getApprovalSet="getNettApprovalSet"
            @close="finishApprovalListener"
        />
        <usersDialog
            v-if="dialogName === 'approvalUsersListenerDialog'"
            :element="element"
            :modeler="modeler"
            :users="approvalUsersReal"
            @getUsersSet="getUsersSet"
            @close="finishUsersListener"
        />
        <autoWarning
            v-if="dialogName === 'autoWarningDialog'"
            :element="element"
            :modeler="modeler"
            :usersName="usersName"
            @close="dialogName = ''"
            @getNewWarnSet="getNewWarnSet"
        />
    </div>


</template>

<script>
import mixinPanel from '../../common/mixinPanel'
import mixinXcrud from '../../common/mixinXcrud'
import executionListenerDialog from './property/executionListener'
import taskListenerDialog from './property/taskListener'
import multiInstanceDialog from './property/multiInstance'

import approvalDialog from './taskDialogs/approvalDialog'
import usersDialog from './taskDialogs/usersDialog'
import autoWarning from './taskDialogs/autoWarning'

export default {
    components: {
        executionListenerDialog,
        taskListenerDialog,
        multiInstanceDialog,
        
        approvalDialog,
        usersDialog,
        autoWarning
    },
    mixins: [mixinPanel],
    props: {
        users: {
            type: Array,
            required: true
        },
        groups: {
            type: Array,
            required: true
        }
    },
    data () {
        return {
            userTypeOption: [
                {label: '指定人员', value: 'assignee'},
                {label: '候选人员', value: 'candidateUsers'},
                {label: '候选组', value: 'candidateGroups'}
            ],
            dialogName: '',
            executionListenerLength: 0,
            taskListenerLength: 0,
            hasMultiInstance: false,
            fields: [],
			fieldsReal:[],
            dealType: '',
            operation: '',
            approvalUsers: [],
            approvalUsersReal: [],
            approvalUsersNames: [],
            timeObjReal:{
                waitTime:'',
                waitTimeType:''
            },
            formData: {
                candidateUsers: '',
                taskListener: [],
            },
            autoWarningDialog: false,
            warn: [],
            usersName: []
        }
    },
    computed: {
        isSetOverTime(){
            if(this.warn.some(item=>item.warnSendType!='')){
                return true;
            }else{
                return false;
            }
        },
        formConfig () {
			let alarmList = this.$getsessionStorage('alarmList');
            const _this = this
            return {
                inline: false,
                labelPosition: 'top',
                item: [
                    {
                        xType: 'input',
                        name: 'name',
                        placeholder: '请输入',
                        label: '节点名称'
                    },
                    {
                        xType: 'input',
                        type: 'textarea',
                        placeholder: '请输入',
                        name: 'des',
                        label: '节点描述'
                    },
                    {
                        slot: 'line1',
                    },
                    {
                        xType: 'slot',
                        name: 'dealType',
                        label: '需要做什么事',
                    },
                    {
                        xType: 'slot',
                        name: 'operation',
                        label: '执行什么操作',
                        show:this.dealType == 1
                    },
                    {
                        xType: 'slot',
                        name: 'fields',
                        label: '配置要编辑的字段',
						show:this.dealType == 0 && this.dealType !== '' && alarmList!=''&&alarmList.length>0
                    },
                    {
                        slot: 'line2',
						show:this.dealType == 0 && this.dealType !== '' && alarmList!=''&&alarmList.length>0
                    },
                    {
                        xType: 'slot',
                        name: 'approvalPeople',
                        label: '谁来处理业务',
                        rules: [{required: true, message: '请选择', trigger: ['blur', 'change']}]
                    },
                    {
                        slot: 'line3',
                    },
                    {
                        xType: 'slot',
                        name: 'timeObj',
                        label: '任务停留多久超时',
                    },
                    {
                        slot: 'line4',
                    },
                    {
                        xType: 'slot',
                        name: 'warnSlot',
                        label: '设置更多提醒',
                    },
                ]
            }
        },
    },
    filters:{
		getSomeUsersStr(type){
			let types = [
				{
					label:'资产负责人',
					value:'0',
				},{
					label:'告警负责人',
					value:'1',
				}
			];
			
			let str = types.filter(item=>item.value==type)[0].label;
			return str?str:'';
		},
        getTypeStr(type){
            let types = [
                {
                    label:'站内消息',
                    value:'0',
                },{
                    label:'邮件',
                    value:'1',
                },{
                    label:'短信',
                    value:'2',
                },{
                    label:'蓝鲸快信',
                    value:'3',
                },
            ],arr = [];
            type.map(item=>{
                if(types.some(_item=>_item.value==item)){
                    arr.push((types.filter(_item=>_item.value==item)[0].label));
                }
            })
            return arr.join(',')
            
        },
        getUsersStr(users){
            let arr = [];
            users.map(item=>{
                if (item !== '流程相关') {
                    item = JSON.parse(item)
                }
                if (item.type == 0) {
                    arr.push(item.chineseName);
                } else if (item.type == 1||item.type == 3) {
                    arr.push(item.name);
                } else if (item.type == 2) {
                    arr.push(item.roleName);
                } else if (item == '流程相关') {
                    arr.push(item);
                }
            })
            return arr.join(',')
        },
    },
    watch: {
        'formData.des': function (val, oldVal) {
            if (val === '') val = ''
            console.log(this.formData)
            let documentation = JSON.parse(this.formData.documentation);
            documentation.des = val ? val : '';
            this.formData.documentation = JSON.stringify(documentation);
            this.updateProperties({'camunda:des': val})
        },
        'dealType': function (val, oldVal) {
            //console.log('?????????????????????????????????????')
            if (val === '') val = ''
            let documentation = JSON.parse(this.formData.documentation);
            documentation.dealType = val ? val : '';
            if (val == 0 && val !== '') {
                'operation' in documentation && delete documentation.operation
                documentation.fields = [];
            } else if (val == 1) {
                'fields' in documentation && delete documentation.fields;
                documentation.operation = '';
            }
            this.formData.documentation = JSON.stringify(documentation);
            this.updateProperties({'camunda:dealType': val})
        },
        'operation': function (val, oldVal) {
            //console.log('?????????????????????????????????????')
            if (val === '') val = ''
            let documentation = JSON.parse(this.formData.documentation);
            documentation.operation = val ? val : '';
            this.formData.documentation = JSON.stringify(documentation);
            this.updateProperties({'camunda:operation': val})
        },
        'timeObjReal.waitTime': function (val) {
            console.log(this.formData)
            let documentation = JSON.parse(this.formData.documentation);
            documentation.waitTime = val;
            this.formData.documentation = JSON.stringify(documentation);
            this.updateProperties({'camunda:waitTime': val})
        },
        'timeObjReal.waitTimeType': function (val) {
            console.log(this.formData)
            let documentation = JSON.parse(this.formData.documentation);
            documentation.waitTimeType = val;
            this.formData.documentation = JSON.stringify(documentation);
            this.updateProperties({'camunda:waitTimeType': val})
        },
        
        'approvalUsers': function (val) {
            if (val === '') val = null
            console.log(this.formData)
            let documentation = JSON.parse(this.formData.documentation);
            documentation.users = val ? val : [];
            this.formData.documentation = JSON.stringify(documentation);
            this.updateProperties({'camunda:approvalUsers': encodeURI(JSON.stringify(val))})
            this.updateProperties({'camunda:approvalUsersNames': encodeURI(JSON.stringify(this.approvalUsersNames))})
        },
        'fieldsReal': function (val) {
            if (val === '') val = null
            console.log(this.formData)
            let documentation = JSON.parse(this.formData.documentation);
        	let fieldsReal = this.$deepCopy(val?val:[]);
        	 documentation.fields = fieldsReal.map(item=>{
        			delete item.isSelected;
        			return item;
        		});
            this.formData.documentation = JSON.stringify(documentation);
            this.updateProperties({'camunda:fieldsReal':encodeURI(JSON.stringify(val))})
        },
        'warn': function (val) {
            if (val === '') val = null
            console.log(this.formData)
            let documentation = JSON.parse(this.formData.documentation);
            documentation.warn = val ? val : [];
            if (documentation.warn.length) {
                documentation.warn.forEach((item,index) => {
                    console.log(item)
                    item.warnMessage = item.warnMessage.replace(/<[^>]*>|<\/[^>]*>/gm, "");
                    item.title = item.title.replace(/<[^>]*>|<\/[^>]*>/gm, "");
                })
            }
            this.formData.documentation = JSON.stringify(documentation);
            this.updateProperties({'camunda:warn': encodeURI(JSON.stringify(val))})
        },
        'usersName': function (val) {
            if (val === '') val = []
            this.updateProperties({'camunda:usersName': encodeURI(JSON.stringify(val))})
        },
        
    },
    created () {
        const cache = {
            ...this.element.businessObject,
            ...this.element.businessObject.$attrs
        }
        //cache.documentation = this.getDocumentation();
        console.log('cache11111', cache)
        this.updateProperties({'camunda:taskType': 2})
        
        // 移除camunda前缀，格式化数组
        for (const key in cache) {
            if (key.indexOf('camunda:') === 0) {
                const newKey = key.replace('camunda:', '')
                cache[newKey] = cache[key]
                delete cache[key]
            }
        }
        // for (const key in cache) {
        //     if (key === 'candidateUsers') {
        //         cache.userType = 'candidateUsers';
        //         cache[key] = cache[key]?.split(',') || [];
        //     } else if (key === 'candidateGroups') {
        //         cache.userType = 'candidateGroups';
        //         cache[key] = cache[key]?.split(',') || [];
        //     } else if (key === 'assignee') {
        //         cache.userType = 'assignee';
        //     }
        // }
        /*审批会签节点注入后台变量*/
        this.formData.candidateUsers = '${'+ this.element.id + '_users}';
        this.updateProperties({'camunda:candidateUsers': this.formData.candidateUsers})
        //节点数据初始化逻辑
        let fieldsRealStr = cache.fieldsReal?decodeURI(cache.fieldsReal):'[]';
        let fieldsReal = JSON.parse(fieldsRealStr);
        let _fieldsReal = this.$deepCopy(fieldsReal);
        console.log('fieldsReal',fieldsReal)
        let fields = _fieldsReal.map(item=>{
        		delete item.isSelected;
        		return item;
        	});
        //提醒初始化
        let warnStr = cache.warn?decodeURI(cache.warn):'[]';
        let warn = JSON.parse(warnStr);
        //提醒人员初始化
        let usersNameStr = cache.usersName?decodeURI(cache.usersName):'[]';
        console.log('usersNameStr',usersNameStr)
        let usersName = JSON.parse(usersNameStr);
        console.log('usersName',usersName)
        let approvalUsersStr = cache.approvalUsers?decodeURI(cache.approvalUsers):'[]';
        let approvalUsers = JSON.parse(approvalUsersStr);
        let approvalUsersNamesStr = cache.approvalUsersNames?decodeURI(cache.approvalUsersNames):'[]';
        let approvalUsersNames = JSON.parse(approvalUsersNamesStr);
        let documentation = {
            id:cache.id,
            type: cache.taskType,
            des: cache.des ? cache.des : '',
            //fields: cache.dealType != 1 ? fields: [],
            users: approvalUsers,
            waitTime:cache.waitTime ? cache.waitTime : '',
            waitTimeType:cache.waitTimeType ? cache.waitTimeType : '',
            warn: warn,
            dealType: cache.dealType ? cache.dealType : '',
            //operation: cache.dealType == 1 ? cache.operation : '',
        };
        if (documentation.warn.length) {
            documentation.warn.forEach((item,index) => {
                console.log(item)
                item.warnMessage = item.warnMessage.replace(/<[^>]*>|<\/[^>]*>/gm, "");
                item.title = item.title.replace(/<[^>]*>|<\/[^>]*>/gm, "");
            })
        }
        this.dealType = cache.dealType ? cache.dealType : '';
        if (this.dealType == 1) {
            this.operation = cache.operation ? cache.operation : '';
            documentation.operation = cache.operation ? cache.operation : '';
        } else if (this.dealType == 0 && this.dealType !== '') {
            documentation.fields = fields;
            this.fields = fields;
            this.fieldsReal = fieldsReal;
        }
        
        this.approvalUsersNames = approvalUsersNames;
        this.approvalUsersReal = [];
        this.approvalUsersNames.map(item => {
            let obj = {};
            obj.dealUserType = item.dealUserType;
            if (item.dealUserType == 1) {
                obj.type = item.users.length > 0 ? item.users[0].id : ''
            } else if (item.dealUserType == 2) {
                obj._users = this.$deepCopy(item._users);
                obj.users = this.$deepCopy(item.users);
            }
            this.approvalUsersReal.push(obj)
        })
        this.approvalUsers =approvalUsers;
        console.log('this.approvalUsersReal', this.approvalUsersReal)
        //时间超时回显
        this.timeObjReal.waitTime = cache.waitTime ? cache.waitTime : '',
            this.timeObjReal.waitTimeType = cache.waitTimeType ? cache.waitTimeType : '',
            //提醒
            this.warn = warn;
        this.usersName = usersName;
        
        
        cache.documentation = JSON.stringify(documentation);
        this.formData = cache;
        this.computedExecutionListenerLength();
        this.computedTaskListenerLength();
        this.computedHasMultiInstance();
    },
    mounted () {
        this.formData.taskListener = [
            {
                $type: "camunda:TaskListener",
                event: "create",
                class: "com.boot.base.common.util.workflow.TaskCreateListener"
            },
            {
                $type: "camunda:TaskListener",
                event: "complete",
                class: "com.boot.base.common.util.workflow.TaskCompleteListener"
            }
        ]
        this.updateElement();
        //this.updatemultiInstanceElement();
    },
    methods: {
        // 多实例
        updatemultiInstanceElement () {
            let multiInstanceLoopCharacteristics = this.element.businessObject.get('loopCharacteristics');
            console.log('multiInstanceLoopCharacteristics',multiInstanceLoopCharacteristics)
			if (!multiInstanceLoopCharacteristics) {
			  multiInstanceLoopCharacteristics = this.modeler.get('moddle').create('bpmn:MultiInstanceLoopCharacteristics')
			  console.log('multiInstanceLoopCharacteristics11111111111111',multiInstanceLoopCharacteristics)
			  multiInstanceLoopCharacteristics.$attrs['isSequential'] = false; // true 是串行，false 是并行
			  multiInstanceLoopCharacteristics.$attrs['camunda:collection'] = this.element.id + '_users';
			  multiInstanceLoopCharacteristics.$attrs['camunda:elementVariable'] = this.element.id + '_per';
			  const completionCondition = this.modeler.get('moddle').create('bpmn:Expression', {body: '${node_result==true}'})
			  multiInstanceLoopCharacteristics['completionCondition'] = completionCondition
			  console.log('multiInstanceLoopCharacteristics',multiInstanceLoopCharacteristics)
			  this.updateProperties({multiInstanceLoopCharacteristics: multiInstanceLoopCharacteristics})
			}
        },
        // 注入任务监听
        updateElement() {
            if (this.formData.taskListener?.length) {
                let extensionElements = this.element.businessObject.get('extensionElements')
                if (!extensionElements) {
                    extensionElements = this.modeler.get('moddle').create('bpmn:ExtensionElements')
                }
                // 清除旧值
                extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'camunda:TaskListener') ?? []
                this.formData.taskListener.forEach(item => {
                    const taskListener = this.modeler.get('moddle').create('camunda:TaskListener')
                    taskListener['event'] = item.event
                    taskListener['class'] = item.class
                    extensionElements.get('values').push(taskListener)
                })
                this.updateProperties({ extensionElements: extensionElements })
            } else {
                const extensionElements = this.element.businessObject[`extensionElements`]
                if (extensionElements) {
                    extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'camunda:TaskListener') ?? []
                }
            }
        },
        //获取新的审批字段配置
        getNettApprovalSet (obj) {
           console.log('obj', obj)
           this.fieldsReal = this.$deepCopy(obj);
           this.fields = obj.map(item=>{
           	delete item.isSelected;
           	return item;
           });
           console.log('this.fields', this.fields)
        },
        getUsersSet ({data1, data2}) {
            console.log('data1', data1)
            console.log('data2', data2)
            data1 = data1.map(item => {
                if (item.dealUserType == 2) {
                    delete item._users;
                }
                return item;
            })
            console.log('data1', data1)
            
            this.approvalUsersNames = this.$deepCopy(data2);
            this.approvalUsersReal = [];
            this.approvalUsersNames.map(item => {
                let obj = {};
                obj.dealUserType = item.dealUserType;
                if (item.dealUserType == 1) {
                    obj.type = item.users.length > 0 ? item.users[0].id : ''
                } else if (item.dealUserType == 2) {
                    obj.users = this.$deepCopy(item.users);
                    obj._users = this.$deepCopy(item._users);
                }
                this.approvalUsersReal.push(obj)
            })
            this.approvalUsers = this.$deepCopy(data1);
            console.log('this.ApprovalUsers', this.approvalUsers)
        },
        deleteWarnItem(index) {
            this.warn.splice(index,1);
            this.usersName.splice(index,1);
        },
        //获取新的提醒字段配置
        getNewWarnSet (val) {
            
            console.log('obj1111111111', val);
            //    let newObj = this.$deepCopy(obj);
            this.usersName = this.$deepCopy(val);
            this.warn = val.map(item=>{
                delete item.usersName;
                return item;
            });
            console.log('this.warn', this.warn)
        },
        deleteFieldItem() {
            let arr = this.warn.filter(item=> {
                return item.type !=1;
            })
            this.warn = arr ? arr : [];
        },
        computedExecutionListenerLength () {
            this.executionListenerLength = this.element.businessObject.extensionElements?.values
                ?.filter(item => item.$type === 'camunda:ExecutionListener').length ?? 0
        },
        computedTaskListenerLength () {
            this.taskListenerLength = this.element.businessObject.extensionElements?.values
                ?.filter(item => item.$type === 'camunda:TaskListener').length ?? 0
        },
        computedHasMultiInstance () {
            if (this.element.businessObject.multiInstanceLoopCharacteristics) {
                this.hasMultiInstance = true
            } else {
                this.hasMultiInstance = false
            }
        },
        finishExecutionListener () {
            if (this.dialogName === 'executionListenerDialog') {
                this.computedExecutionListenerLength()
            }
            this.dialogName = ''
        },
        finishTaskListener () {
            if (this.dialogName === 'taskListenerDialog') {
                this.computedTaskListenerLength()
            }
            this.dialogName = ''
        },
        
        finishApprovalListener () {
            if (this.dialogName === 'approvalListenerDialog') {
                //this.computedTaskListenerLength()
            }
            this.dialogName = ''
        },
        finishUsersListener () {
            if (this.dialogName === 'approvalUsersListenerDialog') {
                //this.computedTaskListenerLength()
            }
            this.dialogName = ''
        },
        finishMultiInstance () {
            if (this.dialogName === 'multiInstanceDialog') {
                this.computedHasMultiInstance()
            }
            this.dialogName = ''
        }
    }
}
</script>

<style lang="scss" scoped>
.wrapper >>> .el-dropdown-link {
    cursor: pointer;
    color: #00c0ff;
}
.wrapper >>> .el-icon-arrow-down {
    font-size: 12px;
}
.wrapper >>> .warn-wrapper {
    margin-top: 10px;
    background: rgba(0,0,0,.2);
    border-radius: 2px;
    
    & p {
        font-size: 12px;
        margin: 5px 0;
        line-height: 16px;
        
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
.mb0 {
    font-size: 0;
    overflow: hidden;
    margin-top: 6px;
    
    .el-tag {
        margin: 0 5px 5px 0;
        float: left;
    }
}

.roles > > > .el-tag.el-tag--success {
    background-color: rgba(0, 0, 0, 0) !important;
    border-color: #01c5ff !important;
    color: #00fdff !important;
}
.roles .must:before{
	content: '*';
	color: #F56C6C;
	margin-right: 2px;
}
.roles .read:before{
	content: 'R';
	margin-right: 2px;
}
.user-tips {
    font-size: 12px;
    color: #1cd7fa;
    line-height: 16px;
    
    span {
        margin-left: 5px;
    }
}

.no-data-tips {
    margin-top: 10px;
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 1px;
    color: #ffffff;
    opacity: 0.6;
}

.user-item {
    width: 260px;
    margin: 10px auto;
}

.user-title {
    width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.user-title, .user-box {
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 1px;
    color: #00fcff;
}

.user-box {
    padding-left: 10px;
}

.small-line {
    opacity: 0.2;
    margin: 5px 0 !important;
}
.wrapper .red-warn {
    color: #F56C6C;
    font-size: 12px;
    position: absolute;
    top: calc(100% - 10px);
    left: 0;
}
</style>
