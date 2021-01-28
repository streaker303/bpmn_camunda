import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
 const VueRouterReplace = Router.prototype.replace;
	Router.prototype.replace = function replace (to) {
	  return VueRouterReplace.call(this, to).catch(err => err)
	}
const errorPage = () =>
	import('@/pages/error.vue');
const home = () =>
	import('@/pages/home.vue');
const work_object = () =>
    import('@/pages/work_object.vue')
const work_template = () =>
    import('@/pages/work_template.vue')
const work_base = () =>
    import('@/pages/workFlow/work_base.vue')
const work_config = () =>
    import('@/pages/workFlow/work_config.vue')
const work_task = () =>
    import('@/pages/work_task.vue')
const work_task_detail = () =>
    import('@/pages/work_task_detail.vue')
export default new Router({
	routes: [{
			path: '/',
			redirect: '/home/work_template'
		},
		{
			path: '/error',
			name: 'error',
			component: errorPage,
			meta: {
				title: '系统出错了'
			}
		},
		{
			path: '/home',
			name: 'home',
			component: home,
			children: [
				{
					path: 'work_object',
					name: 'work_object',
					component: work_object,
					meta: {
						title: '自定义对象管理'
					}
				},
                {
                    path: 'work_template',
                    name: 'work_template',
                    component: work_template,
                    meta: {
                        title: '工单模板'
                    }
                },
				{
				    path: 'work_task_detail',
				    name: 'work_task_detail',
				    component: work_task_detail,
				    meta: {
				        title: '工单任务详情'
				    }
				},

                {
                    path: 'work_template/work_base',
                    name: 'work_base',
                    component: work_base,
                    meta: {
                        title: '工单基本信息'
                    }
                },
                {
                    path: 'work_template/work_config',
                    name: 'work_config',
                    component: work_config,
                    meta: {
                        title: '配置流程信息'
                    }
                },
                {
                    path: 'work_task',
                    name: 'work_task',
                    component: work_task,
                    meta: {
                        title: '工单任务'
                    }
                },
			]
		},
	]
})
