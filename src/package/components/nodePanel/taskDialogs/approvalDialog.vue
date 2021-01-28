<template>
	<div>
		<el-dialog :title="title" :visible.sync="dialogVisible" width="700px" :close-on-click-modal="false"
		 :close-on-press-escape="false" :show-close="false" @closed="$emit('close')" custom-class="attendance-dialog">
			<div class="ub w100" style="height:300px;">
				<div class="ub ub-ver left-list">
					<div class="tips-title">全部字段</div>
					<div class="w100" style="margin-top: 8px;">
						<div class="ub line1 left-item" :class="{'active':item.isSelected}" v-for="(item,index) in allList" :key="index" @click="selectFun(item)">{{item.name}}</div>
					</div>
				</div>
				<div class="ub ub-f1 ub-ver right-list">
					<div class="tips-title">已选字段</div>
					<div class="w100" style="margin-top: 8px;">
						<div class="ub ub-ac right-item" v-for="(item,index) in selectedList" :key="index">
							<div class="ub ub-f1 line1 right-item-title">{{item.name}}</div>
							<div class="single-option" v-if="type==2">
								<el-radio v-model="item.type" label="1">必填</el-radio>
								<el-radio v-model="item.type" label="0">只读</el-radio>
							</div>
							<div style="color:#ff6060;font-size:12px;margin-left: 10px;" @click="deleteFun(item,index)"><i class="el-icon-close"></i></div>
						</div>
					</div>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<searchBtn title="确 定" @click="changeSet" />
				<div class="cancelBtn" style="margin-left: 10px;" @click="closeDialog">取 消</div>
			</span>
			<!-- <span slot="footer" class="dialog-footer">
				
				<el-button type="primary" size="medium" @click="closeDialog">确 定</el-button>
			</span> -->
		</el-dialog>
	</div>
</template>

<script>
	import mixinPanel from '../../../common/mixinPanel'
	export default {
		mixins: [mixinPanel],
		props: {
			title: {
		    type: String,
		    default: ''
		  },
		  fields: {
		    type: Array,
		    default: () => []
		  },
		  type: {
		    type: Number,
		    default: 1
		  },
		},
		data() {
			return {
				dialogVisible: true,
				showParamDialog: false,
				nowIndex: null,
				formData: {},
				allList:[
					{
						id:1,
						title:'测试1',
						isSelected:false,
					},{
						id:2,
						title:'测试2',
						isSelected:false,
					},{
						id:3,
						title:'测试3',
						isSelected:false,
					},{
						id:4,
						title:'测试4',
						isSelected:false,
					},
				],
				selectedList:[],
			}
		},
		computed: {},
		mounted() {
			this.initData();
		},
		methods: {
			initData(){
				this.selectedList = this.$deepCopy(this.fields);
				console.log('this.selectedList',this.selectedList)
				this.allList = [];
				setTimeout(()=>{
					let alarmList = this.$getsessionStorage('alarmList');
					console.log('alarmList',alarmList)
					if(alarmList){
						alarmList.map(item=>{
							let obj = {};
							obj.field = item.value;
							obj.name = item.label;
							obj.type = '0';
							if(this.selectedList.some(item=>item.field===obj.field)){
								obj.isSelected = true;
							}else{
								obj.isSelected = false;
							}
							
							this.allList.push(obj);
						})
					}
				},10)
				
			},
			changeSet(){
				this.closeDialog();
				this.$emit('getApprovalSet',this.selectedList);
				
			},
			selectFun(item){
				if(item.isSelected){
					return;
				}
				item.isSelected = true;
				this.selectedList.push(item);
			},
			deleteFun(item,index){
				this.selectedList.splice(index,1);
				this.allList = this.allList.map(_item=>{
					if(_item.field===item.field){
						_item.isSelected = false;
					}
					return _item;
				})
			},
			
			closeDialog() {
				//this.updateElement()
				this.dialogVisible = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.flow-containers .el-badge__content.is-fixed {
		top: 18px;
	}
	.left-list{
		width:200px;
		overflow-y:auto;
		background-color: #042135;
		box-shadow: inset 0px 0px 7px 0px #389bf7;
		border-radius: 4px;
		border: solid 1px #1cd7fa;
		padding:10px;
		box-sizing: border-box;
	}
	div.left-list::-webkit-scrollbar,div.right-list::-webkit-scrollbar{
	  width:2px!important;
	}
	.right-list{
		margin-left: 40px;
		overflow-y:auto;
		background-color: #042135;
		box-shadow: inset 0px 0px 7px 0px #389bf7;
		border-radius: 4px;
		border: solid 1px #1cd7fa;
		padding:10px;
		box-sizing: border-box;
	}
	.tips-title{
		font-size: 12px;
		line-height: 15px;
		color: #ffffff;
		opacity: 0.6;
	}
	.left-item{
		width:170px;
		margin: 8px auto;
		line-height: 30px;
		background-color: #0090ff;
		border-radius: 2px;
		text-indent: 5px;
		font-size: 12px;
		color: #ffffff;
		cursor: pointer;
	}
	.right-item{
		width:94%;
		margin: 8px auto;
		cursor: pointer;
	}
	.right-item-title{
		line-height: 30px;
		background-color: #0090ff;
		border-radius: 2px;
		text-indent: 5px;
		font-size: 12px;
		color: #ffffff;
	}
	.left-item.active{
		background-color: #0c3459;
		color: #999999;
	}
	.single-option{
		text-align: center;
		width:200px;
		&>>>.el-radio__label{
			color:#fff;
		}
		&>>>.el-radio__inner{
			border-color:#ccc;
		}
	}
</style>
