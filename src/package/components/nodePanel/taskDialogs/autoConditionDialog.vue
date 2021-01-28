<template>
	<div>
		<el-dialog title="条件设置" :visible.sync="dialogVisible" width="650px" :close-on-click-modal="false"
		 :close-on-press-escape="false" :show-close="false" @closed="$emit('close')" custom-class="attendance-dialog">
			<div class="w100" style="mini-height:300px;">
				<el-form :model="formData" :inline="true" class="unit w100">
					<div class="group" v-for="(group,index) in formData.group" :key="index">
						<div class="w100">
							<div class="ub w100">
								<div class="ub ub-ac ub-pc" style='width:80px;'>AND</div>
								<div class="ub ub-ver ub-f1">
									<div class="ub ub-ac ub-f1" v-for="(item,_index) in group.and" :key="_index">
										<div>
											<el-form-item label-width="0px">
												<el-select style="width:150px;" size="mini" v-model="item.field" placeholder="请选择字段" @change="changeFiled(item)">
													<el-option v-for="(filed,filedIndex) in fields" :key="filed.value" :label="filed.label" :value="filed.value"></el-option>
												</el-select>
											</el-form-item>
										</div>
										<div>
											<el-form-item label-width="0px">
												<el-select style="width:150px;" size="mini" v-model="item.condition" placeholder="请选择">
													<el-option v-for="(relationship,relationshipIndex) in relationships" :key="relationshipIndex" :label="relationship.label"
													 :value="relationship.value"></el-option>
												</el-select>
											</el-form-item>
										</div>
										<!-- <div 
										 v-if="['告警时间', '接收时间'].includes(item.field)"
										>
											<el-form-item label-width="0px">
												 <el-date-picker
													style="width:150px;"
													 size="mini"
												      v-model="item.val"
												      type="datetime"
													  value-format="timestamp"
												      placeholder="选择日期时间">
												    </el-date-picker>
											</el-form-item>
										</div> -->
										<!-- v-else -->
										<div>
											<el-form-item label-width="0px">
												<el-input style="width:150px;" placeholder="请输入" clearable v-model.trim="item.val" size="mini"></el-input>
											</el-form-item>
										</div>

										<div class="close-box" v-if="_index>0" @click="deleteCon(group.and,_index)">
											<i class="el-icon-close"></i>
										</div>
										<div class="close-box" v-else></div>
									</div>
								</div>
							</div>
							<div class="addbtn">
								<el-button size="mini" type="text" icon="el-icon-plus" @click="addFun(group.and)">添加条件</el-button>
								<el-button v-if="index>0" size="mini" type="text" icon="el-icon-close" @click="deleteGroupFun(formData.group,index)">删除组</el-button>
							</div>
						</div>
						<el-divider class="condition" v-if="index>=0&&index<formData.group.length-1">OR</el-divider>

					</div>

					<el-divider></el-divider>
					<div class="ub ub-pj ub-ac" style="width:98%;box-sizing: border-box;margin: 30px auto 0;">
						<div>
							<el-button size="mini" type="text" icon="el-icon-plus" @click="addGroupFun(formData.group)">添加组</el-button>
						</div>
					</div>
				</el-form>
			</div>

			<span slot="footer" class="dialog-footer">
				<searchBtn title="确 定" @click="saveData" />
				<div class="cancelBtn" style="margin-left: 10px;" @click="closeDialog">取 消</div>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import mixinPanel from '../../../common/mixinPanel'
	import {
		get_selested_all_fileds,
		get_condition
	} from '../../../../server/api.js'
	export default {
		mixins: [mixinPanel],
		components: {
			//dropdownBox
		},
		props: {
			condition: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				dialogVisible: true,
				showParamDialog: false,
				nowIndex: null,
				relationships: [],
				fields: [],
				formData: {
					group: [{
						and: [{
							field: '',
							condition: '',
							val: '',
						}, ],
					}]
				},



			}
		},

		mounted() {
			this.formData.group = this.$deepCopy(this.condition.length == 0 ? [{
				and: [{
					field: '',
					condition: '',
					val: '',
				}, ],
			}] : this.condition);
			console.log('this.formData.selectedList1111111', this.formData.group)
			this.$nextTick(() => {
				this.initCanSelectedFileds();
				this.initCondition();
			})
		},
		methods: {
			saveData() {
				let groups = [];
				this.formData.group.map(item => {
					let obj = {};
					obj.and = [];
					item.and.map(_item => {
						let _obj = {};
						_obj.fieldName = this.fields.filter(itm => itm.value === _item.field)[0].label;
						_obj.conditionName = this.relationships.filter(itm => itm.value === _item.condition)[0].label;
						_obj.val = _item.val;
						obj.and.push(_obj)
					})
					groups.push(obj)
				})
				console.log(1111111, this.formData.group)
				console.log(222222222, groups)
				let obj = {
					data1: this.formData.group,
					data2: groups
				}
				this.$emit('getCondition', obj);
				console.log('this.formData', this.formData.group)
				this.closeDialog();
			},
			changeFiled(item) {
				console.log(item)
				item.val = '';
			},
			deleteCon(and, _index) {
				and.splice(_index, 1);
			},
			addFun(and) {
				and.push({
					field: '',
					condition: '',
					val: '',
				})
			},
			addGroupFun(group) {
				group.push({
					and: [{
						field: '',
						condition: '',
						val: '',
					}, ],
				})
			},
			deleteGroupFun(group, index) {
				group.splice(index, 1);
			},
			initCanSelectedFileds() {
				this.fields = [];
				let data = {
					queryData: {},
					paramsData: {},
				}
				get_selested_all_fileds(data).then(res => {
					console.log('可选字段', res)
					if (res.length > 0) {
						res.forEach(item => {
							let obj = {};
							obj.value = item.value;
							obj.label = item.label;

							this.fields.push(obj);
						})
					}
				}).catch(error => {
					console.log('error' + error);
				})
			},
			initCondition() {
				this.relationships = [];
				let data = {
					queryData: {},
					paramsData: {},
				}
				get_condition(data).then(res => {
					console.log('条件', res)
					if (res.length > 0) {
						res.forEach(item => {
							let obj = {};
							obj.value = item.value;
							obj.label = item.name;

							this.relationships.push(obj);
						})
					}
				}).catch(error => {
					console.log('error' + error);
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

	.close-btn {
		cursor: pointer;
		font-size: 16px;
		color: #ff6060;
	}

	.condition {
		opacity: 1 !important;
		background-color: rgba(28, 215, 250, .5) !important;

		&>>>.el-divider__text {
			background-color: rgb(4, 33, 54);
			color: #fff;
		}
	}

	.close-box {
		width: 26px;
		// height: 100%;
		color: #1cd7fa;
		text-align: center;
		line-height: 26px;
		cursor: pointer;
	}
</style>
