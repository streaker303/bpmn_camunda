import Vue from 'vue'
import axios from 'axios';
import Qs from 'qs'
import router from '../router/index'
import { Message,MessageBox } from 'element-ui';
import {
	setsessionStorage
} from '../assets/js/public_fun.js';
//import Vuex from '../store/index.js'

// 全局的配置的默认值/defaults
export let axios_config = () => {
	axios.defaults.baseURL = '';
	axios.defaults.headers.post['Content-Type'] = 'application/json';
	axios.defaults.timeout = 60000;
}
function getCookie(name) {
    var prefix = name + "="
    var start = document.cookie.indexOf(prefix)
 
    if (start == -1) {
        return null;
    }
 
    var end = document.cookie.indexOf(";", start + prefix.length)
    if (end == -1) {
        end = document.cookie.length;
    }
 
    var value = document.cookie.substring(start + prefix.length, end)
    return unescape(value);
}
axios_config();
var getAjax = result => {
	return new Promise((resolve, reject) => {
		if ((typeof result.data.code !== 'undefined' && result.data.code == 1)) {
			resolve(result.data.data);
		} else {
			if (result.data.code == 2) { //请求成功但流程不对
				Message({
					message: result.data.message,
					type: 'warning'
				});
			} else if (result.data.code == 9999) {
				MessageBox.confirm('系统报错，点击查看详情?', '提示', {
		          confirmButtonText: '查看',
		          cancelButtonText: '取消',
		          type: 'warning',
		          customClass:'confirm-box'
		        }).then(() => {
		        	setsessionStorage('errorInfo', result.data.message)
		          	router.push('/error')
		        }).catch(() => {});
			} else if (result.data.code == 9005) {
				if (document.getElementsByClassName('el-message').length === 0) {
				      Message({
								message: '登录已失效，请重新登录！',
								type: 'warning'
							});
			     }
			  setTimeout(()=>{
					window.location.href = getCookie('basetokenbaseInfo');
				},1500)
			} else {
				Message({
					message: result.data.message,
					type: 'warning'
				});
			}
			reject(result.data);
		}
	})
}
var getAjaxSome = result => {
	return new Promise((resolve, reject) => {
		if ((typeof result.data.code !== 'undefined' && result.data.code == 1)) {
			resolve(result.data);
		} else {
			if (result.data.code == 2) { //请求成功但流程不对
				Message({
					message: result.data.message,
					type: 'warning'
				});
			} else if (result.data.code == 9999) {
				MessageBox.confirm('系统报错，点击查看详情?', '提示', {
		          confirmButtonText: '查看',
		          cancelButtonText: '取消',
		          type: 'warning',
		          customClass:'confirm-box'
		        }).then(() => {
		        	setsessionStorage('errorInfo', result.data.message)
		          	router.push('/error')
		        }).catch(() => {});
			} else if (result.data.code == 9005) {
				if (document.getElementsByClassName('el-message').length === 0) {
				      Message({
								message: '登录已失效，请重新登录！',
								type: 'warning'
							});
			     }
			  setTimeout(()=>{
					window.location.href = getCookie('basetokenbaseInfo');
				},1500)
			} else {
				Message({
					message: result.data.message,
					type: 'warning'
				});
			}
			reject(result.data);
		}
	})
}

// 获取自定义列表
export const getWorkObject= (data) => {
	return axios.request({
		url: 'api/manage/workObject/page',
		method: 'post',
		data: data.paramsData,
        params: data.queryData,
	}).then(result => {
		console.log(result);
		return getAjax(result);
	})
}
// 保存自定义列表
export const saveWorkObject= (data) => {
	return axios.request({
		url: 'api/manage/workObject/save',
		method: 'post',
		data: data,
	}).then(result => {
		console.log(result);
		return getAjax(result);
	})
}
// 删除自定义列表
export const deleteWorkObject= (data) => {
	return axios.request({
		url: 'api/manage/workObject/del',
		method: 'post',
		data: data,
	}).then(result => {
		console.log(result);
		return getAjax(result);
	})
}
// 获取所有人
export const getAllUsers= (data) => {
    return axios.request({
        url: 'http://localhost:8094/static/json/users.json',
        method: 'get',
        data: data,
    }).then(result => {
        console.log(result);
        return getAjax(result);
    })
}
// 获取所有部门
export const getAllDep= (data) => {
    return axios.request({
        url: 'http://localhost:8094/static/json/dep.json',
        method: 'get',
        data: data,
    }).then(result => {
        console.log(result);
        return getAjax(result);
    })
}
// 获取所有角色
export const getAllRoles= (data) => {
    return axios.request({
        url: 'http://localhost:8094/static/json/userRole.json',
        method: 'get',
        data: data,
    }).then(result => {
        console.log(result);
        return getAjax(result);
    })
}
// 获取工单发起对象
export const getSendObject= (data) => {
    return axios.request({
        url: 'http://localhost:8094/static/json/sendObject.json',
        method: 'get',
        data: data,
    }).then(result => {
        console.log(result);
        return getAjax(result);
    })
}
// 获取工单模板列表
export const getWorkTemplateList= (data) => {
    return axios.request({
        url: 'api/manage/workMould/page',
        method: 'post',
        data: data.paramsData,
        params: data.queryData,
    }).then(result => {
        console.log(result);
        return getAjax(result);
    })
}
// 删除工单模板列表
export const deleteWorkTemplateList= (data) => {
    return axios.request({
        url: 'api/manage/workMould/delete',
        method: 'post',
        data: data
    }).then(result => {
        console.log(result);
        return getAjax(result);
    })
}
// 启用停用工单模板
export const changeWorkStatus= (data) => {
    return axios.request({
        url: 'api/manage/workMould/updateStatus',
        method: 'post',
        data: data
    }).then(result => {
        console.log(result);
        return getAjax(result);
    })
}
//保存或修改工单模板
export const saveWorkTemplate= (data) => {
    return axios.request({
        url: 'api/manage/workMould/save',
        method: 'post',
        data: data.paramsData,
        params: data.queryData,
    }).then(result => {
        console.log(result);
        return getAjax(result);
    })
}
// 工单任务 --列表
export const get_workTask= (data) => {
    return axios.request({
        url: 'api/manage/workOrder/get',
        method: 'post',
        data: data.paramsData,
        params: data.queryData,
    }).then(result => {
        console.log(result);
        return getAjax(result);
    })
}
// 工单任务 --列表
export const get_workObject= (data) => {
    return axios.request({
        url: 'api/manage/workOrder/getObject',
        method: 'post',
        data: data.paramsData,
        params: data.queryData,
    }).then(result => {
        console.log(result);
        return getAjax(result);
    })
}
// 工单任务 --列表
export const get_workTemplate= (data) => {
    return axios.request({
        url: 'api/manage/workOrder/getWorkMould',
        method: 'post',
        data: data,
    }).then(result => {
        console.log(result);
        return getAjax(result);
    })
}
// 工单任务 --发起工单
export const add_workTask= (data) => {
    return axios.request({
        url: 'api/manage/workOrder/save',
        method: 'post',
        data: data,
    }).then(result => {
        console.log(result);
        return getAjax(result);
    })
}
// 工单任务 --催办
export const urge_workTask= (data) => {
    return axios.request({
        url: 'api/manage/workOrder/sendReminder',
        method: 'post',
        data: data,
    }).then(result => {
        console.log(result);
        return getAjax(result);
    })
}
// 工单任务 --撤销
export const revert_workTask= (data) => {
    return axios.request({
        url: 'api/manage/workOrder/stop',
        method: 'post',
        data: data,
    }).then(result => {
        console.log(result);
        return getAjax(result);
    })
}
// 工单任务 --删除
export const delete_workTask= (data) => {
    return axios.request({
        url: 'api/manage/workOrder/delete',
        method: 'post',
        data: data,
    }).then(result => {
        console.log(result);
        return getAjax(result);
    })
}