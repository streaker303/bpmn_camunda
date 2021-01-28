<template>
	<div class="event event-wrapper" style="position: relative;">
		<div class="ub w100" style="box-sizing: border-box;">
			<div class="event-content w100">
				<div class="ub ub-pj w100">
					<div class="list-tips">工单任务详情</div>
					<div>
						<cancle-btn @click="back" title="返 回" />
						<searchBtn v-if="currentTab==1&&workTaskInfo.dealType==2" title="不同意" bgc="no_aggary" @click="checkShow(0)" />
						<searchBtn v-if="currentTab==1&&workTaskInfo.dealType==2" title="同 意"  @click="checkShow(1)" />
						<searchBtn v-if="currentTab==1&&workTaskInfo.dealType!=2" title="完成任务" @click="finishDialogShow" />
					</div>
				</div>
				<div class="ub ub-pj w100 task-status">
					<div>{{workTaskInfo.workOrderName}}</div>
					<div>状态：
						<span v-if="workTaskInfo.status==0" style="color:#ff3737;">{{workTaskInfo.status|getTaskStatus}}</span>
						<span v-if="workTaskInfo.status==1" style="color:#00ff00;">{{workTaskInfo.status|getTaskStatus}}</span>
						<span v-if="workTaskInfo.status==2" style="color:#00c0ff;">{{workTaskInfo.status|getTaskStatus}}</span>
					</div>
				</div>
				<el-tabs v-model="activeName">
					<el-tab-pane label="基本信息">
					</el-tab-pane>
				</el-tabs>
				<div>
					<el-row style='margin:10px 0;' type="flex" justify="start">
						<div class="ub" style="width:33%;">
							<div class="label">工单编号：</div>
							<div class="ub ub-f1 line1 label-val">{{workTaskInfo.workOrderId}}</div>
						</div>
						<div class="ub" style="width:33%;">
							<div class="label">工单名称：</div>
							<div class="ub ub-f1 line1 label-val">{{workTaskInfo.workOrderName}}</div>
						</div>
						<div class="ub" style="width:33%;">
							<div class="label">工单类型：</div>
							<div class="ub ub-f1 line1 label-val">{{workTaskInfo.workOrderObjectName}}</div>
						</div>
					</el-row>
					<el-row style='margin:20px 0;' type="flex" justify="start">
						<div class="ub" style="width:33%;">
							<div class="label">优先级：</div>
							<div class="ub ub-f1 line1 label-val">
								<span v-if="workTaskInfo.level==1" style="color:#ff0000;">{{workTaskInfo.level|getLevel}}</span>
								<span v-else-if="workTaskInfo.level==2" style="color:#ffdd00;">{{workTaskInfo.level|getLevel}}</span>
								<span v-else style="color:#00e1fd;">{{workTaskInfo.level|getLevel}}</span>
							</div>
						</div>
						<div class="ub" style="width:33%;">
							<div class="label">工单状态：</div>
							<div class="ub ub-f1 line1 label-val">{{workTaskInfo.status|getTaskStatus}}</div>
						</div>
						<div class="ub" style="width:33%;">
							<div class="label">当前节点：</div>
							<div class="ub ub-f1 line1 label-val">{{workTaskInfo.runningNodeName|getRunningNodeName}}</div>
						</div>
					</el-row>
					<el-row style='margin:20px 0;' type="flex" justify="start">
						<div class="ub" style="width:33%;">
							<div class="label">当前节点状态：</div>
							<div class="ub ub-f1 line1 label-val">
								<span v-if="workTaskInfo.currentNodeStatus==='待处理'" style="color:#ffba00;">{{workTaskInfo.currentNodeStatus}}</span>
								<span v-if="workTaskInfo.currentNodeStatus==='已超时'" style="color:#ff00e4;">{{workTaskInfo.currentNodeStatus}}</span>
								<span v-if="workTaskInfo.currentNodeStatus==='已撤销'" style="color:#ccc;">{{workTaskInfo.currentNodeStatus}}</span>
								<span v-if="workTaskInfo.currentNodeStatus==='已完成'" style="color:lightgreen;">{{workTaskInfo.currentNodeStatus}}</span>
							</div>
						</div>
						<div class="ub" style="width:33%;">
							<div class="label">创建人：</div>
							<div class="ub ub-f1 line1 label-val">{{workTaskInfo.createUser}}</div>
						</div>
						<div class="ub" style="width:33%;">
							<div class="label">创建时间：</div>
							<div class="ub ub-f1 line1 label-val">{{workTaskInfo.createTime}}</div>
						</div>
					</el-row>
					<el-row style='margin:20px 0;' type="flex" justify="start">
						<div class="ub" style="width:33%;">
							<div class="label">接收时间：</div>
							<div class="ub ub-f1 line1 label-val">{{workTaskInfo.receiveTime}}</div>
						</div>
						<div class="ub" style="width:33%;">
							<div class="label">参与人：</div>
							<div class="ub ub-f1 line1 label-val">{{workTaskInfo.players}}</div>
						</div>
					</el-row>
					<el-row style='margin:20px 0;' type="flex" justify="start">
						<div class="ub" style="width:100%;">
							<div class="label">节点描述：</div>
							<div class="ub ub-f1 label-val"> {{workTaskInfo.nodeDes}}</div>
						</div>
					</el-row>
				</div>
				<!-- 
				'告警ID': 'id',
				'告警名称': 'reportName',
				'告警等级': 'reportLevel',
				'告警类别': 'reportTypeName',
				'任务类型': 'taskType',
				'审核状态': 'checkStatus',
				'受影响资产': 'asset',
				'告警来源': 'reportFrom',
				'源IP': 'srcIp',
				'源端口': 'srcPort',
				'目的IP': 'desIp',
				'域名': 'domainName',
				'安全域': 'securityDomain',
				'报送量': 'gbNum',
				'攻击结果': 'attackResult',
				'日志来源': 'dt',
				'告警时间': 'createTime',
				'告警状态': 'reportStatus',
				'是否溯源': 'isTrace',
				'溯源状态': 'isTraceEnd',
				'是否封禁': 'isBanned'
				 -->
				<el-tabs v-if="workTaskInfo.workOrderObject == 1" v-model="activeName">
					<el-tab-pane label="告警详情">
					</el-tab-pane>
				</el-tabs>
				<div v-if="workTaskInfo.workOrderObject == 1">
					<el-row style='margin:10px 0;' type="flex" justify="start">
						<div class="ub" style="width:33%;">
							<div class="label">告警名称：</div>
							<div class="ub ub-f1 line1 label-val">{{alarmInfo.reportName}}</div>
						</div>
						<div class="ub" style="width:33%;">
							<div class="label">告警等级：</div>
							<div class="ub ub-f1 line1 label-val">
								<span v-if="alarmInfo.reportLevel == 0" style="color:#7efcfb">{{alarmInfo.reportLevel|getrePortLevel}}</span>
								<span v-if="alarmInfo.reportLevel == 1" style="color:#00c7ff">{{alarmInfo.reportLevel|getrePortLevel}}</span>
								<span v-if="alarmInfo.reportLevel == 2" style="color:#fdfe7f">{{alarmInfo.reportLevel|getrePortLevel}}</span>
								<span v-if="alarmInfo.reportLevel == 3" style="color:#fc7f00">{{alarmInfo.reportLevel|getrePortLevel}}</span>
								<span v-if="alarmInfo.reportLevel == 4" style="color:#fd0001">{{alarmInfo.reportLevel|getrePortLevel}}</span>
							</div>
						</div>
						<div class="ub" style="width:33%;">
							<div class="label">告警类型：</div>
							<div class="ub ub-f1 line1 label-val">{{alarmInfo.reportTypeName}}</div>
						</div>
					</el-row>
					<el-row style='margin:20px 0;' type="flex" justify="start">
						<div class="ub" style="width:33%;">
							<div class="label">告警状态：</div>
							<div class="ub ub-f1 line1 label-val">
								<span v-if="alarmInfo.reportStatus == 0" style="color:#ffdd00">{{alarmInfo.reportStatus|getreportStatus}}</span>
								<span v-if="alarmInfo.reportStatus == 1" style="color:#01ff01">{{alarmInfo.reportStatus|getreportStatus}}</span>
								<span v-if="alarmInfo.reportStatus == 2" style="color:#00e1fd">{{alarmInfo.reportStatus|getreportStatus}}</span>
								<span v-if="alarmInfo.reportStatus == 3" style="color:#e1e2e4">{{alarmInfo.reportStatus|getreportStatus}}</span>

							</div>
						</div>
						<div class="ub" style="width:33%;">
							<div class="label">攻击源头IP：</div>
							<div class="ub ub-f1 line1 label-val">{{alarmInfo.srcIp}}</div>
						</div>
						<div class="ub" style="width:33%;">
							<div class="label">攻击源端口：</div>
							<div class="ub ub-f1 line1 label-val">{{alarmInfo.srcPort}}</div>
						</div>
					</el-row>
					<el-row style='margin:20px 0;' type="flex" justify="start">
						<div class="ub" style="width:33%;">
							<div class="label">目的IP：</div>
							<div class="ub ub-f1 line1 label-val">{{alarmInfo.desIp}}</div>
						</div>
						<div class="ub" style="width:33%;">
							<div class="label">攻击结果：</div>
							<div class="ub ub-f1 line1 label-val">{{alarmInfo.attackResult}}</div>
						</div>
						<div class="ub" style="width:33%;">
							<div class="label">是否封禁：</div>
							<div class="ub ub-f1 line1 label-val">{{alarmInfo.isBanned==1?'是':'否'}}</div>
						</div>
					</el-row>
					<el-row style='margin:20px 0;' type="flex" justify="start">
						<div class="ub" style="width:33%;">
							<div class="label">规则名称：</div>
							<div class="ub ub-f1 line1 label-val">{{alarmInfo.ruleName}}</div>
						</div>
					</el-row>
				</div>
				<el-row style='margin:20px 0;' type="flex" justify="start">
					<div class="ub" style="width:100%;">
						<div class="label">原始日志：</div>
						<div class="ub ub-f1">
							<div class="ub ub-ver ub-f1">
								<el-table ref="multipleTable3" v-loading="loading" class='bigTable' style="min-height: auto;" :data="msgTable"
								 border stripe tooltip-effect="dark">
									<el-table-column fixed="left" align="center" type="index" width="50" class-name="deepBg" :index="(dex) => (paramsArry.page-1) * paramsArry.size + dex + 1"
									 label="序号">
									</el-table-column>
									<el-table-column prop="type" label="事件类型" width="140">
										<template slot-scope="scope">
											<span v-if="scope.row.type == 'alarm'">安全设备警告事件</span>
											<span v-if="scope.row.type == 'asset'">资产事件</span>
											<span v-if="scope.row.type == 'host'">主机日志事件</span>
											<span v-if="scope.row.type == 'menace'">威胁情报事件</span>
											<span v-if="scope.row.type == 'traffic'">网络流事件</span>
											<span v-if="scope.row.type == 'vulnerability'">漏洞事件</span>
										</template>
									</el-table-column>
									<el-table-column prop="srcIp" label="源地址" width="120">
									</el-table-column>
									<el-table-column prop="srcPort" label="源端口" width="100">
									</el-table-column>
									<el-table-column prop="desIp" label="目的地址" width="150">
									</el-table-column>
									<el-table-column prop="desPort" label="目的端口" width="120">
									</el-table-column>
									<el-table-column prop="callDateTime" label="事件接收时间" width="180px" :formatter="dateFormat_inner">
									</el-table-column>
									<el-table-column prop="content" label="事件名称" width="120" show-overflow-tooltip>
									</el-table-column>
									<el-table-column prop="protocal" label="协议名称" width="120" show-overflow-tooltip>
									</el-table-column>
									<el-table-column prop="command" label="操作" width="120" show-overflow-tooltip>
									</el-table-column>
									<el-table-column prop="messaggioOriginale" label="原始消息" width="120" show-overflow-tooltip>
									</el-table-column>
									<el-table-column align="center" label="操作" fixed="right" class-name="deepBg">
										<template slot-scope="scope">
											<el-button type="text" @click="detailData(scope.row)">详情</el-button>
										</template>
									</el-table-column>
								</el-table>
								<div class="pagination">
									<el-pagination background @size-change="(val) => paramsArry.size = val" @current-change="(val) => paramsArry.page = val"
									 :current-page="paramsArry.page" :page-sizes="[5, 10, 20, 30, 40,50]" :page-size="paramsArry.size" layout="total, sizes, prev, pager, next"
									 prev-text="上一页" next-text="下一页" :total="msgTable.length">
									</el-pagination>
								</div>
							</div>
						</div>
					</div>
				</el-row>
				<div class="w100" v-if="currentTab==1&&workTaskInfo.dealType!=2">
					<el-tabs v-model="activeName">
						<el-tab-pane label="节点操作">
						</el-tab-pane>
					</el-tabs>
					<div class="w100">
						<!-- 告警/漏洞 字段编辑 -->
						<div class="w100" v-if="(workTaskInfo.workOrderObject == 1||workTaskInfo.workOrderObject == 2)&&workTaskInfo.dealType==0">
							<el-form class="w100" :model="fieldsForm" :rules="rules" ref="fieldsForm" :inline="true">
								<el-form-item v-for="(item,index) in fieldsForm.fields" :key="index" :style="{
									width:item.valType === 'richText'?'100%':'48%',
									marginBottom: '20px',
								}" :label="item.name+':'" prop="" :label-width="formLabelWidth">
									<el-input v-if="item.valType==='text'" style="width: 400px;" placeholder="请输入" clearable v-model="item.val"
									 size="small"></el-input>
									<el-select v-else-if="item.valType==='select'" placeholder="请选择" style="width: 400px;" v-model="item.val+''" size="small">
										<el-option v-for="(tag,_index) in item.item" :label="tag.value" :value="tag.key+''" :key="_index"></el-option>
									</el-select>
									<div class="ub ub-pc" v-else-if="item.valType==='richText'" style="width:1175px;position: relative;">
										<vue-ueditor-wrap v-model="item.val" :config="myConfig"></vue-ueditor-wrap>
									</div>
								</el-form-item>
							</el-form>
						</div>
						<!-- 备注 -->
						<div class="w100" v-if="workTaskInfo.workOrderObject != 1 && workTaskInfo.workOrderObject != 2">
							<el-form class="w100" :model="otherForm" :rules="rules" ref="otherForm" :inline="true">
								<el-form-item style="width:100%;margin-bottom: 20px;" label="备注：" prop="" :label-width="formLabelWidth">
									<div class="ub ub-pc" style="width:1175px;position: relative;">
										<vue-ueditor-wrap v-model="otherForm.remark" :config="myConfig"></vue-ueditor-wrap>
									</div>
								</el-form-item>
							</el-form>
						</div>
						<!-- 告警处置 -->

						<div class="w100" v-if="workTaskInfo.workOrderObject==1&&workTaskInfo.operation&&workTaskInfo.operation==2">
							<el-form class="w100" :model="handleForm" :rules="disposalRules" ref="handleForm" :inline="true">
								<el-form-item style="width:48%;margin-bottom: 20px;" label="审核状态：" prop="isReject" :label-width="formLabelWidth">
									<el-select placeholder="请选择" style="width: 400px;" v-model="handleForm.isReject" size="small">
										<el-option label="处置" value="0"></el-option>
										<el-option label="驳回" value="1"></el-option>
									</el-select>

								</el-form-item>
								<el-form-item v-if="handleForm.isReject != 1" style="width:48%;margin-bottom: 20px;" label="处理方式：" prop="disposalType"
								 :label-width="formLabelWidth">
									<el-select placeholder="请选择" style="width: 400px;" v-model="handleForm.disposalType" size="small">
										<el-option label="一键封堵" value=0></el-option>
										<el-option label="阻断规则变更" value=1></el-option>
										<el-option label="检测规则变更" value=2></el-option>
										<el-option label="访问规则变更" value=3></el-option>
										<el-option label="业务安全检查变更" value=4></el-option>
										<el-option label="其他" value=5></el-option>
									</el-select>
								</el-form-item>
								
								<el-form-item v-if="handleForm.disposalType == 0  && handleForm.isReject != 1" style="width:48%;margin-bottom: 20px;"
								 label="IP：" prop="" :label-width="formLabelWidth">
									<el-input style="width: 400px;" type="textarea" placeholder="请输入" clearable v-model="handleForm.ips" size="small"></el-input>
									<el-tooltip class="item" style="position: absolute;top:40%;right: -20px;" effect="dark" content="多个ip录入时，记录每行为一个ip，按Enter折行批量录入"
									 placement="right">
										<i class="el-icon-question" style="color: #1cd7fa;"></i>
									</el-tooltip>
								</el-form-item>
								<el-form-item v-if="handleForm.disposalType == 0  && handleForm.isReject != 3" style="width:48%;margin-bottom: 20px;"
								 label="封禁对象：" prop="" :label-width="formLabelWidth">
									<el-select placeholder="请选择" style="width: 400px;" multiple v-model="handleForm.objs" size="small">
										<el-option v-for="(item,index) in oneKeyList" :key="index" :label="item.device_name" :value="item.id"></el-option>
									</el-select>

								</el-form-item>
								<div style="margin-bottom: 20px;" v-if="handleForm.disposalType == 1 && handleForm.isReject != 1">
									<el-form-item label="变更项：" style="width: 48%" :label-width="formLabelWidth">
										<el-select v-model="handleForm.changeItemZDGZ" placeholder="请选择" style="width: 400px;" size="small">
											<el-option label="WAF规则变更" value=0></el-option>
											<el-option label="IPS规则变更" value=1></el-option>
											<el-option label="FW规则变更" value=2></el-option>
											<el-option label="IDS规则变更" value=3></el-option>
										</el-select>
									</el-form-item>
									<el-form-item label="选择设备：" style="width: 48%" :label-width="formLabelWidth">
										<el-select v-model="handleForm.assetIdsZDGZ" placeholder="请选择" multiple style="width: 400px;" size="small">
											<el-option v-for="(item,index) in assetList" :key="index" :label="item.name" :value="item.id">
											</el-option>
										</el-select>
									</el-form-item>
								</div>
								<div style="margin-bottom: 20px;" v-if="handleForm.disposalType == 2 && handleForm.isReject != 1">
									<el-form-item label="变更项：" style="width: 48%" :label-width="formLabelWidth">
										<el-select v-model="handleForm.changeItemJCGZ" placeholder="请选择" style="width: 400px;" size="small">
											<el-option label="WAF规则变更" value=0></el-option>
											<el-option label="IPS规则变更" value=1></el-option>
											<el-option label="FW规则变更" value=2></el-option>
											<el-option label="IDS规则变更" value=3></el-option>
										</el-select>
									</el-form-item>
									<el-form-item label="选择设备：" style="width: 48%" :label-width="formLabelWidth">
										<el-select v-model="handleForm.assetIdsJCGZ" placeholder="请选择" multiple style="width: 400px;" size="small">
											<el-option v-for="(item,index) in assetList" :key="index" :label="item.name" :value="item.id">
											</el-option>
										</el-select>
									</el-form-item>
								</div>
								<el-form-item label="选择设备：" prop="" :label-width="formLabelWidth" v-if="handleForm.disposalType == 3 && handleForm.isReject != 1" style="width:48%;margin-bottom: 20px;">
									<el-select v-model="handleForm.assetIdsFWGZ" placeholder="请选择" multiple style="width: 400px;" size="small">
										<el-option v-for="item in assetList" :key="symbolKey()" :label="item.name" :value="item.id">
										</el-option>
									</el-select>
								</el-form-item>
								<div style="margin-bottom: 20px;" v-if="handleForm.disposalType == 4 && handleForm.isReject != 1">
									<el-form-item label="业务系统：" style="width: 48%" :label-width="formLabelWidth">
										<el-select v-model="handleForm.assetSystemId" placeholder="请选择" style="width: 400px;" size="small">
											<el-option v-for="item in systemList" :key="symbolKey()" :label="item.system_name" :value="item.id">
											</el-option>
										</el-select>
									</el-form-item>


									<el-form-item label="业务员：" class="business" style="width: 48%" :label-width="formLabelWidth">
										<el-select v-model="handleForm.assetUserId" placeholder="请选择" style="width: 400px;" size="small">
											<el-option v-for="item in userList" :key="symbolKey()" :label="item.chineseName" :value="item.id">
											</el-option>
										</el-select>
									</el-form-item>
								</div>
								
								<el-form-item label="备注：" :label-width="formLabelWidth" prop="changeLog" style="width:48%;margin-bottom: 20px;" v-if="handleForm.disposalType != 0 && handleForm.disposalType != 5  && handleForm.isReject != 1">
									<el-input style="font-size: 12px;width: 400px" type="textarea" :autosize="{ minRows: 3, maxRows: 5}" v-model="handleForm.changeLog"
									 clearable></el-input>
								</el-form-item>
								<el-form-item v-if="handleForm.isReject == 1" style="width:100%;margin-bottom: 20px;" label="驳回理由:"
								 :label-width="formLabelWidth">
									<div class="ub ub-pc" style="width:1175px;">
										<vue-ueditor-wrap v-model="handleForm.rejectReason" :config="myConfig"></vue-ueditor-wrap>
									</div>
								</el-form-item>
								<el-form-item style="width:100%; margin-bottom: 20px;" v-if="handleForm.disposalType == 5" label="其他:" :label-width="formLabelWidth">
									<div class="ub ub-pc" style="width:1175px;">
										<vue-ueditor-wrap v-model="handleForm.otherMsg" :config="myConfig"></vue-ueditor-wrap>
									</div>
								</el-form-item>
								<el-form-item style="width:100%; margin-bottom: 20px;" label="处置结果：" prop="" :label-width="formLabelWidth">
									<div class="ub ub-pc" style="width:1175px;">
										<vue-ueditor-wrap v-model="handleForm.adviceReject" :config="myConfig"></vue-ueditor-wrap>
									</div>
								</el-form-item>
							</el-form>
						</div>
						<!-- 告警分析 -->
						<div class="w100" v-if="workTaskInfo.workOrderObject==1&&workTaskInfo.operation==0">
							<el-form class="w100" :model="analysisForm" :rules="analysisRules" ref="analysisForm" :inline="true">
								<el-form-item style="width:100%;margin-bottom: 20px;" label="是否驳回：" prop="isReject" :label-width="formLabelWidth">
									<el-select placeholder="请选择" style="width: 1175px;" v-model="analysisForm.isReject" size="small">
										<el-option label="是" value="1"></el-option>
										<el-option label="否" value="0"></el-option>

									</el-select>
								</el-form-item>
								<el-form-item style="width:100%;margin-bottom: 20px;" label="分析过程：" prop="" :label-width="formLabelWidth">
									<div class="ub ub-pc" style="width:1175px;">
										<vue-ueditor-wrap v-model="analysisForm.analyzePro" :config="myConfig"></vue-ueditor-wrap>
									</div>
								</el-form-item>
								<el-form-item v-if="analysisForm.isReject==1" style="width:100%;margin-bottom: 20px;" label="驳回理由" prop=""
								 :label-width="formLabelWidth">
									<div class="ub ub-pc" style="width:1175px;">
										<vue-ueditor-wrap v-model="analysisForm.rejectReason" :config="myConfig"></vue-ueditor-wrap>
									</div>
								</el-form-item>
								<el-form-item v-else style="width:100%;margin-bottom: 20px;" label="处置建议" prop="" :label-width="formLabelWidth">
									<div class="ub ub-pc" style="width:1175px;">
										<vue-ueditor-wrap v-model="analysisForm.disposalAdvise" :config="myConfig"></vue-ueditor-wrap>
									</div>
								</el-form-item>
							</el-form>
						</div>
						<!-- 告警溯源 -->
						<div class="w100" v-if="workTaskInfo.workOrderObject==1&&workTaskInfo.operation&&workTaskInfo.operation==3">
							<el-form class="w100" :model="backForm" :rules="rules" ref="backForm" :inline="true">
								<el-form-item style="width:100%;margin-bottom: 20px;" label="溯源结果：" prop="" :label-width="formLabelWidth">
									<div class="ub ub-pc" style="width:1175px;position: relative;">
										<vue-ueditor-wrap v-model="backForm.traceResult" :config="myConfig"></vue-ueditor-wrap>
									</div>
								</el-form-item>
							</el-form>
						</div>
						<!-- 告警二线分析-->
						<div class="w100" v-if="workTaskInfo.workOrderObject==1&&workTaskInfo.operation&&workTaskInfo.operation==4">
							<el-form class="w100" :model="alarmAddviceForm" :rules="rules" ref="alarmAddviceForm" :inline="true">
								<el-form-item style="width:100%;margin-bottom: 20px;" label="追加建议：" prop="" :label-width="formLabelWidth">
									<div class="ub ub-pc" style="width:1175px;">
										<vue-ueditor-wrap v-model="alarmAddviceForm.appendProposal" :config="myConfig"></vue-ueditor-wrap>
									</div>
								</el-form-item>
							</el-form>
						</div>
						<!-- 告警状态变更-->
						<div class="w100" v-if="workTaskInfo.workOrderObject==1&&workTaskInfo.operation&&workTaskInfo.operation==1">
							<el-form class="w100" :model="alarmStatusForm" :rules="rules" ref="alarmStatusForm" :inline="true">
							    <el-form-item style="width:100%;margin-bottom: 20px;" label="告警状态：" prop="" :label-width="formLabelWidth">
								    <div class="ub ub-pc" style="width:400px;">
										<el-select placeholder="请选择" style="width: 400px;" v-model="alarmStatusForm.reportStatus" size="small">
										    <el-option label="待确认" value="0"></el-option>
										    <el-option label="已确认" value="1"></el-option>
										    <el-option label="已处理" value="2"></el-option>
											<el-option label="已驳回" value="3"></el-option>
										</el-select>
									</div>
								</el-form-item>
							</el-form>
						</div>
					</div>
				</div>
				<el-tabs v-if="bpmRecord.length>0" v-model="activeName">
					<el-tab-pane label="流转记录">
					</el-tab-pane>
				</el-tabs>
				<el-row style='margin:20px 0;' type="flex" justify="center">
					<el-timeline style="width:90%;margin-left: 140px;">
						<el-timeline-item v-for="(activity, index) in bpmRecord" :key="index" :icon="activity.icon" :type="activity.type"
						 :color="activity.color" :size="activity.size" :hide-timestamp="false" :timestamp="activity.createTime" placement="top">
							<div class="ub ub-pj ub-ac time-box">
								<div class="ub" style="width: 50%;">
									<h4 style="color: #00e9ff;font-size: 16px;">{{activity.userName|NullStr}}<sub style="font-size:12px;color: #ffffff;opacity: 0.6;margin-left: 10px;vertical-align: bottom;">{{activity.userRole|NullStr}}</sub></h4>
								</div>
								<div class="time-right" style="width: 150px;">
									<el-button type="text" style="text-decoration: underline;font-size:12px;" :class="{'el-icon-arrow-down':activity.isOpen,'el-icon-arrow-up':!activity.isOpen}"
									 @click="activity.isOpen=!activity.isOpen">展开查看</el-button>
								</div>
							</div>
							<div v-show="activity.isOpen">
								<div class="time-text-box" v-if="(workTaskInfo.workOrderObject == 1||workTaskInfo.workOrderObject == 2)&&activity.dealType==0">
									<div class="ub w100 time-text-box-item" v-for="(item,_index) in activity.dealContent" :key="_index">
										<div class="time-text-box-left">{{item.name}}:</div>
										<div class="ub ub-f1 ub-ver time-text-box-right">{{item|getVal}}</div>
									</div>
								</div>
								<!-- 告警分析 -->
								<div class="time-text-box" v-if="workTaskInfo.workOrderObject == 1&&activity.operation==0">
									<div class="ub w100 time-text-box-item">
										<div class="time-text-box-left">是否驳回：</div>
										<div class="ub ub-f1 ub-ver time-text-box-right">{{activity.dealContent.isReject==1?'是':'否'}}</div>
									</div>
									<div class="ub w100 time-text-box-item">
										<div class="time-text-box-left">分析过程：</div>
										<div class="ub ub-f1 ub-ver time-text-box-right" v-html="activity.dealContent.analyzePro" @click="imageEnlargement"></div>
									</div>
									<div class="ub w100 time-text-box-item" v-if="activity.dealContent.isReject==1">
										<div class="time-text-box-left">驳回理由：</div>
										<div class="ub ub-f1 ub-ver time-text-box-right" v-html="activity.dealContent.rejectReason" @click="imageEnlargement"></div>
									</div>
									<div v-else class="ub w100 time-text-box-item">
										<div class="time-text-box-left">处置建议：</div>
										<div class="ub ub-f1 ub-ver time-text-box-right" v-html="activity.dealContent.disposalAdvise" @click="imageEnlargement"></div>
									</div>
								</div>
								<!-- 告警处置 -->
								<div class="time-text-box" v-if="workTaskInfo.workOrderObject == 1&&activity.operation&&activity.operation==2">
									<div class="ub w100 time-text-box-item">
										<div class="time-text-box-left">是否驳回：</div>
										<div class="ub ub-f1 ub-ver time-text-box-right">{{activity.dealContent.isReject==1?'是':'否'}}</div>
									</div>
									<div class="ub w100 time-text-box-item" v-if="activity.dealContent.isReject==1">
										<div class="time-text-box-left">驳回理由：</div>
										<div class="ub ub-f1 ub-ver time-text-box-right" v-html="activity.dealContent.rejectReason" @click="imageEnlargement"></div>
									</div>
									<div class="w100" v-if="activity.dealContent.isReject!=1">
										<div class="ub w100 time-text-box-item">
											<div class="time-text-box-left">处置方式：</div>
											<div class="ub ub-f1 time-text-box-right">{{ activity.dealContent.disposalType|getdisposalType }}</div>
										</div>
										<div class="ub w100 time-text-box-item" v-if="activity.dealContent.disposalType == 0">
											<div class="time-text-box-left">IP：</div>
											<div class="ub ub-f1 ub-ver time-text-box-right" >{{handdeelIps(activity.dealContent.ips)}}</div>
										</div>
										<div class="ub w100 time-text-box-item" v-if="activity.dealContent.disposalType == 0 && activity.dealContent.isReject != 3">
											<div class="time-text-box-left">封禁对象：</div>
											<div class="ub ub-f1 ub-ver time-text-box-right">{{getObjs(activity.dealContent.objs)}}</div>
										</div>
										<div class="ub w100 time-text-box-item" v-if="activity.dealContent.disposalType == 1||activity.dealContent.disposalType == 2">
											<div class="time-text-box-left">变更项：</div>
											<div class="ub ub-f1 ub-ver time-text-box-right">{{ activity.dealContent.changeItem|getchangeItem }}</div>
										</div>
										<div class="ub w100 time-text-box-item" v-if="activity.dealContent.disposalType == 1||activity.dealContent.disposalType == 2||activity.dealContent.disposalType == 3">
											<div class="time-text-box-left">设备：</div>
											<div class="ub ub-f1 ub-ver time-text-box-right">{{ getassetIds(activity.dealContent.assetIds) }}</div>
										</div>
										<div class="ub w100 time-text-box-item" v-if="activity.dealContent.disposalType == 4">
											<div class="time-text-box-left">业务系统：</div>
											<div class="ub ub-f1 ub-ver time-text-box-right">{{ getassetSystemId(activity.dealContent.assetSystemId) }}</div>
										</div>
										<div class="ub w100 time-text-box-item" v-if="activity.dealContent.disposalType == 4">
											<div class="time-text-box-left">业务人员：</div>
											<div class="ub ub-f1 ub-ver time-text-box-right">{{ getassetUserId(activity.dealContent.assetUserId) }}</div>
										</div>
										<div class="ub w100 time-text-box-item" v-if="activity.dealContent.disposalType == 5">
											<div class="time-text-box-left">其他：</div>
											<div class="ub ub-f1 ub-ver time-text-box-right" v-html="activity.dealContent.otherMsg" @click="imageEnlargement"></div>
										</div>
										<div class="ub w100 time-text-box-item" v-if="activity.dealContent.disposalType != 0 && activity.dealContent.disposalType != 5">
											<div class="time-text-box-left">备注：</div>
											<div class="ub ub-f1 ub-ver time-text-box-right" v-html="activity.dealContent.changeLog" @click="imageEnlargement"></div>
										</div>
									</div>
								</div>
								<!-- 告警溯源 -->
								<div class="time-text-box" v-if="workTaskInfo.workOrderObject == 1&&activity.operation&&activity.operation==3">
									<div class="ub w100 time-text-box-item">
										<div class="time-text-box-left">溯源结果：</div>
										<div class="ub ub-f1 ub-ver time-text-box-right" v-html="activity.dealContent.traceResult" @click="imageEnlargement"></div>
									</div>
								</div>
								<!-- 状态变更 -->
								<div class="time-text-box" v-if="workTaskInfo.workOrderObject==1&&activity.operation&&activity.operation==1">
									<div class="ub w100 time-text-box-item">
										<div class="time-text-box-left">告警状态：</div>
										<div class="ub ub-f1 ub-ver time-text-box-right">{{activity.dealContent.reportStatus|getreportStatus}}</div>
									</div>
								</div>
								<!-- 二线分析 -->
								<div class="time-text-box" v-if="workTaskInfo.workOrderObject == 1&&activity.operation&&activity.operation==4">
									<div class="ub w100 time-text-box-item">
										<div class="time-text-box-left">追加建议：</div>
										<div class="ub ub-f1 ub-ver time-text-box-right" v-html="activity.dealContent.appendProposal" @click="imageEnlargement"></div>
									</div>
								</div>
								
								<!-- 备注 -->
								<div class="time-text-box" v-if="workTaskInfo.workOrderObject != 1&&workTaskInfo.workOrderObject != 2">
									<div class="ub w100 time-text-box-item">
										<div class="time-text-box-left">备注：</div>
										<div class="ub ub-f1 ub-ver time-text-box-right" v-html="activity.dealContent?activity.dealContent.remark:''" @click="imageEnlargement"></div>
									</div>
								</div>
								
								<!-- 审核 -->
								<div class="time-text-box" v-if="activity.dealType&&activity.dealType==2">
									<div class="ub w100 time-text-box-item">
										<div class="time-text-box-left">审核意见：</div>
										<div class="ub ub-f1 ub-ver time-text-box-right" v-html="activity.approveOpinion" @click="imageEnlargement"></div>
									</div>
								</div>
							</div>
							<div class="ub w100" style="margin-top: 8px;">
								<div class="time-text-box-bottom"><i class="iconfont icon-jiediankaishishijian"></i> <span>开始：{{activity.receiveTime|NullStr}}</span></div>
								<div class="time-text-box-bottom"><i class="iconfont icon-jiediantingliushijian"></i> <span>停留：<strong>{{activity.stayTime|NullStr}}</strong></span></div>
								<div class="time-text-box-bottom"><i class="iconfont icon-chuliren"></i> <span>处理人：<strong class="users">{{activity.players|NullStr}}</strong></span></div>
							</div>
						</el-timeline-item>
					</el-timeline>
				</el-row>
			</div>
		</div>
		<el-dialog title="提示" :visible.sync="finishDialog" width="30%" custom-class="attendance-dialog">
			<span>确定完吗？</span>
			<span slot="footer" class="dialog-footer">
				<searchBtn title="确 定" @click="finishConfim" />
				<div class="cancelBtn" style="margin-left: 10px;" @click="finishDialog = false">取 消</div>
			</span>
		</el-dialog>
		<el-dialog v-dialogDrag :title="agreeTitle" :visible.sync="checkDialog" width="65%" custom-class="attendance-dialog">
			<el-form class="w100" :model="checkkForm" :rules="rules" ref="checkkForm">
				<el-form-item style="width:100%;margin-bottom: 20px;" label="审批意见：" prop="" :label-width="formLabelWidth">
					<div class="ub ub-pc ub-f1">
						<vue-ueditor-wrap v-model="checkkForm.approveOpinion" :config="myConfig"></vue-ueditor-wrap>
					</div>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<searchBtn title="确 定" @click="finishConfim" />
				<div class="cancelBtn" style="margin-left: 10px;" @click="checkDialog = false">取 消</div>
			</span>
		</el-dialog>
		<el-dialog v-dialogDrag title="告警详情" :visible.sync="detailDialog" width="65%"
		           custom-class="attendance-dialog">
		    <div style="width:90%;margin: 0 auto;display: flex;flex-wrap: wrap">
		        <div class="table-container" v-for="(val,key) in detailArr" :key="key">
		            <div class="table-left">{{ fieldToChinese(key) }}</div>
		            <div class="table-right" v-html="val"></div>
		        </div>
		    </div>
		</el-dialog>
	</div>

</template>

<script>
	import 'vant/lib/index.css';
	import {ImagePreview} from 'vant'
	import VueUeditorWrap from '../components/vue-ueditor-wrap.vue' // ES6 Module
	import {
		get_workTask_detail,
		finish_workTask,
	} from '../server/api.js'
	import UEditor from './ueditor.vue'
	export default {
		name: 'taskDetail',
		components: {
			UEditor,
			VueUeditorWrap
		},
		data() {
			return {
				eduitURL:"",
				agreeStatus:'',
				agreeTitle:'',
				finishDialog: false,
				myConfig: {
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
					//禁用编辑器
					//readonly: true,
					// 编辑器不自动被内容撑高
					autoHeightEnabled: false,
					autoFloatEnabled: false,
					//是否工具栏可浮动
					// 初始容器高度
					initialFrameHeight: 450,
					zIndex: 100,
					// 初始容器宽度
					initialFrameWidth: '100%',
					// 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
					BaseUrl: '',
					//serverUrl: 'http://35.201.165.105:8000/controller.php',
					// UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
					UEDITOR_HOME_URL: 'static/ueditor/'
				},
				formLabelWidth: "100px",
				// msgTable:[],
				loading: false,
				checkDialog:false,
				fieldsForm: {
					fields: [],
				},
				//告警表单
				assetList: [],
				userList: [],
				systemList: [],
				oneKeyList: [],
				// 处置操作：
				// 是否驳回--isReject
				// 处置方式--disposalType
				// 封禁对象--objs
				// ip--ips
				// 选择设备--assetIds
				// 变更项--changeItem
				// 备注--changeLog
				// 业务系统--assetSystemId
				// 业务员--assetUserId
				// 其它--otherMsg
				handleForm: {
					isReject: '0',
					disposalType: '',
					ips: "",
					rejectReason: '',
					objs: [],
					assetIdsZDGZ: '',
					assetIdsJCGZ: '',
					assetIdsFWGZ: '',
					changeItemZDGZ: '',
					changeItemJCGZ: '',
					changeLog: '',
					assetSystemId: '',
					assetUserId: '',
					otherMsg: '',
				},
				analysisForm: {
					isReject: '0',
					analyzePro: '', //分析过程
					disposalAdvise: '', //处置建议
					rejectReason: '', //驳回理由
				},
				backForm: {
					traceResult: ''
				},
				alarmAddviceForm: {
					appendProposal: '',
				},
				alarmStatusForm: {
					reportStatus: '',
				},
				otherForm: {
					remark: '',
				},
				checkkForm:{
					approveOpinion:"",
				},
				rules: {
                },
                disposalRules: {
                    isReject: [
                        { required: true, message: '请选择', trigger: 'change' }
                    ],
                    disposalType: [
                        { required: true, message: '请选择', trigger: 'change' }
                    ],
                },
                analysisRules: {
                    isReject: [
                        { required: true, message: '请选择', trigger: 'change' }
                    ]
                },
				historyDialog: false,
				activities: [],
				activeName: 'first',
				workTaskInfos: {},
				alarmInfo: {},
				bpmRecord: [],
				detailInfo: {
					createTime: '',
					des: '',
					hours: '',
					endTime: null,
					groupName: '',
					output: "",
					startTime: "",
					status: '',
					statusCN: "",
					taskName: "",
					feedback: '',
					history: [],
					users: '',
				},
				currentTab: '',
				msg: '',
				paramsArry: {
					page: 1,
					size: 5
				},
				detailDialog: false,
				detailArr: {},
				dealContent:null,
			}
		},
		filters: {
			//变更项
			getchangeItem(type){
				let types = [
					{
						label:'WAF规则变更',
						value:0
					},{
						label:'IPS规则变更',
						value:1
					},{
						label:'FW规则变更',
						value:2
					},{
						label:'IDS规则变更',
						value:3
					}
				]
				let selected = types.filter(item=>item.value==type)
				if(selected.length>0){
					return selected[0].label;
				}else{
					return '';
				}
			},
			//处置方式
			getdisposalType(type){
				let types = [
					{
						label:'一键封堵',
						value:0
					},{
						label:'阻断规则变更',
						value:1
					},{
						label:'检测规则变更',
						value:2
					},{
						label:'访问规则变更',
						value:3
					},{
						label:'业务安全检查变更',
						value:4
					},{
						label:'其他',
						value:5
					},
				]
				let selected = types.filter(item=>item.value==type)
				if(selected.length>0){
					return selected[0].label;
				}else{
					return '';
				}
			},
			getVal(item){
				if(item.valType==='text'){
					return item.val;
				}
				if(item.valType==='select'){
					let arr = item.item;
					let selected = arr.filter(tag=>item.val==tag.key);
					if(selected.length>0){
						return selected[0].value;
					}else{
						return '';
					}
					
				}
			},
			getLevel(level) {
				if (level == 1) {
					return '高'
				} else if (level == 2) {
					return '中'
				} else if (level == 3) {
					return '低'
				}
			},
			getTaskStatus(status) {
				if (status == 0) {
					return '已撤销'
				} else if (status == 1) {
					return '进行中'
				} else if (status == 3) {
					return '已完成'
				}
			},
			getRunningNodeName(arr) {
				if (arr && arr.length > 0) {
					return arr.join(',')
				} else {
					return ''
				}

			},
			getrePortLevel(level) {
				if (level == 0) {
					return '低'
				} else if (level == 1) {
					return '中低'
				} else if (level == 2) {
					return '中'
				} else if (level == 3) {
					return '中'
				} else if (level == 4) {
					return '高'
				}
			},
			getreportStatus(status) {
				if (status == 0) {
					return '待确认'
				} else if (status == 1) {
					return '已确认'
				} else if (status == 2) {
					return '已处理'
				} else if (status == 3) {
					return '已驳回'
				}
			},


		},
		computed: {
			
			msgTable() {
				let result = [];
				if (this.msg) {
					try {
						JSON.parse(this.msg).map(item => {
							if (Array.isArray(item) && item.length) {
								// console.log(item);
								result = result.concat(item);
							} else if (item.constructor == Object && !item.historyIP && !item.operationSystem && '{}' !== JSON.stringify(
									item)) {
								result.push(item);
							}
						})
					} catch (e) {
						console.log(e);
					}
				}
				console.log(result)
				return result.slice((this.paramsArry.page - 1) * this.paramsArry.size, this.paramsArry.page * this.paramsArry.size);
			},
			workTaskInfoFinish() {
				let obj = {};
				obj.workOrderObject = this.workTaskInfos.workOrderObject;
				obj.dealType = this.workTaskInfos.dealType;
				obj.workOrderId = this.workTaskInfos.workOrderId ?? '';
				obj.taskId = this.workTaskInfos.taskId ?? '';
				obj.processInstanceId = this.workTaskInfos.processInstanceId ?? '';
				obj.deploymentId = this.workTaskInfos.deploymentId ?? '';
				if (obj.dealType == 0 || obj.dealType == 1) {
					obj.approve = 1;
				} else {
					obj.approve = this.workTaskInfos.approve ?? '';
				}
				obj.operation = this.workTaskInfos.operation ?? '';
				obj.approveOpinion = this.workTaskInfos.approveOpinion ?? '';
				obj.sourceId = this.workTaskInfos.sourceId ?? '';
				obj.receiveTime = this.workTaskInfos.receiveTime ?? '';
				obj.nodeDes = this.workTaskInfos.nodeDes ?? '';
				obj.nodeId = this.workTaskInfos.nodeId ?? '';
				obj.outTime = this.workTaskInfos.outTime ?? '';
				return obj;
			},
			workTaskInfo() {
				return this.workTaskInfos;
			},
			analysisFormParams() {
				let obj = {};
				obj.isReject = this.analysisForm.isReject;
				obj.analyzePro = this.analysisForm.analyzePro;
				if (obj.isReject == 1) {
					obj.rejectReason = this.analysisForm.rejectReason;
				} else {
					obj.disposalAdvise = this.analysisForm.disposalAdvise;
				}
				return obj;
			},
			handleFormParams() {
				let obj = {};
				obj.isReject = this.handleForm.isReject;
				obj.disposalType = this.handleForm.disposalType;
				if (obj.isReject == 1) {
					obj.rejectReason = this.handleForm.rejectReason;
				} else {
					obj.adviceReject = this.handleForm.adviceReject;
					if (obj.disposalType == 0) {
						let listArry = this.handleForm.ips.split("\n");
						let newArry = [];
						listArry.forEach(item => {
						    if (item.replace(/\s/ig, '')) {
						        newArry.push(item.replace(/\s/ig, ''));
						    }
						})
						obj.ips = newArry;
					}
					if (obj.disposalType == 0 && obj.isReject != 3) {
						obj.objs = this.handleForm.objs;
					}
					if (obj.disposalType == 1) {
						obj.changeItem = this.handleForm.changeItemZDGZ;
						obj.assetIds = this.handleForm.assetIdsZDGZ;
					}
					if (obj.disposalType == 2) {
						obj.changeItem = this.handleForm.changeItemJCGZ;
						obj.assetIds = this.handleForm.assetIdsJCGZ;
					}
					if (obj.disposalType == 3) {
						obj.assetIds = this.handleForm.assetIdsFWGZ;
					}
					if (obj.disposalType == 4) {
						obj.assetSystemId = this.handleForm.assetSystemId;
						obj.assetUserId = this.handleForm.assetUserId;
					}
					if (obj.disposalType != 0 && obj.disposalType != 5) {
						obj.changeLog = this.handleForm.changeLog;
					}
					if (obj.disposalType == 5) {
						obj.otherMsg = this.handleForm.otherMsg;
					}
				}
				return obj;
			},
		},
		mounted() {
			this.currentTab = this.$getsessionStorage('currentTab');
			let workTaskInfo = this.$getsessionStorage('workTaskInfo');
			this.$set(this, 'workTaskInfos', workTaskInfo)
			console.log('workTaskInfo', workTaskInfo)
			this.$nextTick(() => {
				//告警处置需要的数据
				this.assetList = workTaskInfo.disposeData ?.assets ?? [];
				this.userList = workTaskInfo.disposeData ?.users ?? [];
				this.systemList = workTaskInfo.disposeData ?.systems ?? [];
				this.oneKeyList = workTaskInfo.disposeData ?.closeObject ?? [];
				if (workTaskInfo.fields) {
					this.fieldsForm.fields = workTaskInfo.fields;
				}
				this.initDetail(workTaskInfo.sourceId, workTaskInfo.workOrderId);
				return;


			})
		},
		methods: {
			handdeelIps(ips){
				if(typeof ips ==='string'){
				 return ips;
				}else{
					return ips.join(',');
				}
			},
			//业务人员
			getassetUserId(type){
				let selected = this.userList.filter(item=>item.id==type)
				if(selected.length>0){
					return selected[0].chineseName;
				}else{
					return '';
				}
			},
			//业务系统
			getassetSystemId(type){
				let selected = this.systemList.filter(item=>item.id==type)
				if(selected.length>0){
					return selected[0].system_name;
				}else{
					return '';
				}
			},
			//设备
			getassetIds(type){
				let selected = this.assetList.filter(item=>item.id==type)
				if(selected.length>0){
					return selected[0].name;
				}else{
					return '';
				}
			},
			getObjs(objs){
				let arr = [];
				if(objs.length>0){
					objs.forEach(item=>{
						let selected = this.oneKeyList.filter(tag=>tag.id===item)
						if(selected.length>0){
							arr.push(selected[0].device_name);
						}
					})
				}
				return arr.join(',');
			},
            symbolKey () {
                return Symbol();
            },
			//富文本图片预览
			imageEnlargement(e){
				console.log(e)
				if (e.target.nodeName == 'IMG') {//判断点击富文本内容为img图片
					//this.eduitURL = e.target.currentSrc;
			   		ImagePreview({
			   			images:[e.target.currentSrc],  //获取当前图片src
			   			showIndex:false,
			   			loop:false,
						closeable: true,
			   		})
			   	} else {
			   		console.log("点击内容不为img")
			   	}
			},
			checkShow(type){
				this.agreeStatus = type;
				this.agreeTitle = type==1?'同意':'不同意';
				this.checkDialog = true;
			},
			finishDialogShow() {
				// console.log()
                let workTaskInfo = this.$getsessionStorage('workTaskInfo');
                if ((workTaskInfo.workOrderObject == 1) && workTaskInfo.operation == 0) {
                    this.$refs['analysisForm'].validate((valid) => {
                        if (!valid) {
                            console.log("error submit!!");
                            return false;
                        } else {
                            this.finishDialog = true;
                        }
                    });
                } else if ((workTaskInfo.workOrderObject == 1) && workTaskInfo.operation == 2) {
                    this.$refs['handleForm'].validate((valid) => {
                        if (!valid) {
                            console.log("error submit!!");
                            return false;
                        } else {
                            this.finishDialog = true;
                        }
                    });
                } else {
                    this.finishDialog = true;
                }
			},
			finishConfim() {
				let workTaskInfo = this.$getsessionStorage('workTaskInfo');
				let edit = [],
					handle = {},
					paramsData = null;
				
				//字段编辑
				if ((workTaskInfo.workOrderObject == 1 || workTaskInfo.workOrderObject == 2) && workTaskInfo.dealType == 0) {
					edit = this.$deepCopy(this.fieldsForm.fields)
					paramsData = Object.assign(this.workTaskInfoFinish, {
						edit: edit
					});
				}
				//分析
				if ((workTaskInfo.workOrderObject == 1) && workTaskInfo.operation == 0) {
					handle = this.$deepCopy(this.analysisFormParams)
					paramsData = Object.assign(this.workTaskInfoFinish, {
						handle: handle
					});
				}
				//变更状态
				if((workTaskInfo.workOrderObject == 1)&&workTaskInfo.operation==1){
					handle = this.$deepCopy(this.alarmStatusForm)
					paramsData = Object.assign(this.workTaskInfoFinish,{
						handle:handle
					});
				}
				//处置
				if ((workTaskInfo.workOrderObject == 1) && workTaskInfo.operation == 2) {
					handle = this.$deepCopy(this.handleFormParams)
					paramsData = Object.assign(this.workTaskInfoFinish, {
						handle: handle
					});
				}
				//溯源
				if ((workTaskInfo.workOrderObject == 1) && workTaskInfo.operation == 3) {
					handle = this.$deepCopy(this.backForm)
					paramsData = Object.assign(this.workTaskInfoFinish, {
						handle: handle
					});
				}
				//二线分析
				if ((workTaskInfo.workOrderObject == 1) && workTaskInfo.operation == 4) {
					handle = this.$deepCopy(this.alarmAddviceForm)
					paramsData = Object.assign(this.workTaskInfoFinish, {
						handle: handle
					});
				}
				//审核
				if (this.currentTab==1&&workTaskInfo.dealType==2) {
					paramsData = this.$deepCopy(this.workTaskInfoFinish);
					paramsData.approve = this.agreeStatus;
					paramsData.approveOpinion = this.checkkForm.approveOpinion;
				}
				console.log('paramsData', paramsData)
				let data = {
					queryData: {},
					paramsData: paramsData
				}
				//
				finish_workTask(data).then(res => {
					console.log('工单任务完成', res)
					this.finishDialog = false;
					this.$message({
						message: '操作成功！',
						type: 'success'
					})
					setTimeout(()=>{
						this.$router.go(-1);
					},1500)
				}).catch(err => {
					console.log(err, 'err')
				})
			},
			dateFormat_inner(row, column, cellValue, index) {
				if (!row.callDateTime) {
					return '';
				}
				var date = new Date(parseInt(row.callDateTime)) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
				var Y = date.getFullYear() + '-'
				var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
				var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
				var h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
				var m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':'
				var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
				return Y + M + D + h + m + s
			},
			back() {
				this.$router.go(-1);
			},
			handleSee(activity) {
				this.historyDialog = true;
			},
			detailData(row) {
				console.log(row);
				this.detailArr = row;
				if (this.detailArr['messaggioOriginale']) {
					this.detailArr['messaggioOriginale'] = this.detailArr['messaggioOriginale'].replace(/##/g, '"')
				}
				this.detailDialog = true;
			},
			initDetail(sourceId, workOrderId) {
				let data = {
					queryData: {},
					paramsData: {
						sourceId: sourceId,
						workOrderId: workOrderId,
					}
				}
				get_workTask_detail(data).then(res => {
					console.log('工单任务详情', res)
					this.$set(this, 'alarmInfo', res.alarmInfo)
					this.msg = res.alarmInfo.msg;
					let arr = [];
					if (res.bpmRecord.length > 0) {
						res.bpmRecord.forEach((item, index) => {
							item.size = 'large';
							item.isOpen = true;
							item.color = 'rgba(0,0,0,1)';
							item.icon = index === 0 ? 'el-icon-circle-check' : 'iconfont icon-circle';
							item.dealContent = JSON.parse(item.dealContent);
							arr.push(item);
						})
					}
					this.bpmRecord = arr;
				}).catch(err => {
					console.log(err, 'err')
				})
			},
			fieldToChinese(params) {
				let obj = {
					// callDateTime: '事件接收时间', // 操作时间
					srcIp: '源地址',
					operation: '操作',
					srcPort: '源端口',
					desIp: '目的地址',
					desPort: '目的端口',
					result: '结果',
					callDuration: '持续时间',
					response: '响应',
					// content: '告警名称',
					eventCategory: '事件分类',
					agreement: '网络协议',
					hostIp: '设备地址',
					alarmName: '设备名称',
					alarmType: '设备类型',
					messaggioOriginale: '原始消息',
					alternateField1: '备用字段1',
					alternateField2: '备用字段2',
					alternateField3: '备用字段3',
					alternateField4: '备用字段4',
					alternateField5: '备用字段5', // 以上安全设备日志
					IPv: 'IP版本',
					protocal: '协议名称',
					streamBegin: '流起始时间',
					streamEnd: '流结束时间',
					//content: '流量包内容',
					sentPacketsNum: '发出的报文包数',
					sentBytesNum: '发出的报文字节数',
					acceptPacketsNum: '接收的报文包数',
					acceptBytesNum: '接收的报文字节数',
					srcIpNAT: 'NAT转换前源地址',
					srcPortNAT: 'NAT转换前源端口',
					desIpNAT: 'NAT转换前目的地址',
					desPortNAT: 'NAT转换前目的端口', // 以上为流日志字段
					userName: '用户名称',
					command: '操作',
					hostName: '主机名称',
					hostType: '设备类型',
					eventLevel: '事件等级',
					source: '来源',
					eventId: '事件ID',
					taskType: '任务类别', // 以上为主机日志字段

				};
				if (this.detailArr.agreement) {
					obj.content = '告警名称';
					obj.callDateTime = '事件接收时间';
				} else if (this.detailArr.protocal) {
					obj.content = '流量包内容'
				} else if (this.detailArr.userName) {
					obj.callDateTime = '操作时间';
				}
				if (obj[params]) {
					return obj[params] + ' / ' + params + '：';
				} else {
					return params + '：';
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	
	.table-container {
	    display: flex;
	    justify-content: flex-start;
	    width: 50%;
	    
	    &:nth-child(2n) {
	        background-color: rgba(29, 65, 105, 0.5);
	    }
	    
	}
	
	.table-left, .table-right {
	    font-size: 16px;
	    border: 1px solid #1a5c92;
	    padding: 4px 10px;
	    background: rgba(3, 50, 84, 0.5);
	}
	
	.table-left {
	    color: #fff;
	    opacity: .6;
	    flex-shrink: 0;
	    border-right: none;
	    padding-right: 10px;
	    text-align: right;
	    width: 160px !important;
	    /*white-space: nowrap;*/
	}
	
	.table-right {
	    width: calc(100% - 160px);
	}
	.event {
		padding: 0px 20px 20px 0px;
		box-sizing: border-box;
		position: relative;
		background-color: #111d2b;
	}

	.event>>>.el-timeline-item__timestamp.is-top {
		margin-bottom: 8px;
		padding-top: 3px;
		position: absolute;
		left: -145px;
		top: 0;
		font-size: 12px;
		width: 130px;
		text-align: right;
		color: #fff;
	}

	.event>>>.el-range-input {
		background-color: rgba(0, 0, 0, 0);
		color: #fff;
	}

	.event>>>.el-range-separator {
		color: #fff;
	}

	.el-tabs>>>.el-tabs__nav-wrap::after {
		content: "";
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 1px;
		background-color: rgba(28, 215, 250, 0.2);
		z-index: 1;
	}

	.el-tabs>>>.el-tabs__active-bar {
		background: #1cd7fa;
		margin-left: 14px;
	}

	.el-tabs>>>.el-tabs__item.is-active {
		color: #1cd7fa;
		height: 34px;
		line-height: 34px;
		border-color: transparent;
	}

	.el-tabs>>>.el-tabs__item.is-top {
		margin-left: 14px;
		color: #1cd7fa;
		border-bottom: 2px solid #1cd7fa;
	}

	.task-status {
		padding-right: 30px;
		box-sizing: border-box;
		margin: 16px 0 30px;
	}

	.task-status>div:nth-child(1) {
		color: #fff;
		font-size: 22px;
	}
	.assets-big-image>>>.el-image-viewer__close {
		color: #00E1FF!important;
	}
	.task-status>div:nth-child(2) {
		color: #fff;
		font-size: 12px;

		span.one {
			color: #c0c0c0;
		}

		span.two {
			color: #fdb900;
		}

		span.three {
			color: #00bffe;
		}
	}

	.label {
		width: 100px;
		font-size: 12px;
		color: #999;
		text-align: right;
		margin-right: 15px;
	}

	.label-val {
		font-size: 12px;
		color: #fff;
	}

	.event>>>.el-timeline-item__tail {
		border-left: 2px solid #00B7EE !important;
	}

	.event>>>.el-timeline-item__icon.el-icon-circle-check {
		color: #00B7EE !important;
		font-size: 20px !important;
	}

	.event>>>.el-timeline-item__icon.icon-circle {
		color: #00B7EE !important;
		font-size: 16px !important;
		font-weight: 500;
	}

	.time-box {
		width: 100%;
	}

	.time-left>h4 {
		color: #fff;
		font-weight: 500;
	}

	.time-left>p {
		color: #999;
		font-size: 12px;
		margin-top: 5px;
	}

	.time-right>div.one {
		color: #c0c0c0;
	}

	.time-right>div.two {
		color: #fdb900;
	}

	.time-right>div.three {
		color: #00bffe;
	}

	.time-right>p {
		color: #fff;
		font-size: 12px;
		margin-top: 5px;
	}

	.time-text-box {
		padding: 5px;
		background-color: rgba(0, 0, 0, .3);
	}

	.event>>>.el-table__empty-block {
		background-color: #111d2b;
	}

	.time-text-box-item {
		margin: 10px 0;
	}

	.time-text-box-left {
		font-size: 12px;
		letter-spacing: 1px;
		color: #00e9ff;
		margin-right: 10px;
		vertical-align: top;
	}

	.time-text-box-right {
		font-size: 12px;
		color: #fff;
		vertical-align: top;

		img {
			width: 60px !important;
			height: 60px !important;
		}
	}

	.time-text-box-bottom {
		margin-right: 40px;

		>i {
			font-size: 10px;
			color: #999;
		}

		>span {
			font-size: 10px;
			color: #999;
		}

		strong {
			font-size: 10px;
			color: rgba(0, 233, 255, .6);
			font-weight: normal;
		}

		strong.users {
			color: rgba(0, 255, 0, .6);
		}
	}

	.event>>>.edui-editor-iframeholder {
		height: 200px !important;
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
	.time-text-box-right *{
		word-break: break-all;
	}
	.time-text-box-right p{
		font-size:12px !important;
	}
	.time-text-box-right img {
		width: 50%!important;
	}
</style>
