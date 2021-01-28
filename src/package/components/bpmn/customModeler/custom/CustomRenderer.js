/* eslint-disable no-unused-vars */
import inherits from 'inherits'

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer'

import {
    append as svgAppend,
    create as svgCreate
} from 'tiny-svg'

import { customElements, customConfig, STATICPATH, hasLabelElements } from '../utils/util'
/**
 * A renderer that knows how to render custom elements.
 */
export default function CustomRenderer(eventBus, styles, bpmnRenderer,moddle) {
    BaseRenderer.call(this, eventBus, 2000)
    var computeStyle = styles.computeStyle

    this.drawElements = function(parentNode, element) {
		
		console.log('22222',parentNode)
		
		
        console.log('11111111',element)
        const type = element.type // 获取到类型
        if (type !== 'label') {
            if (customElements.includes(type)) { // or customConfig[type]
                return drawCustomElements(parentNode, element)
            }
            const shape = bpmnRenderer.drawShape(parentNode, element)
            return shape
        } else {
            element
        }
    }
	 // 自定义连线和箭头的颜色
	    const drawConnection = bpmnRenderer.drawConnection;
	    let customConnectionColor = function(visuals, connection){
	        let res = drawConnection.call(bpmnRenderer, visuals, connection)
			console.log('visuals',visuals)
	        let eleId = visuals.childNodes[0].style['marker-end'].split('"')[1]
	        let marker = document.querySelector(eleId)
			console.log('marker',marker)
	        marker.childNodes[0].style.fill = '#2b7a93';
	        marker.childNodes[0].style.stroke = '#2b7a93';
	        visuals.childNodes[0].style.stroke = '#2b7a93';
			let markerNext = marker.nextSibling;
			if(markerNext){
				markerNext.childNodes[0].style.fill = '#2b7a93';
				markerNext.childNodes[0].style.stroke = '#2b7a93';
				markerNext.childNodes[0].style.stroke = '#2b7a93';
			}
			
	        return res
	    }
	    bpmnRenderer.drawConnection = customConnectionColor
}

inherits(CustomRenderer, BaseRenderer)

CustomRenderer.$inject = ['eventBus', 'styles', 'bpmnRenderer','moddle']

CustomRenderer.prototype.canRender = function(element) {
    // ignore labels
    return true
        // return !element.labelTarget;
}

CustomRenderer.prototype.drawShape = function(parentNode, element) {
    return this.drawElements(parentNode, element)
}

CustomRenderer.prototype.getShapePath = function(shape) {
    // console.log(shape)
}

function drawCustomElements(parentNode, element) {
	console.log(223333444,element)
    const { type } = element
	let field, attr ,url;
	if(type==='bpmn:UserTask'){
		let _type = element['camunda:taskType'] ?? element.businessObject.$attrs['camunda:taskType'];
		//_type 0：审批；1：会签；2：业务
		console.log(type+_type)
		attr = customConfig[type+_type].attr;
		url = customConfig[type+_type].url;
	}else{
		attr = customConfig[type].attr;
		url = customConfig[type].url;
	}
	console.log('2424214124124121',url)
    //const url = `${STATICPATH}${field}.png`
    const customIcon = svgCreate('image', {
        ...attr,
        href: url
    })
    element['width'] = attr.width // 这里我是取了巧, 直接修改了元素的宽高
    element['height'] = attr.height
    svgAppend(parentNode, customIcon)
        // 判断是否有name属性来决定是否要渲染出label
    if (!hasLabelElements.includes(type) && element.businessObject.name) {
        const text = svgCreate('text', {
            x: attr.x,
            y: attr.y + attr.height + 20,
            "font-size": "12",
            "fill": "#fff",
        })
        text.innerHTML = element.businessObject.name
        svgAppend(parentNode, text)
        console.log(text)
    }
    return customIcon
}