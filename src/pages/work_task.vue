<template>
    <div class="event event-wrapper">
        <div class="w100">
            <div class="tab-button ub">
                <div class="draft-btn" @click="tabClick('1')" :class="{'tab-active': currentTab === '1'}">待办工单</div>
                <div class="draft-btn" @click="tabClick('2')" :class="{'tab-active': currentTab === '2'}">已办工单</div>
                <div class="draft-btn" @click="tabClick('3')" :class="{'tab-active': currentTab === '3'}">发起工单</div>
            </div>
            <div class="ub w100 search-area" style="box-sizing: border-box;">
                <div class="ub event-content w100">
                    <div class="ub ub-ver ub-ac ub-f1">
                        <el-row type="flex" align="middle" class="w100" style="border-radius:0 0 5px 5px;">
                            <el-col :span="7" class="event-btn-col">
                                <el-form :model="get_params">
                                    <el-form-item label="工单名称：" label-width="85px">
                                        <el-input placeholder="请输入" clearable
                                                  v-model.trim="get_params.workOrderName" @keyup.enter.native="searchCheck"
                                                  size="small"></el-input>
                                    </el-form-item>
                                </el-form>
                            </el-col>
                            <el-col :span="7" class="event-btn-col">
                                <el-form :model="get_params">
                                    <el-form-item label="工单类型：" label-width="85px">
                                        <el-select filterable clearable v-model="get_params.workOrderObject" size="small" style="width: 100%" placeholder="请选择">
                                            <el-option v-for="(item, index) in workTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-form>
                            </el-col>
                            <el-col :span="7" class="event-btn-col">
                                <el-form :model="get_params">
                                    <el-form-item label="优先级：" label-width="85px">
                                        <el-select placeholder="请选择"
                                                   clearable
                                                  v-model="get_params.level"
                                                  size="small">
                                            <el-option label="高" value="1"></el-option>
                                            <el-option label="中" value="2"></el-option>
                                            <el-option label="低" value="3"></el-option>
                                        </el-select>
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
                        <addBtn v-if="currentTab == 3" icon="el-icon-plus" title="发起工单" @click="handleAddTemplate"/>
                        <!--<addBtn style="margin-left: 10px;" icon="el-icon-edit-outline" title="自定义表头"/>-->
                    </div>
                </div>
                <el-table ref="multipleTable" v-loading="loading" class='bigTable full-table' :data="tableData" border stripe
                          tooltip-effect="dark"
                          @selection-change="handleSelectionChange">
                    <!--<el-table-column type="selection" width="40"></el-table-column>-->
                    <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                    </el-table-column>
                    <el-table-column prop="workOrderId" label="工单编号" width="160">
                    </el-table-column>
                    <el-table-column prop="workOrderName" label="工单名称" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="workMouldName" label="工单模板" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="level" label="优先级" width="80" align="center" sortable>
                        <template slot-scope="{row}">
                            <span v-if="row.level == 1" style="color: #ff0000">高</span>
                            <span v-if="row.level == 2" style="color: #fff76c">中</span>
                            <span v-if="row.level == 3" style="color: #6cfeff">低</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="workOrderObjectName" label="工单类型" width="100" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="status" label="工单状态" width="80" align="center">
                        <template slot-scope="{row}">
                            <span v-if="row.status == 0" style="color: #ff3a3a">已撤销</span>
                            <span v-if="row.status == 1" style="color: #00ff00">进行中</span>
                            <span v-if="row.status == 2" style="color: #00c0ff">已完成</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="runningNodeName" label="当前节点" width="140" show-overflow-tooltip>
                        <template slot-scope="{row}">
                            <span v-if="row.runningNodeName.length">{{row.runningNodeName.join(',')}}</span>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="currentTab == 1" key="abc" prop="createUserCN" label="当前节点状态"  width="100">
                        <template slot-scope="{row}">
                            <div v-if="row.status==1&&((row.currentTime <= row.outTime) || !row.outTime)" class="ub ub-ac work-state one">
                                <div></div>
                                <div>待处理</div>
                            </div>
                            <div v-if="row.status==1&&(row.currentTime > row.outTime)" class="ub ub-ac work-state two">
                                <div></div>
                                <div>已超时</div>
                            </div>
                            <div v-if="row.status==2" class="ub ub-ac work-state three">
                                <div></div>
                                <div>已完成</div>
                            </div>
                            <div v-if="row.status==0" class="ub ub-ac work-state four">
                                <div></div>
                                <div>已撤销</div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="currentTab != 3" key="bcd" prop="receiveTime" label="接收时间" width="160">
                    </el-table-column>
                    <el-table-column prop="createUser" label="创建人" width="80">
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="160">
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="190">
                        <template slot-scope="scope">
                            <el-button type="text" @click="seeWorkImg(scope.row)">流程图</el-button>
                            <el-button style="margin: 0 10px" type="text" @click="handleSee(scope.row)">查 看</el-button>
                            <el-dropdown trigger="click" v-if="currentTab == 3 && scope.row.status != 0">
							<span class="el-dropdown-link active" style="cursor: pointer;">
								更多操作<i class="el-icon-arrow-down el-icon--right access active"></i>
							</span>
                                <el-dropdown-menu slot="dropdown" style="width: 80px !important;">
                                    <el-dropdown-item v-if="scope.row.status == 1" @click.native="urgeWork(scope.row)">催办</el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.status == 1" @click.native="revertWork(scope.row)">撤销</el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.status == 2" @click.native="handleDelete(scope.row)">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
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
    
        <el-drawer :visible.sync="seeDialog" direction="rtl" size="850px">
            <div class="drawer-content">
                <div style="position: absolute;left:0;top:0;width:100%;height:100%;overflow-y: auto;padding:20px;box-sizing: border-box;">
                    <div class="ub ub-pj w100">
                        <div class="list-tips">
                            {{'流程信息'}}
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
                            :xml="seeForm.mouldInfo.xml"
                            :users="users"
                            :workStatus="workStatus"
                            :currentWorkIds="currentWorkIds"
                            :groups="groups"
                            :categorys="categorys"
                            :is-view="false"
                        />
                    </div>
                </div>
            </div>
        </el-drawer>
        
        <!--增加对象-->
        <el-dialog title="发起工单" :visible.sync="addDialog" width="700px" custom-class="attendance-dialog">
            <el-form :model="addForm" :rules="rules" ref="addForm" label-position="right">
                <el-form-item label="工单名称：" prop="workOrderName" :label-width="formLabelWidth">
                    <el-input placeholder="请输入工单名称" clearable v-model="addForm.workOrderName" size="small"></el-input>
                </el-form-item>
                <el-form-item label="优先级：" prop="level" :label-width="formLabelWidth">
                    <el-select placeholder="请选择"
                               style="width: 100%;"
                               v-model="addForm.level"
                               size="small">
                        <el-option label="高" value="1"></el-option>
                        <el-option label="中" value="2"></el-option>
                        <el-option label="低" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工单模板：" prop="workMouldId" :label-width="formLabelWidth">
                    <el-select placeholder="请选择"
                               style="width: 100%;"
                               v-model="addForm.workMouldId"
                               size="small">
                        <el-option v-for="(item,index) in allTemplate" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <!--<el-form-item label="工单描述：" style="width: 99%;" prop="des" size="small">
                    <UEditor :defaultMsg="defaultMsg" :config="config" :id="ue1" ref="myUEditor1"></UEditor>
                </el-form-item>
                <el-form-item label="人员范围：" prop="users" label-width="90px" class="red-star">
                    <dropdown-box v-if="addDialog" ref="field"
                                  :usersList="allUserList"
                                  :depList="allDepList"
                                  :rolesList="allRolesList"
                                  :usersShow="[]"
                                  :dataList="dataList"
                                  @confirmData="confirmData"
                    ></dropdown-box>
                    <span v-if="personFlag" class="red-warn warn-person">请选择人员</span>
                </el-form-item>-->
            </el-form>
            <span slot="footer" class="dialog-footer">
				<searchBtn title="确 定" @click="submitForm('addForm')"/>
				<cancle-btn title="取 消" @click="addDialog = false"/>
			</span>
        </el-dialog>
        
        <!--删除资源-->
        <el-dialog title="删除工单" :visible.sync="deleteDialog" width="30%" custom-class="attendance-dialog">
            <span>确定删除吗？</span>
            <span slot="footer" class="dialog-footer">
				<searchBtn title="确 定" @click="handleDeleteFun"/>
				<cancle-btn title="取 消" @click="deleteDialog = false"/>
			</span>
        </el-dialog>
    </div>
</template>

<script>
import UEditor from './ueditor.vue'
import dropdownBox from "./workFlow/workComponents/dropdownBox";
import insertFields from "./workFlow/workComponents/insertFields";
import bpmnModeler from '../package/detailXml'
import axios from 'axios';
import {
    get_workTask,
    get_workObject,
    getAllUsers,
    getAllRoles,
    getAllDep,
    get_workTemplate,
    add_workTask,
    urge_workTask,
    revert_workTask,
    delete_workTask
} from '../server/define.js'
import {
    get_selested_all_fileds,
    get_condition,
    get_leak_fileds,
    get_one_work
} from '../server/api.js'

export default {
    name: 'work_object',
    components: {
        UEditor,
        dropdownBox,
        bpmnModeler
    },
    data () {
        return {
            config: {
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
                autoHeightEnabled: false,
                autoFloatEnabled: false,
                //是否工具栏可浮动
                initialContent: '请输入内容', //初始化编辑器的内容,也可以通过textarea/script给值，看官网例子
                autoClearinitialContent: true, //是否自动清除编辑器初始内容，注意：如果focus属性设置为true,这个也为真，那么编辑器一上来就会触发导致初始化的内容看不到了
                initialFrameWidth: '100%',
                initialFrameHeight: 450,
                BaseUrl: '',
                zIndex: 100,
                UEDITOR_HOME_URL: 'static/ueditor/',
            },
            defaultMsg: '',
            ue1: "ue1", // 不同编辑器必须不同的id
            count: 0,
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
            
            currentTab: '1',
            that: this,
            seeActive: 'first',
            seeDialog: false,
            seeForm: {},
            workTypeList: [], // 工单类型
            flag: null,
            config_id: '',
            addDialog: false,
            addForm: {
                workOrderName: '',
                workMouldId: '',
                level: '',
                workOrderContent: ''
            },
            allUserList: [], // 所有人
            allDepList: [], // 所有部门
            allRolesList: [], // 所有角色
            sendObjectList: [], // 工单发起对象
            allTemplate: [], // 当前登录人可用的模板
            alarmList: [], // 告警字段
            conditionList: [], //条件字段
            leakList: [], // 漏洞字段
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
            rules: {
                workOrderName: [{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }],
                level: [{
                    required: true,
                    message: '请选择优先级',
                    trigger: 'change'
                }],
                workMouldId: [{
                    required: true,
                    message: '请选择工单模板',
                    trigger: 'change'
                }]
            },
            workStatus: false,
            currentWorkIds: [],
            deleteDialog: false,
            personFlag: false,
            deleteId: '',
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
                workOrderObject: '',
                workOrderName: '',
                level: '',
                type: '1'
            },
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
		
        this.init();
		
        if (this.$getsessionStorage('currentTab')) {
            this.currentTab = this.get_params.type = this.$getsessionStorage('currentTab');
            this.$removesessionStorage('currentTab')
        }
        this.$nextTick(() => {
            this.get_data();
        })
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
    methods: {
		handleSee(row){
			this.$setsessionStorage('currentTab',this.currentTab);
			this.$setsessionStorage('workTaskInfo',row);
			this.$router.push({
				name:'work_task_detail'
			})
		},
        seeWorkImg(row) {
		    this.workStatus = row.status ==2;
		    let obj = {
                workMouldId: row.workMouldId,
                processInstanceId: row.processInstanceId,
            }
            get_one_work(obj).then(res=> {
                console.log(res, '查看数据')
                this.seeDialog = true;
                this.seeForm = res;
                this.currentWorkIds = this.seeForm.mouldInfo.running
            }).catch(err => {
                console.log(err + 'err')
            })
            console.log(this.seeForm)
        },
        getWorkFields () {
            axios.all([get_selested_all_fileds({}), get_condition({}), get_leak_fileds({})]).then(axios.spread((alarm, condition, leak) => {
                console.log(alarm, condition, leak)
                this.alarmList = alarm;
                this.conditionList = condition;
                this.leakList = leak;
            }));
        },
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
        indexMethod (index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1;
        },
        indexInnerMethod (index) {
            return (this.get_inner_params.page - 1) * this.get_inner_params.size + index + 1;
        },
        tabClick (val='1') {
            this.currentTab = val;
            val === '1' && (this.get_params.type = 1);
            val === '2' && (this.get_params.type = 2);
            val === '3' && (this.get_params.type = 3);
            this.get_data();
        },
        handleAddTemplate () {
            this.addDialog = true;
        },
        
        searchCheck () {
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
                    pageSize: this.get_params.size
                },
                paramsData: {
                    type: this.get_params.type,
                    workOrderObject: this.get_params.workOrderObject,
                    workOrderName: this.get_params.workOrderName,
                    level: this.get_params.level,
                    // startTime: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[0] : '',
                    // endTime: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[1] : '',
                }
            }
            get_workTask(data).then(res => {
                console.log('任务列表', res);
                this.loading = false;
                if (this.config_id !== uid) {
                    return;
                }
                this.total_num = res.totalElements;
                let list = res.content;
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {};
                        obj.createTime = item.createTime;
                        obj.createUser = item.createUser;
                        obj.deploymentId = item.deploymentId;
						obj.outTime = item.outTime;
						obj.status = item.status;
						obj.currentTime = item.currentTime;
						obj.currentNodeStatus = '';
						obj.workMouldName = item.workMouldName ? item.workMouldName :'--';
						obj.workMouldId = item.workMouldId;
						obj.nodeIds = item.nodeIds;
						let _outTime = new Date(item.outTime).getTime();
						let _currentTime = new Date(item.currentTime).getTime();
						if(item.status==1){
							obj.currentNodeStatus = _currentTime>_outTime?'已超时':'待处理';
						}else if(item.status==0){
							obj.currentNodeStatus = '已撤销';
						}else if(item.status==2){
							obj.currentNodeStatus = '已完成';
						}
						
						obj.nodeDes = item.nodeDes;
						obj.dealType = item.dealType;
						obj.operation = item.operation;
						if(item.disposeData){
							obj.disposeData =this.$deepCopy(item.disposeData);
						}
						if(item.fields){
							obj.fields = item.fields;
						}
						
						obj.players = item.players;
						obj.approveOpinion = item.approveOpinion;
						obj.approve = item.approve;
						obj.nodeId = item.nodeId;
						obj.level = item.level;
                        obj.processInstanceId = item.processInstanceId;
                        obj.receiveTime = item.receiveTime ? item.receiveTime: '--';
                        obj.runningNodeName = item.runningNodeName;
                        obj.sourceId = item.sourceId;
                        
                        obj.taskId = item.taskId;
                        obj.workOrderContent = item.workOrderContent;
                        obj.workOrderId = item.workOrderId;
						obj.workOrderObject = item.workOrderObject;
						obj.workOrderName = item.workOrderName;
                        obj.workOrderObjectName = item.workOrderObjectName;
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
            this.get_dep();
            this.get_roles();
            this.get_users();
            this.get_workMound();
            this.getWorkFields();
        },
        get_sendObject() {
            get_workObject({}).then(res => {
                console.log('工单发起对象', res)
                this.workTypeList = res;
            }).catch(err => {
                console.log(err, 'err')
            })
        },
        get_workMound() {
            get_workTemplate({}).then(res => {
                console.log('可用工单模板', res)
                this.allTemplate = res;
            }).catch(err => {
                console.log(err, 'err')
            })
        },
        get_users() {
            getAllUsers({}).then(res => {
                console.log('所有人员', res)
                res.forEach(item => {
                    item.type = '0'
                })
                this.allUserList = res;
            }).catch(err => {
                console.log(err, 'err')
            })
        },
        get_roles() {
            getAllRoles({}).then(res => {
                console.log('所有角色', res)
                res.forEach(item => {
                    item.type = '2'
                })
                this.allRolesList = res;
            }).catch(err => {
                console.log(err, 'err')
            })
        },
        get_dep() {
            getAllDep({}).then(res => {
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
        confirmData (val) {
            val = val.length ? val : [];
            let type0 = [];
            let type1 = [];
            let type2 = [];
            let type3 = [],type4;
            //this.formData.endEventObj.users = [];
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
            // type0.length && this.formData.endEventObj.users.push({userType: '0', ids: type0});
            // type1.length && this.formData.endEventObj.users.push({userType: '1', ids: type1});
            // type2.length && this.formData.endEventObj.users.push({userType: '2', ids: type2});
            // type3.length && this.formData.endEventObj.users.push({userType: '3', ids: type3});
            // type4 && this.formData.endEventObj.users.push({userType: '4'});
            //console.log(this.formData.endEventObj.users, '提醒人列表')
        },
        urgeWork (row) {
		    let data = {
                workOrderName: row.workOrderName,
                workOrderId: row.workOrderId,
                userIds: row.userIds,
                nodeIds: row.nodeIds
            }
            urge_workTask(data).then(res => {
                this.$message({
                    message: '催办成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data();
                }, 1500)
            }).catch(error => {
                console.log(error + 'error');
            })
        },
        revertWork (row) {
            let data = {
                processInstanceId: row.processInstanceId,
                workOrderId: row.workOrderId,
            }
            revert_workTask(data).then(res => {
                this.$message({
                    message: '撤销成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data();
                }, 1500)
            }).catch(error => {
                console.log(error + 'error');
            })
        },
        handleDelete (row) {
            this.deleteId = [`${row.workOrderId}`];
            this.deleteDialog = true;
        },
        handleDeleteFun () {
            let data = {
                workOrderIds: this.deleteId,
            }
            delete_workTask(data).then(res => {
                this.deleteDialog = false;
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
            })
        },
        
        submitForm (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        workOrderName: this.addForm.workOrderName,
                        level: this.addForm.level,
                        workMouldId: this.addForm.workMouldId,
                    }
                    add_workTask(data).then(res => {
                        this.addDialog = false;
                        console.log('发起工单成功');
                        this.$message({
                            message: '发起工单成功',
                            type: 'success'
                        })
                        setTimeout(() => {
                            this.get_data();
                        }, 1500)
                    }).catch(error => {
                        this.addDialog = false;
                        console.log(error + 'error');
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
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
.attendance-list.table-area {
    min-height: 717px !important;
}
.event>>>.edui-editor-iframeholder {
    height: 200px !important;
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
.nav-tips {
    pointer-events: none !important;
}
/*下拉菜单*/
.el-dropdown-link.active {
    font-size: 12px;
    color:#409EFF ;
}
.el-dropdown-menu__item {
    padding: 0 20px !important;
}
</style>
