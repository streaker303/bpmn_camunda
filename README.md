## bpmn_camunda

### 在线链接
[https://streaker303.github.io/bpmn_camunda/dist/#/home/work_template](https://streaker303.github.io/bpmn_camunda/dist/#/home/work_template)

### 项目介绍
参考 https://goldsubmarine.github.io/workflow-bpmn-modeler/demo/ 实现bpmn工作流功能
- 利用div的`contenteditable`属性，动态插入变量到光标位置
- 将数据放在`<documentation>`标签内供后台使用读取
- 将数据以自定义属性`"camunda:warn="##"`形式挂到xml的内置元素上，用于回显编辑
- 根据type值区分同一标签`<userTask>`代表的不同流程
- 自定义左侧工具栏和contextPad
- index.vue中其他配置，`flowable`和`camunda`的配置
- 项目中使用到`??`和`?.`，需要升级babel到7.xx版本，安装对应loader

