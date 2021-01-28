<template>
	<div class="event event-wrapper add_template">
		<div class="event-content w100" v-loading="loading">
			<div class="ub w100 relative">
				<div class="list-tips">新建模板</div>
				<div class="ub" style="margin-left: 20px">
					<el-steps :space="100" :active="activeStep">
					  <el-step><i class="step1 step1Finish" slot="icon">工单基本信息</i></el-step>
					  <el-step><i class="step2 step2Active" slot="icon">配置流程信息</i></el-step>
					</el-steps>
				</div>
				<div class="btn-wrap" style="font-size: 0">
					<cancle-btn title="取 消" @click="cancel"></cancle-btn>
					<cancle-btn title="上一步" @click="goBack"></cancle-btn>
                    <!--<Debounce :time='1500' :isDebounce="2">
					    <search-btn title="保存至草稿" style="margin: 0 10px" @click.native="finish(0)"></search-btn>
                    </Debounce>
                    <Debounce :time='1500' :isDebounce="2">
					    <search-btn title="完成提交" @click.native="finish(1)"></search-btn>
                    </Debounce>-->
				</div>
			</div>
			<div class="w100 pic-wrapper" style="color: #fff;">
				<bpmn-modeler
				  ref="refNode"
				  :xml="xml"
				  :users="users"
				  :groups="groups"
				  :categorys="categorys"
				  :is-view="false"
				  @getNewXMLInFo="getNewXMLInFo"
				  @save="saveModeler"
				/>
			</div>
		</div>
	</div>
</template>

<script>
    import {
        saveWorkTemplate
    } from '../../server/define.js'
	import bpmnModeler from '../../package/index'
	import { xmlStr } from './xmlData.js'
	export default {
		name: 'work_config',
		components: {
		  bpmnModeler
		},
		data() {
			return {
				loading: false,
				activeStep: 0,
				formData: {
					name: '',
                    xml: '',
				},
				xml: '', // 后端查询到的xml
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
                ]
			}
		},

		mounted() {
			console.log(this.$route);
			if(this.$route.query.id) {
				// this.formData.id = this.$route.query.id;
			}
            this.getModelDetail()
		},
		computed: {
		},
		methods: {
			getNewXMLInFo({xml,name}){
				this.formData.xml = xml;
				this.formData.name = name;
				console.log('this.formData',this.formData)
			},
		    cancel() {
			    this.$router.push('/home/work_template')
            },
		    goBack() {
		        this.$router.push('/home/work_template/work_base?record=1')
            },
            finish(val) {
                let record_baseForm = this.$getsessionStorage('baseForm');
                console.log(record_baseForm, 'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqq')
                record_baseForm.status = val;
                record_baseForm.xml = this.formData.xml;
                record_baseForm.xmlName = this.formData.name;
				let data = {
					queryData:{},
					paramsData:record_baseForm,
				}
				saveWorkTemplate(data).then(res=>{
					console.log(res)
					this.$message({
					  message:'提交成功',
					  type:'success'
					})
                    setTimeout(() => {
                        this.cancel();
                    }, 1500)
				}).catch(error=>{
					console.log(error)
				})
            },
			getModelDetail() {
                let record_baseForm = this.$getsessionStorage('baseForm');
                if (record_baseForm.xml) {
                    this.xml = record_baseForm.xml
                } else {
                    this.xml = xmlStr;
                }
				this.formData.name = record_baseForm.xmlName ?? '';
			  // fetch('https://cdn.jsdelivr.net/gh/goldsubmarine/workflow-bpmn-modeler@master/src/Leave.bpmn20.xml')
			  //   .then(response => {
			  //     return response.text()
			  //   }).then(xml => {
			  //     this.xml = xml
			  //   })
			},
			saveModeler(data) {
			  console.log(data)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.event-content{
		background-color: rgba(17, 29, 43, 1);
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
	.pic-wrapper {
		height: calc(100vh - 190px);
		overflow: auto;
        border: 1px solid #00e9ff;
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
</style>
