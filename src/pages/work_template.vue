<template>
    <div class="event event-wrapper">
        <div class="w100" v-show="!firstShow">
            <div class="tab-button ub">
                <div class="work-btn" @click="tabClick('1')" :class="{'tab-active': currentTab === '1'}">工单模板</div>
                <div class="draft-btn" @click="tabClick('2')" :class="{'tab-active': currentTab === '2'}">草 稿</div>
            </div>
            <div class="ub w100 search-area" style="box-sizing: border-box;">
                <div class="ub event-content w100">
                    <div class="ub ub-ver ub-ac ub-f1">
                        <el-row type="flex" align="middle" class="w100" style="border-radius:0 0 5px 5px;">
                            <el-col :span="6" class="event-btn-col">
                                <el-form :model="get_params">
                                    <el-form-item label="模板名称：" label-width="85px">
                                        <el-input placeholder="请输入" clearable
                                                  v-model="get_params.name" @keyup.enter.native="searchCheck"
                                                  size="small"></el-input>
                                    </el-form-item>
                                </el-form>
                            </el-col>
                            <el-col :span="6" class="event-btn-col">
                                <el-form :model="get_params">
                                    <el-form-item label="发起对象：" label-width="85px">
                                        <el-select filterable clearable v-model="get_params.sendId" size="small" style="width: 100%" placeholder="请选择">
                                            <el-option v-for="(item, index) in sendObjectList" :key="index" :label="item.name" :value="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-form>
                            </el-col>
                            <el-col :span="6" class="event-btn-col" v-if="currentTab == '1'">
                                <el-form :model="get_params">
                                    <el-form-item label="模板状态：" label-width="85px">
                                        <el-select placeholder="请选择"
                                                   clearable
                                                  v-model="get_params.status"
                                                  size="small">
                                            <el-option label="未启用" value="2"></el-option>
                                            <el-option label="已启用" value="1"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-form>
                            </el-col>
                            <el-col :span="6" class="event-btn-col">
                                <el-form :model="get_params">
                                    <el-form-item label="创建时间：" label-width="90px">
                                        <el-date-picker clearable size="small" value-format="yyyy-MM-dd HH:mm:ss"
                                                        v-model="sayTimes"
                                                        :style="getStyle()"
                                                        type="datetimerange" range-separator="至"
                                                        start-placeholder="开始日期" end-placeholder="结束日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-form>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="ub">
                        <searchBtn title="搜 索" @click="searchCheck"/>
                    </div>
                </div>
            </div>
            <div class="attendance-list table-area">
                <div class="ub ub-pj w100">
                    <div class="list-tips">列表内容</div>
                    <div>
                        <addBtn icon="el-icon-plus" title="添加模板" @click="handleAddTemplate"/>
                        <!--<deleteBtn style="margin-left: 10px;" icon="el-icon-delete" title="刪 除" @click="handleDeleteAll"/>-->
                    </div>
                </div>
                <el-table ref="multipleTable" v-loading="loading" class='bigTable full-table' :data="tableData" border stripe
                          tooltip-effect="dark"
                          v-if="get_params.type != 1"
                          :key="1"
                          @selection-change="handleSelectionChange">
                    <!--<el-table-column type="selection" width="40"></el-table-column>-->
                    <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                    </el-table-column>
                    <el-table-column prop="name" label="模板名称" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="sendCN" label="发起对象" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="status" label="状态" width="80">
                        <template slot-scope="{row}">
                            <span v-if="row.status == 1" style="color: #00ff00">已启用</span>
                            <span v-if="row.status == 2" style="color: rgba(255,255,255,0.5)">未启用</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="userIds" label="适用范围" width="260" show-overflow-tooltip>
                        <template slot-scope="{row}">
                            <span v-for="(item, index) in row.userIds" :key="index">{{item.name}}
                                <span v-if="index !== row.userIds.length-1">，</span>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="num" label="使用次数" align="center" width="80">
                        <template slot-scope="{row}">
                            <span style="color: #00ffe4">{{row.num}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createUserCN" label="创建人"  width="80">
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="160">
                    </el-table-column>
                    <el-table-column prop="status" label="是否启用" width="100" align="center">
                        <template slot-scope="{row}">
                            <div class="switch-wrapper" :class="{'yes':row.status == 1,'no':row.status == 2}"  @click="deploymentEnvironment(row)">
                                <div class="ub ub-ac ub-pj">
                                    <div style="margin-left: -1px">是</div>
                                    <div>否</div>
                                </div>
                                <div class="circle"></div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="200">
                        <template slot-scope="scope">
                            <!--<el-button type="text" @click="handleSee(scope.row)">查 看</el-button>-->
                            <el-button type="text" @click="handleCopyAdd(scope.row)">复制并新建</el-button>
                            <el-button type="text" style="color: #fff584" @click="handleEdit(scope.row)">编 辑</el-button>
                            <el-button type="text" style="color: #ff7200" @click="handleDelete(scope.row)">删 除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-table ref="multipleTable" v-loading="loading" class='bigTable full-table' :data="tableData" border stripe
                          tooltip-effect="dark"
                          v-if="get_params.type == 1"
                          :key="2"
                          @selection-change="handleSelectionChange">
                    <!--<el-table-column type="selection" width="40"></el-table-column>-->
                    <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                    </el-table-column>
                    <el-table-column prop="name" label="模板名称" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="sendCN" label="发起对象" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="userIds" label="适用范围" width="260" show-overflow-tooltip>
                        <template slot-scope="{row}">
                            <span v-for="(item, index) in row.userIds" :key="index">{{item.name}}
                                <span v-if="index !== row.userIds.length-1">，</span>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="num" label="使用次数" align="center" width="80">
                        <template slot-scope="{row}">
                            <span style="color: #00ffe4">{{row.num}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createUserCN" label="创建人"  width="80">
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="160">
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="160">
                        <template slot-scope="scope">
                            <el-button type="text" style="color: #fff584" @click="handleEdit(scope.row)">编辑草稿</el-button>
                            <el-button type="text" style="color: #ff7200" @click="handleDelete(scope.row)">删除草稿</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                   :current-page="get_params.page"
                                   :page-sizes="[20, 30, 40,50]" :page-size="get_params.size"
                                   layout="total, sizes, prev, pager, next" prev-text="上一页"
                                   next-text="下一页" :total="total_num">
                    </el-pagination>
                </div>
            </div>
        </div>
        
        <!--删除-->
        <el-dialog title="删除资源" :visible.sync="deleteDialog" width="30%" custom-class="attendance-dialog">
            <span>确定删除吗？</span>
            <span slot="footer" class="dialog-footer">
				<searchBtn title="确 定" @click="handleDeleteFun"/>
				<cancle-btn title="取 消" @click="deleteDialog = false"/>
			</span>
        </el-dialog>
    
        <el-drawer :visible.sync="seeDialog" direction="rtl" size="850px">
            <div class="drawer-content">
                <div style="position: absolute;left:0;top:0;width:100%;height:100%;overflow-y: auto;padding:20px;box-sizing: border-box;">
                    <div class="ub ub-pj w100">
                        <div class="list-tips">
                            {{'模板名称'}}
                        </div>
                        <div>
                            <i class="el-icon-close" style="color:#00b3ca;font-size:20px;cursor: pointer;"
                               @click="seeDialog=false"></i>
                        </div>
                    </div>
                    <el-tabs v-model="seeActive">
                        <el-tab-pane label="详情信息" name="first">
                            <p class="box-title">基本信息</p>
                            <div class="baseinfo-box">
                                <el-row style='margin:20px 0;' type="flex" justify="start">
                                    <div class="ub" style="width:33%;">
                                        <div class="label">模板名称：</div>
                                        <div class="ub ub-f1 line1 label-val">{{seeForm.name | NullStr}}</div>
                                    </div>
                                    <div class="ub" style="width:33%;">
                                        <div class="label">发起对象：</div>
                                        <div class="ub ub-f1 line1 label-val">{{seeForm.sendCN | NullStr}}</div>
                                    </div>
                                    <div class="ub" style="width:33%;">
                                        <div class="label">模板状态：</div>
                                        <div class="ub ub-f1 line1 label-val">
                                            <span v-if="seeForm.status == 1" style="color: #00ff00">已启用</span>
                                            <span v-if="seeForm.status == 2" style="color: rgba(255,255,255,0.5)">未启用</span>
                                        </div>
                                    </div>
                                </el-row>
                                <el-row style='margin:20px 0;' type="flex" justify="start">
                                    <div class="ub" style="width:33%;">
                                        <div class="label">使用次数：</div>
                                        <div class="ub ub-f1 line1 label-val">
                                            <span style="color: #00ffe4">{{seeForm.num | NullStr}}</span>
                                        </div>
                                    </div>
                                    <div class="ub" style="width:33%;">
                                        <div class="label">创建人：</div>
                                        <div class="ub ub-f1 line1 label-val">{{seeForm.createUserCN | NullStr}}</div>
                                    </div>
                                    <div class="ub" style="width:33%;">
                                        <div class="label">创建时间：</div>
                                        <div class="ub ub-f1 line1 label-val">{{seeForm.createTime | NullStr}}</div>
                                    </div>
                                </el-row>
                                <el-row style='margin:20px 0;' type="flex" justify="start">
                                    <div class="ub">
                                        <div class="label">适用范围：</div>
                                        <div class="ub ub-f1 line1 label-val">
                                             <span v-for="(item, index) in seeForm.userIds" :key="index">{{item.name}}
                                             <span v-if="index !== seeForm.userIds.length-1">，</span>
                                             </span>
                                        </div>
                                    </div>
                                </el-row>
                                <el-row style='margin:20px 0;' type="flex" justify="start">
                                    <div class="ub">
                                        <div class="label">工单描述：</div>
                                        <div class="ub ub-f1 line1 label-val" v-html="seeForm.des"></div>
                                    </div>
                                </el-row>
                            </div>
                            <p class="box-title">触发条件</p>
                            <div class="condition-box">
                                <div class="single-condition" v-for="(item, index) in seeForm.startConditionObj" :key="index">
                                    <div v-if="index != 0" style="color: #fff584;font-size: 12px;height:21px;line-height: 21px;margin-bottom: 10px">或（or）</div>
                                    <div class="ub ub-ver">
                                        <div class="part-condition ub ub-ac" v-for="(_item, _index) in item.and" :key="_index">
                                            <span class="condition_black">且（and）</span>
                                            <span class="condition_white">{{_item.field | showField(that)}}</span>
                                            <span class="condition_black">{{_item.condition | showCondition(that)}}</span>
                                            <span class="condition_white">{{_item.val || '--' }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p class="box-title">结束工单后动作</p>
                            <div class="finish-box">
                                <div class="warn-wrapper">
                                    <div class="ub ub-pj ub-ac">
                                        <p style="font-size: 12px;color: #00ffff">提醒</p>
                                        <p>
                                            <i class="iconfont icon-xiugai" style="font-size: 12px;color: #00ffff;"></i>
                                            <i class="el-icon-close" style="font-size: 12px;color: #00ffff;"></i>
                                        </p>
                                    </div>
                                    <div>
                                        <p class="warn-top">提醒方式：</p>
                                        <p class="warn-body">{{show_warn_type || '--'}}</p>
                                        <p class="warn-top">提醒人员范围：</p>
                                        <p class="warn-body">{{show_warn_user || '--'}}</p>
                                        <p class="warn-top">提醒内容：</p>
                                        <p class="warn-body" v-html="show_warn_mes"></p>
                                    </div>
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="流程详情" name="second">
                        </el-tab-pane>
                    </el-tabs>
                    <div v-if="seeActive == 'second'" class="w100 pic-wrapper" style="color: #fff;">
                        <bpmn-modeler
                            ref="refNode"
                            :xml="seeForm.xml"
                            :users="users"
                            :groups="groups"
                            :categorys="categorys"
                            :is-view="false"
                        />
                    </div>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import {
    getSendObject,
    getAllUsers,
    getAllDep,
    getAllRoles,
    getWorkTemplateList,
    deleteWorkTemplateList,
    changeWorkStatus
} from '../server/define.js'
import {
    get_selested_all_fileds,
    get_condition,
    get_leak_fileds
} from '../server/api.js'
import bpmnModeler from '../package/detailXml'
import axios from 'axios';
export default {
    name: 'work_object',
    components: {
        bpmnModeler
    },
    data () {
        return {
            users: [
                { name: '张三', id: 'zhangsan' },
                { name: '李四', id: 'lisi' },
                { name: '王五', id: 'wangwu' }
            ],
            groups: [
                { name: 'web组', id: 'web' },
                { name: 'java组', id: 'java' },
                { name: 'python组', id: 'python' }
            ],
            categorys: [
                { name: 'OA', id: 'oa' },
                { name: '财务', id: 'finance' }
            ],
            
            that: this,
            currentTab: '1',
            seeActive: 'first',
            seeDialog: false,
            fileList: [],
            data_id: '',
            editItemDialog: false,
            file_num: 0,
            sendObjectList: [], // 工单发起对象
            flag: null,
            record_row: {},
            editDeploy: {
                id: '',
                status: ''
            },
            config_id: '',
            
            addDialog: false,
            addForm: {
                // id: '',
                name: '',
                des: ''
            },
            editForm: {
                id: '',
                name: '',
                des: ''
            },
            addTempItem: {
                id: '',
                poolId: '',
                content: [
                    {
                        value: '',
                        key: '1'
                    }
                ],
                createTime: ''
            },
            editTempItem: {
                id: '',
                poolId: '',
                content: '',
                createTime: ''
            },
            rules: {
                name: [{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }],
                des: [{
                    required: false,
                    message: '请输入描述',
                    trigger: 'blur'
                }]
            },
            firstShow: false,
            isOpen: false,
            inner_name: '',
            templateId: '',
            deleteItemDialog: false,
            deleteDialog: false,
            deleteId: '',
            deleteItemId: '',
            editDialog: false,
            formLabelWidth: "120px",
            loading: false,
            total_num: 0,
            multipleSelection: [],
            itemSelection: [],
            tableData: [],
            sayTimes: [],
            get_params: {
                page: 1,
                size: 20,
                name: '',
                sendId: '',
                status: '',
                type: 0
            },
            seeForm: {},
            allUserList: [], // 所有人
            allDepList: [], // 所有部门
            allRolesList: [], // 所有角色
            alarmList: [], // 告警字段
            conditionList: [], //条件字段
            leakList: [], // 漏洞字段
            dataList: [
                {
                    name: '资产负责人',
                    id: 0
                },
                {
                    name: '告警创建人',
                    id: 1
                }
            ],
        }
    },
    watch: {
        'addDialog': {
            handler (newVal, oldVal) {
                // console.log(newVal, oldVal,'---------------------')
                if (!newVal) {
                    this.$refs.addForm.resetFields();
                }
            },
        },
    },
    mounted () {
        // this.init();
        this.$nextTick(() => {
            this.get_data();
        })
    },
    filters: {
        showField (val,that) {
            if (that.seeForm?.sendId == '1') {
                let item = that.alarmList.find(it => it.value == val);
                if (item) {
                    return  item.label;
                } else {
                    return '--'
                }
            } else if (that.seeForm?.sendId == '2') {
                let item = that.leakList.find(it => it.value == val);
                if (item) {
                    return  item.label;
                } else {
                    return '--'
                }
            }
        },
        showCondition (val, that) {
            let item = that.conditionList.find(it => it.value === val)
            if (item) {
                return  item.name;
            } else {
                return '--'
            }
        },
    },
    computed: {
        show_warn_type () {
            let str='';
            if (this.seeForm?.endEventObj?.type.length) {
                this.seeForm?.endEventObj?.type.forEach(item => {
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
            if (this.seeForm?.endEventObj?.users.length) {
                this.seeForm?.endEventObj?.users.forEach(item => {
                    if (item.userType == 0) {
                        item.ids.forEach(_item => {
                            let one = this.allUserList.find(it => it.id == _item)
                            one && ( str += one.chineseName + '、')
                        })
                    } else if (item.userType == 1) {
                        item.ids.forEach(_item => {
                            let one = this.allDepList.find(it => it.id == _item)
                            one && ( str += one.name + '、')
                        })
                    } else if (item.userType == 2) {
                        item.ids.forEach(_item => {
                            let one = this.allRolesList.find(it => it.id == _item)
                            one && ( str += one.roleName + '、')
                        })
                    } else if (item.userType == 3) {
                        item.ids.forEach(_item => {
                            let one = this.dataList.find(it => it.id == _item)
                            one && ( str += one.name + '、')
                        })
                        str+= item.name + '、';
                    } else if (item.userType == 4) {
                        str+= '流程相关' + '、';
                    }
                })
            }
            (str[str.length-1] === '、') && (str=str.slice(0,str.length-1))
            return str??'';
        },
        show_warn_mes () {
            return this.seeForm?.endEventObj?.mes === '' ? '--' : this.seeForm?.endEventObj?.mes;
            
        },
    },
    methods: {
        getStyle() {
            console.log(window.screen.width)
            let ws = window.screen.width;
            if (ws >= 1680) {
                return {
                    width: '220px'
                };
            } else if (ws < 1680 ) {
                return {
                    width: '156px'
                };
            }
        },
        getSeeList () {
            axios.all([getAllUsers({}), getAllDep({}), getAllRoles({})]).then(axios.spread((users, deps, roles) => {
                console.log(users, deps, roles)
                this.allUserList = users;
                this.allDepList = deps;
                this.allRolesList = roles;
            }));
        },
        getWorkFields () {
            axios.all([get_selested_all_fileds({}), get_condition({}), get_leak_fileds({})]).then(axios.spread((alarm, condition, leak) => {
                console.log(alarm, condition, leak)
                this.alarmList = alarm;
                this.conditionList = condition;
                this.leakList = leak;
            }));
        },
        indexMethod (index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1;
        },
        indexInnerMethod (index) {
            return (this.get_inner_params.page - 1) * this.get_inner_params.size + index + 1;
        },
        tabClick (val='1') {
            this.currentTab = val;
            val === '1' && (this.get_params.type = 0);
            val === '2' && (this.get_params.type = 1);
            this.get_data();
        },
        handleAddTemplate () {
            this.$router.push('/home/work_template/work_base')
        },
        
        searchCheck () {
            // alert(123)
            this.get_params.page = 1;
            this.get_data();
        },
        searchCheckItem () {
            this.get_inner_params.page = 1;
            this.get_Item();
        },
        
        get_data () {
            this.loading = true;
            this.tableData = [];
            let uid = this.config_id = new Date().getTime();
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: 1
                },
                paramsData: {
                    name: this.get_params.name,
                    sendId: this.get_params.sendId,
                    status: this.get_params.status,
                    type: this.get_params.type,
                    startTime: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[0] : '',
                    endTime: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[1] : '',
                }
            }
            import('./data.json').then(res => {
                res = res.data;
                console.log('模板列表', res);
                this.loading = false;
                if (this.config_id !== uid) {
                    return;
                }
                this.total_num = res.totalElements;
                let list = res.content;
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {};
                        obj.id = item.id;
                        obj.name = item.name;
                        obj.num = item.num;
                        obj.sendId = item.sendId;
                        obj.sendCN = item.sendCN;
                        obj.startConditionObj = item.startConditionObj;
                        obj.status = item.status;
                        obj.statusCN = item.statusCN;
                        obj.xmlName = item.xmlName;
                        obj.xml = item.xml;
                        obj.endEventObj = item.endEventObj;
                        obj.des = item.des;
                        obj.createTime = item.createTime;
                        obj.createUserId = item.createUserId;
                        obj.createUserCN = item.createUserCN;
                        obj.deploymentId = item.deploymentId;
                        obj.userIds = item.userIds;
                        this.tableData.push(obj);
                    })
                }
            }).catch(error => {
                this.loading = false;
                console.log('error' + error);
            })
        },
        init() {
            this.get_sendObject();
            this.getSeeList();
            this.getWorkFields();
        },
        get_sendObject() {
            getSendObject({}).then(res => {
                console.log('工单发起对象', res)
                this.sendObjectList = res;
                this.$setsessionStorage('sendObjectList', res)
            }).catch(err => {
                console.log(err, 'err')
            })
        },
        deploymentEnvironment (val) {
            this.flag = setTimeout(() => {
                this.record_row = {};
            }, 1000)
            /*防止频繁点击*/
            if (val.id === this.record_row.id) {
                return ;
            }
            this.record_row = val;
            this.editDeploy.id = val.id;
            // console.log(val.status)
            val.status = (val.status == 1 ? 2 : 1);
            this.submitDeployForm();
        },
        submitDeployForm (row) {
            let obj = {
                id: this.editDeploy.id
            };
            changeWorkStatus(obj).then(res => {
                if (document.getElementsByClassName('el-message').length === 0) {
                    this.$message({
                        message: '状态修改成功',
                        type: 'success'
                    })
                }
            }).catch(error => {
                console.log(error + 'error')
            });
        },
        handleSee (row) {
            this.seeDialog = true;
            this.seeForm = row;
            console.log(this.seeForm)
        },
        handleCopyAdd (row) {
            let form = this.$deepCopy(row);
            form.id = '';
            form.name = form.name + '--copy';
            this.$setsessionStorage('copyTemplate', form);
            this.$router.push('/home/work_template/work_base');
        },
        handleEdit (row) {
            let form = this.$deepCopy(row);
            this.$setsessionStorage('editTemplate', form);
            this.$router.push('/home/work_template/work_base')
        },
        handleDeleteAll () {
            if (this.multipleSelection.length == 0) {
                this.$message({
                    message: '请先选择对象',
                    type: 'warning'
                });
                return;
            } else {
                let ids = [];
                this.multipleSelection.forEach(item => {
                    ids.push(item.id)
                })
                this.deleteId = ids;
                // console.log(this.deleteId)
            }
            this.deleteDialog = true;
        },
        handleDelete (row) {
            this.deleteId = row.id;
            this.deleteDialog = true;
        },
        handleDeleteFun () {
            let data = {
                id: this.deleteId
            }
            deleteWorkTemplateList(data).then(res => {
                this.deleteDialog = false;
                console.log('删除成功');
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data();
                }, 1500)
            }).catch(error => {
                this.deleteDialog = false;
                console.log(error + 'error');
            });
        },
        handleSizeChange (val) {
            this.get_params.size = val;
            this.get_data();
        },
        handleCurrentChange (val) {
            this.get_params.page = val;
            this.get_data();
        },
        handleSelectionChange (val) {
            console.log(val);
            this.multipleSelection = val;
        }
    },
    beforeDestroy () {
        if (this.flag) {
            clearTimeout(this.flag);
            this.flag = null;
        }
    }
}
</script>

<style lang="scss" scoped>
.tab-button {
    height: 30px;
    margin-bottom: 2px;
    
    & div {
        width: 80px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        margin-right: 10px;
        cursor: pointer;
        border: 1px solid #76dee2;
        border-radius: 2px;
        background: url("../assets/img/tab_btn.jpg") 100% 100% no-repeat;
        color: #fff;
        box-sizing: border-box;
        font-size: 14px;
        
        &.tab-active {
            background: url("../assets/img/tab_active.jpg") 100% 100% no-repeat;
        }
    }
}
.el-input.ips {
    display: block;
    width: 100%;
}
.el-link {
    cursor: pointer;
}
.drawer-pad {
    padding: 0 20px;
}
.domain-add {
    line-height: 1;
    position: relative;
    padding: 0 20px;
    color: #1cd7fa;
    
    .el-button {
        position: absolute;
        right: 20px;
        top: 0;
        padding: 0;
        color: #1cd7fa;
    }
}
.domain-list {
    background: rgba(0, 0, 0, .3);
    margin: 3px 0 20px;
    padding: 20px 0 1px;
    
    .list-tit {
        width: 100px;
        text-align: right;
    }
    
    .ub {
        margin-bottom: 20px;
    }
    
    .list-btn {
        padding-left: 20px;
        
        .el-button {
            color: #F56C6C;
        }
    }
}
.event >>> .el-range-input {
    background-color: rgba(0, 0, 0, 0);
    color: #fff;
}
.event >>> .el-range-separator {
    color: #fff;
}
.event >>> .el-radio {
    margin: 0 150px 0 30px;
}
.event >>> .el-form-item__label {
    padding: 0;
}
.event >>> .el-upload-list__item-name {
    color: #01E9FF;
    
    i {
        color: #01E9FF;
    }
}
.switch-wrapper{
    width:56px;
    height:20px;
    position: relative;
    cursor: pointer;
    margin-left: 10px;
}
.switch-wrapper>div:nth-child(1){
    width:56px;
    height:20px;
    background-color: #001a2c;
    box-shadow: inset 0px 0px 7px 0px #000000;
    border-radius: 14px;
    div{
        font-size: 12px;
        line-height: 20px;
        padding:0 8px;
    }
    >div:nth-child(1){
        color: #00d7ff;
        opacity: 0.6;
    }
    >div:nth-child(2){
        color: #ffaa47;
        opacity: 0.6;
    }
}
.switch-wrapper>div:nth-child(2){
    width: 20px;
    height: 20px;
    position: absolute;
    left:0;
    top:50%;
    margin-top: -10px;
    border-radius:100%;
}
.switch-wrapper.yes>div:nth-child(2){
    animation: moveone 0s linear forwards;
}
.switch-wrapper.no>div:nth-child(2){
    animation: _moveone 0s linear forwards;
}
@keyframes moveone {
    0% {
        background-color: #fa941c;
        box-shadow: 0px 0px 6px 0px #9c5603;
        left: 0;
    }
    
    100% {
        background-color: #1cd7fa;
        box-shadow: 0px 0px 6px 0px #058fa9;
        left: 36px;
    }
}
@-weblit-keyframes moveone {
    0% {
        background-color: #fa941c;
        box-shadow: 0px 0px 6px 0px #9c5603;
        left: 0;
    }
    
    100% {
        background-color: #1cd7fa;
        box-shadow: 0px 0px 6px 0px #058fa9;
        left: 36px;
    }
}
@keyframes _moveone {
    0% {
        background-color: #1cd7fa;
        box-shadow: 0px 0px 6px 0px #058fa9;
        left: 36px;
    }
    
    100% {
        background-color: #fa941c;
        box-shadow: 0px 0px 6px 0px #9c5603;
        left: 0;;
    }
}
@-weblit-keyframes _moveone {
    0% {
        background-color: #1cd7fa;
        box-shadow: 0px 0px 6px 0px #058fa9;
        left: 36px;
    }
    
    100% {
        background-color: #fa941c;
        box-shadow: 0px 0px 6px 0px #9c5603;
        left: 0;
    }
}
.attendance-list.table-area {
    min-height: 717px !important;
}
.event >>> .drawer-content {
    .box-title {
        color: #00e9ff;
        font-size: 14px;
        margin: 30px 0 20px;
    }
    .label {
        width: 60px;
        font-size: 12px;
        color: #999;
        text-align: right;
        margin-right: 15px;
    }
    .label-val {
        font-size: 12px;
        color: #fff;
        img {
            max-width: 300px;
        }
    }
}
.event >>> .condition-box {
    .part-condition {
        margin-bottom: 10px;
    }
    .condition_black {
        font-size: 12px;
        color: #999;
        margin-right: 6px;
    }
    .condition_white {
        font-size: 12px;
        color: #fff;
        margin-right: 6px;
    }
}
.event >>> .warn-wrapper {
    width: 640px;
    padding-left: 10px;
    box-sizing: border-box;
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
.event >>> .pic-wrapper {
    height: calc(100vh - 190px);
    width: 99%;
    overflow: auto;
    border: 1px solid #1cd7fa;
}
</style>
<style>
.nav-tips {
    pointer-events: none !important;
}
</style>
