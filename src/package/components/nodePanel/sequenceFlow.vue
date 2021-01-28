<template>
  <div>
    <x-form ref="xForm" v-model="formData" :config="formConfig">
		<template #line1>
		 <el-divider></el-divider>
		</template>
     <!-- <template #executionListener>
        <el-badge :value="executionListenerLength">
          <el-button size="small" @click="dialogName = 'executionListenerDialog'">编辑</el-button>
        </el-badge>
      </template> -->
	  <template #autoCondition>
	  	<div>
	  		<div class="ub ub-pc">
	  			<el-button style="width:258px;" size="mini" type="primary" @click="dialogName = 'autoConditionListenerDialog'" >添加/编辑</el-button>
	  		</div>
	  		<div class="ub ub-pc ub-ver" style="width:258px;margin-top: 10px;">
	  			<div class="ub ub-ver w100" v-for="(item,index) in conditionsShows" :key="index">
					<div class="condition-item" v-for="(_item,_index) in item.and" :key="_index">
						and
						{{_item.fieldName}}
						{{_item.conditionName}}
						{{_item.val}}
					</div>
					<el-divider></el-divider>
				</div>
				
	  		</div>
	  	</div>
	  </template>
    </x-form>
  <!--  <executionListenerDialog
      v-if="dialogName === 'executionListenerDialog'"
      :element="element"
      :modeler="modeler"
      @close="finishExecutionListener"
    /> -->
	<autoConditionDialog
	  v-if="dialogName === 'autoConditionListenerDialog'"
	  :element="element"
	  :modeler="modeler"
	  :condition="conditions"
	  @getCondition="getCondition"
	  @close="dialogName = ''"
	/>
  </div>
</template>

<script>
import mixinPanel from '../../common/mixinPanel'
import mixinExecutionListener from '../../common/mixinExecutionListener'
import { parseCDATA } from '../../common/util'

import autoConditionDialog from './taskDialogs/autoConditionDialog'
export default {
  mixins: [mixinPanel, mixinExecutionListener],
  components: {
    autoConditionDialog
  },
  data() {
    return {
		conditions:[],
		conditionsShows:[],
		formData: {}
    }
  },
  computed: {
    formConfig() {
		let baseForm = this.$getsessionStorage('baseForm');
		const _this = this
      return {
       inline: false,
       labelPosition: 'top',
        item: [
          // {
          //   xType: 'input',
          //   name: 'id',
          //   label: '节点 id',
          //   rules: [{ required: true, message: 'Id 不能为空' }]
          // },
          {
            xType: 'input',
            name: 'name',
            label: '节点名称'
          },
		  // {
		  //    xType: 'input',
			// type:'textarea',
			// placeholder:'请输入',
		  //    name: 'des',
		  //    label: '节点描述'
		  //  },
		   {
		     slot: 'line1',
		   },
		   {
		     xType: 'select',
		     name: 'conditionExpression',
		     label: '跳转条件',
				dic: [{ label: '通过', value: '${result==true}' }, { label: '不通过', value: '${result==false}'  }],
			show: _this.conditions.length==0
		   },
		   {
		     xType: 'slot',
		     name: 'autoCondition',
		     label: '自定义条件',
			 show: baseForm.sendId==1||baseForm.sendId==2
			 
		   },
        ]
      }
    }
  },
  watch: {
    'formData.conditionExpression': function(val) {
      if (val) {
		  // `<![CDATA[${JSON.stringify(val)}]]>`
        const newCondition = this.modeler.get('moddle').create('bpmn:FormalExpression', { body: `${val}` })
        this.updateProperties({ conditionExpression: newCondition })
      } else {
        this.updateProperties({ conditionExpression: null })
      }
	  //this.updateProperties({ 'camunda:conditionExpression': JSON.stringify(val) })
    },
	'conditions': function(val) {
		let str = 'dataInfo';
		 if (val) {
		   const newCondition = this.modeler.get('moddle').create('bpmn:FormalExpression', { body: `${'workflowService.expressionBack('+JSON.stringify(val)+','+str+')'}` })
		   console.log('newCondition',newCondition)
		   this.updateProperties({ conditionExpression: newCondition })
		 } else {
		   this.updateProperties({ conditionExpression: null })
		 }
		 this.updateProperties({ 'camunda:conditions': encodeURI(JSON.stringify(val)) })
		 this.updateProperties({ 'camunda:conditionsShows': encodeURI(JSON.stringify(this.conditionsShows)) })
	},
    // 'formData.skipExpression': function(val) {
    //   if (val === '') val = null
    //   this.updateProperties({ 'camunda:skipExpression': val })
    // }
  },
  created() {
    const cache = {
      ...this.element.businessObject,
      ...this.element.businessObject.$attrs
    }
	console.log('9999999999999',cache)
	
	let conditionsStr = cache['camunda:conditions']?decodeURI(cache['camunda:conditions']):'[]';
	let conditions = JSON.parse(conditionsStr);
	console.log('conditions',conditions)
	let conditionsShowsStr = cache['camunda:conditionsShows']?decodeURI(cache['camunda:conditionsShows']):'[]';
	let conditionsShows = JSON.parse(conditionsShowsStr);
	if(conditions.length>0){
		this.conditions = conditions;
		this.conditionsShows = conditionsShows;
		
	}else{
		for(let attr in cache){
			if(attr==='conditionExpression'){
				this.formData['conditionExpression'] = cache.conditionExpression.body;
			}else{
				this.formData['attr'] = cache[attr];
			}
		}
	}
	this.formData.id = cache.id ?? '';
    this.formData.name = cache.name ?? '';
  },
  methods:{
	  getCondition({data1,data2}){
		  this.conditions = this.$deepCopy(data1);
		  this.conditionsShows = this.$deepCopy(data2);
	  },
  }
}
</script>

<style lang="scss" scoped>
	.condition-item{
		font-size: 12px;
		line-height: 15px;
		color: #00c0ff;
	}
</style>
