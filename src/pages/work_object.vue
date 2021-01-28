<template>
    <div class="event event-wrapper">
        <div class="w100" v-show="!firstShow">
            <div class="ub w100 search-area" style="box-sizing: border-box;">
                <div class="ub event-content w100">
                    <div class="ub ub-ver ub-ac ub-f1">
                        <el-row type="flex" align="middle" class="w100" style="border-radius:0 0 5px 5px;">
                            <el-col :span="6" class="event-btn-col">
                                <el-form :model="get_params">
                                    <el-form-item label="对象名称：" label-width="85px">
                                        <el-input placeholder="请输入" clearable
                                                  v-model="get_params.name" @keyup.enter.native="searchCheck"
                                                  size="small"></el-input>
                                    </el-form-item>
                                </el-form>
                            </el-col>
                            <el-col :span="6" class="event-btn-col">
                                <el-form :model="get_params">
                                    <el-form-item label="对象描述：" label-width="85px">
                                        <el-input placeholder="请输入" clearable
                                                  v-model="get_params.des" @keyup.enter.native="searchCheck"
                                                  size="small"></el-input>
                                    </el-form-item>
                                </el-form>
                            </el-col>
                            <el-col :span="6" class="event-btn-col">
                                <el-form :model="get_params">
                                    <el-form-item label="创建人：" label-width="85px">
                                        <el-input placeholder="请输入" clearable
                                                  v-model="get_params.createUser" @keyup.enter.native="searchCheck"
                                                  size="small"></el-input>
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
                        <addBtn icon="el-icon-plus" title="添加对象" @click="addDialog = true"/>
                        <deleteBtn style="margin-left: 10px;" icon="el-icon-delete" title="刪 除" @click="handleDeleteAll"/>
                    </div>
                </div>
                <el-table ref="multipleTable" v-loading="loading" class='bigTable full-table' :data="tableData" border stripe
                          tooltip-effect="dark"
                          @selection-change="handleSelectionChange">
                    <el-table-column align="center" type="selection" :selectable="(row)=> { return row.type != 0}" width="40"></el-table-column>
                    <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                    </el-table-column>
                    <el-table-column prop="name" label="对象名称" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="des" label="对象描述" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="createUserName" label="创建人"  width="160">
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建日期" width="160">
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="120">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.type == 1" type="text" style="color: #fff584" @click="handleEdit(scope.row)">编 辑</el-button>
                            <el-button v-if="scope.row.type == 1" type="text" style="color: #ff7200" @click="handleDelete(scope.row)">删 除</el-button>
                            <el-button style="color: rgba(255, 255, 255, .5)" v-if="scope.row.type == 0" type="text">内置类型</el-button>
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
        
        <!--增加对象-->
        <el-dialog title="添加对象" :visible.sync="addDialog" width="700px" custom-class="attendance-dialog">
            <el-form :model="addForm" :rules="rules" ref="addForm">
                <el-form-item label="对象名称：" prop="name" :label-width="formLabelWidth">
                    <el-input placeholder="请输入对象名称" clearable v-model="addForm.name" size="small"></el-input>
                </el-form-item>
                <el-form-item label="对象描述：" prop="des" :label-width="formLabelWidth">
                    <el-input type="textarea" :rows="3" placeholder="请输入描述" clearable v-model="addForm.des"
                              size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
				<searchBtn title="确 定" @click="submitForm('addForm')"/>
				<cancle-btn title="取 消" @click="addDialog = false"/>
			</span>
        </el-dialog>
        
        <!--list编辑对象-->
        <el-dialog title="编辑对象" :visible.sync="editDialog" width="700px" custom-class="attendance-dialog">
            <el-form :model="editForm" :rules="rules" ref="editForm">
                <el-form-item label="资源名称：" prop="name" :label-width="formLabelWidth">
                    <el-input placeholder="请输入资源名称" clearable v-model="editForm.name" size="small"></el-input>
                </el-form-item>
                <el-form-item label="对象描述：" :label-width="formLabelWidth">
                    <el-input type="textarea" :rows="3" placeholder="请输入描述" clearable v-model="editForm.des"
                              size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
				<searchBtn title="确 定" @click="submitFormEdit('editForm')"/>
				<cancle-btn title="取 消" @click="editDialog = false"/>
			</span>
        </el-dialog>
        <!--删除资源-->
        <el-dialog title="删除资源" :visible.sync="deleteDialog" width="30%" custom-class="attendance-dialog">
            <span>确定删除吗？</span>
            <span slot="footer" class="dialog-footer">
				<searchBtn title="确 定" @click="handleDeleteFun"/>
				<cancle-btn title="取 消" @click="deleteDialog = false"/>
			</span>
        </el-dialog>
    </div>
</template>

<script>
import {
    getWorkObject,
    saveWorkObject,
    deleteWorkObject
} from '../server/define.js'

export default {
    name: 'work_object',
    data () {
        return {
            fileList: [],
            data_id: '',
            editItemDialog: false,
            file_num: 0,
            
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
                des: '',
                createUser: '',
                createTime: ''
                // content: "",
                // desc: "",
                // template: "",
                // creater: '',
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
        this.$nextTick(() => {
            this.get_data();
        })
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
        indexMethod (index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1;
        },
        indexInnerMethod (index) {
            return (this.get_inner_params.page - 1) * this.get_inner_params.size + index + 1;
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
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    name: this.get_params.name,
                    des: this.get_params.des,
                    createUser: this.get_params.createUser,
                    beginTime: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[0] : '',
                    endTime: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[1] : '',
                }
            }
            console.log(data)
            getWorkObject(data).then(res => {
                console.log('getList', res);
                this.loading = false;
                this.total_num = res.totalElements;
                let list = res.content;
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {};
                        obj.id = item.id;
                        obj.name = item.name;
                        obj.des = item.des ? item.des : '--';
                        obj.type = item.type;
                        obj.createTime = item.createTime;
                        obj.createUser = item.createUser ? item.createUser : '--';
                        obj.createUserName = item.createUserName ? item.createUserName : '--' ;
                        this.tableData.push(obj);
                    })
                }
            }).catch(error => {
                this.loading = false;
                console.log('error' + error);
            })
        },
        handleEdit (row) {
            this.editForm.id = row.id;
            this.editForm.name = row.name;
            this.editForm.des = row.des;
            this.editDialog = true;
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
            this.deleteId = [`${row.id}`];
            this.deleteDialog = true;
        },
        handleDeleteFun () {
            let data = {
                ids: this.deleteId
            }
            deleteWorkObject(data).then(res => {
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
        
        submitForm (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        // id: this.addForm.id,
                        name: this.addForm.name,
                        des: this.addForm.des
                    }
                    saveWorkObject(data).then(res => {
                        this.addDialog = false;
                        console.log('添加成功');
                        this.$message({
                            message: '添加成功',
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
        submitFormEdit (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        id: this.editForm.id,
                        name: this.editForm.name,
                        des: this.editForm.des
                    }
                    saveWorkObject(data).then(res => {
                        this.editDialog = false;
                        console.log('编辑成功');
                        this.$message({
                            message: '编辑成功',
                            type: 'success'
                        })
                        setTimeout(() => {
                            this.get_data();
                        }, 1500)
                    }).catch(error => {
                        this.editDialog = false;
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
    }
}
</script>

<style lang="scss" scoped>
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
</style>
