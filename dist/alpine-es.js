function _defineProperty(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value:value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}function _objectSpread2(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach((function(key){_defineProperty(target,key,source[key])})):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))}))}return target}function arrayUnique(array){for(var a=array.concat(),i=0;i<a.length;++i)for(var j=i+1;j<a.length;++j)a[i]===a[j]&&a.splice(j--,1);return a}function isTesting(){return navigator.userAgent.includes("Node.js")||navigator.userAgent.includes("jsdom")}function saferEval(expression,dataContext,additionalHelperVariables={}){return new Function(["$data",...Object.keys(additionalHelperVariables)],`var result; with($data) { result = ${expression} }; return result`)(dataContext,...Object.values(additionalHelperVariables))}function isXAttr(attr){const name=replaceAtAndColonWithStandardSyntax(attr.name);return/x-(on|bind|data|text|html|model|if|for|show|cloak|transition|ref)/.test(name)}function getXAttrs(el,type){return Array.from(el.attributes).filter(isXAttr).map(attr=>{const name=replaceAtAndColonWithStandardSyntax(attr.name),typeMatch=name.match(/x-(on|bind|data|text|html|model|if|for|show|cloak|transition|ref)/),valueMatch=name.match(/:([a-zA-Z\-:]+)/),modifiers=name.match(/\.[^.\]]+(?=[^\]]*$)/g)||[];return{type:typeMatch?typeMatch[1]:null,value:valueMatch?valueMatch[1]:null,modifiers:modifiers.map(i=>i.replace(".","")),expression:attr.value}}).filter(i=>!type||i.type===type)}function replaceAtAndColonWithStandardSyntax(name){return name.startsWith("@")?name.replace("@","x-on:"):name.startsWith(":")?name.replace(":","x-bind:"):name}function transitionIn(el,show,forceSkip=!1){if(forceSkip)return show();const attrs=getXAttrs(el,"transition"),showAttr=getXAttrs(el,"show")[0];if(showAttr&&showAttr.modifiers.includes("transition")){let modifiers=showAttr.modifiers;if(modifiers.includes("out")&&!modifiers.includes("in"))return show();const settingBothSidesOfTransition=modifiers.includes("in")&&modifiers.includes("out");modifiers=settingBothSidesOfTransition?modifiers.filter((i,index)=>index<modifiers.indexOf("out")):modifiers,function(el,modifiers,showCallback){const styleValues={duration:modifierValue(modifiers,"duration",150),origin:modifierValue(modifiers,"origin","center"),first:{opacity:0,scale:modifierValue(modifiers,"scale",95)},second:{opacity:1,scale:100}};transitionHelper(el,modifiers,showCallback,()=>{},styleValues)}(el,modifiers,show)}else attrs.length>0?function(el,directives,showCallback){const enter=(directives.find(i=>"enter"===i.value)||{expression:""}).expression.split(" ").filter(i=>""!==i),enterStart=(directives.find(i=>"enter-start"===i.value)||{expression:""}).expression.split(" ").filter(i=>""!==i),enterEnd=(directives.find(i=>"enter-end"===i.value)||{expression:""}).expression.split(" ").filter(i=>""!==i);transitionClasses(el,enter,enterStart,enterEnd,showCallback,()=>{})}(el,attrs,show):show()}function transitionOut(el,hide,forceSkip=!1){if(forceSkip)return hide();const attrs=getXAttrs(el,"transition"),showAttr=getXAttrs(el,"show")[0];if(showAttr&&showAttr.modifiers.includes("transition")){let modifiers=showAttr.modifiers;if(modifiers.includes("in")&&!modifiers.includes("out"))return hide();const settingBothSidesOfTransition=modifiers.includes("in")&&modifiers.includes("out");modifiers=settingBothSidesOfTransition?modifiers.filter((i,index)=>index>modifiers.indexOf("out")):modifiers,function(el,modifiers,settingBothSidesOfTransition,hideCallback){const styleValues={duration:settingBothSidesOfTransition?modifierValue(modifiers,"duration",150):modifierValue(modifiers,"duration",150)/2,origin:modifierValue(modifiers,"origin","center"),first:{opacity:1,scale:100},second:{opacity:0,scale:modifierValue(modifiers,"scale",95)}};transitionHelper(el,modifiers,()=>{},hideCallback,styleValues)}(el,modifiers,settingBothSidesOfTransition,hide)}else attrs.length>0?function(el,directives,hideCallback){const leave=(directives.find(i=>"leave"===i.value)||{expression:""}).expression.split(" ").filter(i=>""!==i),leaveStart=(directives.find(i=>"leave-start"===i.value)||{expression:""}).expression.split(" ").filter(i=>""!==i),leaveEnd=(directives.find(i=>"leave-end"===i.value)||{expression:""}).expression.split(" ").filter(i=>""!==i);transitionClasses(el,leave,leaveStart,leaveEnd,()=>{},hideCallback)}(el,attrs,hide):hide()}function modifierValue(modifiers,key,fallback){if(-1===modifiers.indexOf(key))return fallback;const rawValue=modifiers[modifiers.indexOf(key)+1];if(!rawValue)return fallback;if("scale"===key&&isNaN(rawValue))return fallback;if("duration"===key){let match=rawValue.match(/([0-9]+)ms/);if(match)return match[1]}return"origin"===key&&["top","right","left","center","bottom"].includes(modifiers[modifiers.indexOf(key)+2])?[rawValue,modifiers[modifiers.indexOf(key)+2]].join(" "):rawValue}function transitionHelper(el,modifiers,hook1,hook2,styleValues){const opacityCache=el.style.opacity,transformCache=el.style.transform,transformOriginCache=el.style.transformOrigin,noModifiers=!modifiers.includes("opacity")&&!modifiers.includes("scale"),transitionOpacity=noModifiers||modifiers.includes("opacity"),transitionScale=noModifiers||modifiers.includes("scale"),stages={start(){transitionOpacity&&(el.style.opacity=styleValues.first.opacity),transitionScale&&(el.style.transform=`scale(${styleValues.first.scale/100})`)},during(){transitionScale&&(el.style.transformOrigin=styleValues.origin),el.style.transitionProperty=[transitionOpacity?"opacity":"",transitionScale?"transform":""].join(" ").trim(),el.style.transitionDuration=`${styleValues.duration/1e3}s`,el.style.transitionTimingFunction="cubic-bezier(0.4, 0.0, 0.2, 1)"},show(){hook1()},end(){transitionOpacity&&(el.style.opacity=styleValues.second.opacity),transitionScale&&(el.style.transform=`scale(${styleValues.second.scale/100})`)},hide(){hook2()},cleanup(){transitionOpacity&&(el.style.opacity=opacityCache),transitionScale&&(el.style.transform=transformCache),transitionScale&&(el.style.transformOrigin=transformOriginCache),el.style.transitionProperty=null,el.style.transitionDuration=null,el.style.transitionTimingFunction=null}};transition(el,stages)}function transitionClasses(el,classesDuring,classesStart,classesEnd,hook1,hook2){const originalClasses=el.__x_original_classes||[],stages={start(){el.classList.add(...classesStart)},during(){el.classList.add(...classesDuring)},show(){hook1()},end(){el.classList.remove(...classesStart.filter(i=>!originalClasses.includes(i))),el.classList.add(...classesEnd)},hide(){hook2()},cleanup(){el.classList.remove(...classesDuring.filter(i=>!originalClasses.includes(i))),el.classList.remove(...classesEnd.filter(i=>!originalClasses.includes(i)))}};transition(el,stages)}function transition(el,stages){stages.start(),stages.during(),requestAnimationFrame(()=>{let duration=1e3*Number(getComputedStyle(el).transitionDuration.replace(/,.*/,"").replace("s",""));stages.show(),requestAnimationFrame(()=>{stages.end(),setTimeout(()=>{stages.hide(),el.isConnected&&stages.cleanup()},duration)})})}function deepProxy(target,proxyHandler){if(null===target)return target;if("object"!=typeof target)return target;if(target instanceof Node)return target;if(target.$isAlpineProxy)return target;for(let property in target)target[property]=deepProxy(target[property],proxyHandler);return new Proxy(target,proxyHandler)}function handleForDirective(component,el,expression,initialUpdate){"template"!==el.tagName.toLowerCase()&&console.warn("Alpine: [x-for] directive should only be added to <tempate> tags.");const{single:single,bunch:bunch,iterator1:iterator1,iterator2:iterator2}=function(expression){const forIteratorRE=/,([^,\}\]]*)(?:,([^,\}\]]*))?$/,inMatch=expression.match(/([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/);if(!inMatch)return;const res={};res.bunch=inMatch[2].trim();const single=inMatch[1].trim().replace(/^\(|\)$/g,""),iteratorMatch=single.match(forIteratorRE);iteratorMatch?(res.single=single.replace(forIteratorRE,"").trim(),res.iterator1=iteratorMatch[1].trim(),iteratorMatch[2]&&(res.iterator2=iteratorMatch[2].trim())):res.single=single;return res}(expression);var items;const ifAttr=getXAttrs(el,"if")[0];items=ifAttr&&!component.evaluateReturnExpression(el,ifAttr.expression)?[]:component.evaluateReturnExpression(el,bunch);var previousEl=el;items.forEach((i,index,group)=>{const currentKey=function(component,el,single,iterator1,iterator2,i,index,group){const keyAttr=getXAttrs(el,"bind").filter(attr=>"key"===attr.value)[0];let keyAliases={[single]:i};iterator1&&(keyAliases[iterator1]=index);iterator2&&(keyAliases[iterator2]=group);return keyAttr?component.evaluateReturnExpression(el,keyAttr.expression,()=>keyAliases):index}(component,el,single,iterator1,iterator2,i,index,group);let currentEl=previousEl.nextElementSibling;if(currentEl&&void 0!==currentEl.__x_for_key){if(currentEl.__x_for_key!==currentKey)for(var tmpCurrentEl=currentEl;tmpCurrentEl;){if(tmpCurrentEl.__x_for_key===currentKey){el.parentElement.insertBefore(tmpCurrentEl,currentEl),currentEl=tmpCurrentEl;break}tmpCurrentEl=!(!tmpCurrentEl.nextElementSibling||void 0===tmpCurrentEl.nextElementSibling.__x_for_key)&&tmpCurrentEl.nextElementSibling}delete currentEl.__x_for_key;let xForVars={};xForVars[single]=i,iterator1&&(xForVars[iterator1]=index),iterator2&&(xForVars[iterator2]=group),currentEl.__x_for=xForVars,component.updateElements(currentEl,()=>currentEl.__x_for)}else{const clone=document.importNode(el.content,!0);1!==clone.childElementCount&&console.warn("Alpine: <template> tag with [x-for] encountered with multiple element roots. Make sure <template> only has a single child node."),el.parentElement.insertBefore(clone,currentEl),currentEl=previousEl.nextElementSibling,transitionIn(currentEl,()=>{},initialUpdate);let xForVars={};xForVars[single]=i,iterator1&&(xForVars[iterator1]=index),iterator2&&(xForVars[iterator2]=group),currentEl.__x_for=xForVars,component.initializeElements(currentEl,()=>currentEl.__x_for)}currentEl.__x_for_key=currentKey,previousEl=currentEl});for(var nextElementFromOldLoop=!(!previousEl.nextElementSibling||void 0===previousEl.nextElementSibling.__x_for_key)&&previousEl.nextElementSibling;nextElementFromOldLoop;){const nextElementFromOldLoopImmutable=nextElementFromOldLoop,nextSibling=nextElementFromOldLoop.nextElementSibling;transitionOut(nextElementFromOldLoop,()=>{nextElementFromOldLoopImmutable.remove()}),nextElementFromOldLoop=!(!nextSibling||void 0===nextSibling.__x_for_key)&&nextSibling}}function handleAttributeBindingDirective(component,el,attrName,expression,extraVars){var value=component.evaluateReturnExpression(el,expression,extraVars);if("value"===attrName)if(void 0===value&&expression.match(/\./).length&&(value=""),"radio"===el.type)el.checked=el.value==value;else if("checkbox"===el.type)if(Array.isArray(value)){let valueFound=!1;value.forEach(val=>{val==el.value&&(valueFound=!0)}),el.checked=valueFound}else el.checked=!!value;else"SELECT"===el.tagName?function(el,value){const arrayWrappedValue=[].concat(value).map(value=>value+"");Array.from(el.options).forEach(option=>{option.selected=arrayWrappedValue.includes(option.value||option.text)})}(el,value):el.value=value;else if("class"===attrName)if(Array.isArray(value)){const originalClasses=el.__x_original_classes||[];el.setAttribute("class",arrayUnique(originalClasses.concat(value)).join(" "))}else if("object"==typeof value)Object.keys(value).forEach(classNames=>{value[classNames]?classNames.split(" ").forEach(className=>el.classList.add(className)):classNames.split(" ").forEach(className=>el.classList.remove(className))});else{const originalClasses=el.__x_original_classes||[],newClasses=value.split(" ");el.setAttribute("class",arrayUnique(originalClasses.concat(newClasses)).join(" "))}else["disabled","readonly","required","checked","hidden","selected"].includes(attrName)?value?el.setAttribute(attrName,""):el.removeAttribute(attrName):el.setAttribute(attrName,value)}function registerListener(component,el,event,modifiers,expression,extraVars={}){if(modifiers.includes("away")){const handler=e=>{el.contains(e.target)||el.offsetWidth<1&&el.offsetHeight<1||(runListenerHandler(component,expression,e,extraVars),modifiers.includes("once")&&document.removeEventListener(event,handler))};document.addEventListener(event,handler)}else{const listenerTarget=modifiers.includes("window")?window:modifiers.includes("document")?document:el,handler=e=>{if(function(event){return["keydown","keyup"].includes(event)}(event)&&function(e,modifiers){let keyModifiers=modifiers.filter(i=>!["window","document","prevent","stop"].includes(i));if(0===keyModifiers.length)return!1;if(1===keyModifiers.length&&keyModifiers[0]===keyToModifier(e.key))return!1;const selectedSystemKeyModifiers=["ctrl","shift","alt","meta","cmd","super"].filter(modifier=>keyModifiers.includes(modifier));if(keyModifiers=keyModifiers.filter(i=>!selectedSystemKeyModifiers.includes(i)),selectedSystemKeyModifiers.length>0){if(selectedSystemKeyModifiers.filter(modifier=>("cmd"!==modifier&&"super"!==modifier||(modifier="meta"),e[`${modifier}Key`])).length===selectedSystemKeyModifiers.length&&keyModifiers[0]===keyToModifier(e.key))return!1}return!0}(e,modifiers))return;modifiers.includes("prevent")&&e.preventDefault(),modifiers.includes("stop")&&e.stopPropagation(),!1===runListenerHandler(component,expression,e,extraVars)?e.preventDefault():modifiers.includes("once")&&listenerTarget.removeEventListener(event,handler)};listenerTarget.addEventListener(event,handler)}}function runListenerHandler(component,expression,e,extraVars){return component.evaluateCommandExpression(e.target,expression,()=>_objectSpread2({},extraVars(),{$event:e}))}function keyToModifier(key){switch(key){case"/":return"slash";case" ":case"Spacebar":return"space";default:return key.replace(/([a-z])([A-Z])/g,"$1-$2").replace(/[_\s]/,"-").toLowerCase()}}function generateModelAssignmentFunction(el,modifiers,expression){return"radio"===el.type&&(el.hasAttribute("name")||el.setAttribute("name",expression)),(event,currentValue)=>event instanceof CustomEvent&&event.detail?event.detail:"checkbox"===el.type?Array.isArray(currentValue)?event.target.checked?currentValue.concat([event.target.value]):currentValue.filter(i=>i!==event.target.value):event.target.checked:"select"===el.tagName.toLowerCase()&&el.multiple?modifiers.includes("number")?Array.from(event.target.selectedOptions).map(option=>parseFloat(option.value||option.text)):Array.from(event.target.selectedOptions).map(option=>option.value||option.text):modifiers.includes("number")?parseFloat(event.target.value):modifiers.includes("trim")?event.target.value.trim():event.target.value}class Component{constructor(el,seedDataForCloning=null){this.$el=el;const dataAttr=this.$el.getAttribute("x-data"),dataExpression=""===dataAttr?"{}":dataAttr,initExpression=this.$el.getAttribute("x-init");var initReturnedCallback;this.unobservedData=seedDataForCloning||saferEval(dataExpression,{}),this.$data=this.wrapDataInObservable(this.unobservedData),this.unobservedData.$el=this.$el,this.unobservedData.$refs=this.getRefsProxy(),this.nextTickStack=[],this.unobservedData.$nextTick=callback=>{this.nextTickStack.push(callback)},this.showDirectiveStack=[],this.showDirectiveLastElement,initExpression&&!seedDataForCloning&&(this.pauseReactivity=!0,initReturnedCallback=this.evaluateReturnExpression(this.$el,initExpression),this.pauseReactivity=!1),this.initializeElements(this.$el),this.listenForNewElementsToInitialize(),"function"==typeof initReturnedCallback&&initReturnedCallback.call(this.$data)}getUnobservedData(){let rawData={};return Object.keys(this.unobservedData).forEach(key=>{["$el","$refs","$nextTick"].includes(key)||(rawData[key]=this.unobservedData[key])}),rawData}wrapDataInObservable(data){var self=this;const proxyHandler={set(obj,property,value){const setWasSuccessful=Reflect.set(obj,property,deepProxy(value,proxyHandler));return self.pauseReactivity?setWasSuccessful:((func=()=>{for(self.updateElements(self.$el);self.nextTickStack.length>0;)self.nextTickStack.shift()()},wait=0,function(){var context=this,args=arguments,later=function(){timeout=null,func.apply(context,args)};clearTimeout(timeout),timeout=setTimeout(later,wait)})(),setWasSuccessful);var func,wait,timeout},get:(target,key)=>"$isAlpineProxy"===key||target[key]};return deepProxy(data,proxyHandler)}walkAndSkipNestedComponents(el,callback,initializeComponentCallback=(()=>{})){!function walk(el,callback){if(!1===callback(el))return;let node=el.firstElementChild;for(;node;)walk(node,callback),node=node.nextElementSibling}(el,el=>el.hasAttribute("x-data")&&!el.isSameNode(this.$el)?(el.__x||initializeComponentCallback(el),!1):callback(el))}initializeElements(rootEl,extraVars=(()=>{})){for(this.walkAndSkipNestedComponents(rootEl,el=>{if(void 0!==el.__x_for_key)return!1;this.initializeElement(el,extraVars)},el=>{el.__x=new Component(el)}),this.executeAndClearRemainingShowDirectiveStack();this.nextTickStack.length>0;)this.nextTickStack.shift()()}initializeElement(el,extraVars){el.hasAttribute("class")&&getXAttrs(el).length>0&&(el.__x_original_classes=el.getAttribute("class").split(" ")),this.registerListeners(el,extraVars),this.resolveBoundAttributes(el,!0,extraVars)}updateElements(rootEl,extraVars=(()=>{})){for(this.walkAndSkipNestedComponents(rootEl,el=>{if(void 0!==el.__x_for_key&&!el.isSameNode(this.$el))return!1;this.updateElement(el,extraVars)},el=>{el.__x=new Component(el)}),this.executeAndClearRemainingShowDirectiveStack();this.nextTickStack.length>0;)this.nextTickStack.shift()()}executeAndClearRemainingShowDirectiveStack(){this.showDirectiveStack.reverse().map(thing=>new Promise(resolve=>{thing(finish=>{resolve(finish)})})).reduce((nestedPromise,promise)=>nestedPromise.then(()=>promise.then(finish=>finish())),Promise.resolve(()=>{})),this.showDirectiveStack=[],this.showDirectiveLastElement=void 0}updateElement(el,extraVars){this.resolveBoundAttributes(el,!1,extraVars)}registerListeners(el,extraVars){getXAttrs(el).forEach(({type:type,value:value,modifiers:modifiers,expression:expression})=>{switch(type){case"on":registerListener(this,el,value,modifiers,expression,extraVars);break;case"model":!function(component,el,modifiers,expression,extraVars){var event="select"===el.tagName.toLowerCase()||["checkbox","radio"].includes(el.type)||modifiers.includes("lazy")?"change":"input";registerListener(component,el,event,modifiers,`${expression} = rightSideOfExpression($event, ${expression})`,()=>_objectSpread2({},extraVars(),{rightSideOfExpression:generateModelAssignmentFunction(el,modifiers,expression)}))}(this,el,modifiers,expression,extraVars)}})}resolveBoundAttributes(el,initialUpdate=!1,extraVars){let attrs=getXAttrs(el);attrs.forEach(({type:type,value:value,modifiers:modifiers,expression:expression})=>{switch(type){case"model":handleAttributeBindingDirective(this,el,"value",expression,extraVars);break;case"bind":if("template"===el.tagName.toLowerCase()&&"key"===value)return;handleAttributeBindingDirective(this,el,value,expression,extraVars);break;case"text":void 0===(output=this.evaluateReturnExpression(el,expression,extraVars))&&expression.match(/\./).length&&(output=""),el.innerText=output;break;case"html":el.innerHTML=this.evaluateReturnExpression(el,expression,extraVars);break;case"show":var output=this.evaluateReturnExpression(el,expression,extraVars);!function(component,el,value,modifiers,initialUpdate=!1){const hide=()=>{el.style.display="none"},show=()=>{1===el.style.length&&"none"===el.style.display?el.removeAttribute("style"):el.style.removeProperty("display")};if(!0===initialUpdate)return void(value?show():hide());const handle=resolve=>{value?(""!==el.style.display&&transitionIn(el,()=>{show()}),resolve(()=>{})):"none"!==el.style.display?transitionOut(el,()=>{resolve(()=>{hide()})}):resolve(()=>{})};modifiers.includes("immediate")?handle(finish=>finish()):(component.showDirectiveLastElement&&!component.showDirectiveLastElement.contains(el)&&component.executeAndClearRemainingShowDirectiveStack(),component.showDirectiveStack.push(handle),component.showDirectiveLastElement=el)}(this,el,output,modifiers,initialUpdate);break;case"if":if(attrs.filter(i=>"for"===i.type).length>0)return;output=this.evaluateReturnExpression(el,expression,extraVars);!function(el,expressionResult,initialUpdate){"template"!==el.nodeName.toLowerCase()&&console.warn("Alpine: [x-if] directive should only be added to <template> tags. See https://github.com/alpinejs/alpine#x-if");const elementHasAlreadyBeenAdded=el.nextElementSibling&&!0===el.nextElementSibling.__x_inserted_me;if(expressionResult&&!elementHasAlreadyBeenAdded){const clone=document.importNode(el.content,!0);el.parentElement.insertBefore(clone,el.nextElementSibling),el.nextElementSibling.__x_inserted_me=!0,transitionIn(el.nextElementSibling,()=>{},initialUpdate)}else!expressionResult&&elementHasAlreadyBeenAdded&&transitionOut(el.nextElementSibling,()=>{el.nextElementSibling.remove()},initialUpdate)}(el,output,initialUpdate);break;case"for":handleForDirective(this,el,expression,initialUpdate);break;case"cloak":el.removeAttribute("x-cloak")}})}evaluateReturnExpression(el,expression,extraVars=(()=>{})){return saferEval(expression,this.$data,_objectSpread2({},extraVars(),{$dispatch:this.getDispatchFunction(el)}))}evaluateCommandExpression(el,expression,extraVars=(()=>{})){return function(expression,dataContext,additionalHelperVariables={}){return new Function(["dataContext",...Object.keys(additionalHelperVariables)],`with(dataContext) { ${expression} }`)(dataContext,...Object.values(additionalHelperVariables))}(expression,this.$data,_objectSpread2({},extraVars(),{$dispatch:this.getDispatchFunction(el)}))}getDispatchFunction(el){return(event,detail={})=>{el.dispatchEvent(new CustomEvent(event,{detail:detail,bubbles:!0}))}}listenForNewElementsToInitialize(){const targetNode=this.$el;new MutationObserver(mutations=>{for(let i=0;i<mutations.length;i++){const closestParentComponent=mutations[i].target.closest("[x-data]");if(!closestParentComponent||!closestParentComponent.isSameNode(this.$el))return;if("attributes"===mutations[i].type&&"x-data"===mutations[i].attributeName){const rawData=saferEval(mutations[i].target.getAttribute("x-data"),{});Object.keys(rawData).forEach(key=>{this.$data[key]!==rawData[key]&&(this.$data[key]=rawData[key])})}mutations[i].addedNodes.length>0&&mutations[i].addedNodes.forEach(node=>{1===node.nodeType&&(node.matches("[x-data]")?node.__x=new Component(node):this.initializeElements(node))})}}).observe(targetNode,{childList:!0,attributes:!0,subtree:!0})}getRefsProxy(){var self=this;return new Proxy({},{get(object,property){return"$isAlpineProxy"===property||(self.walkAndSkipNestedComponents(self.$el,el=>{el.hasAttribute("x-ref")&&el.getAttribute("x-ref")===property&&(ref=el)}),ref);var ref}})}}const Alpine={start:async function(){isTesting()||await new Promise(resolve=>{"loading"==document.readyState?document.addEventListener("DOMContentLoaded",resolve):resolve()}),this.discoverComponents(el=>{this.initializeComponent(el)}),document.addEventListener("turbolinks:load",()=>{this.discoverUninitializedComponents(el=>{this.initializeComponent(el)})}),this.listenForNewUninitializedComponentsAtRunTime(el=>{this.initializeComponent(el)})},discoverComponents:function(callback){document.querySelectorAll("[x-data]").forEach(rootEl=>{callback(rootEl)})},discoverUninitializedComponents:function(callback,el=null){const rootEls=(el||document).querySelectorAll("[x-data]");Array.from(rootEls).filter(el=>void 0===el.__x).forEach(rootEl=>{callback(rootEl)})},listenForNewUninitializedComponentsAtRunTime:function(callback){const targetNode=document.querySelector("body");new MutationObserver(mutations=>{for(let i=0;i<mutations.length;i++)mutations[i].addedNodes.length>0&&mutations[i].addedNodes.forEach(node=>{1===node.nodeType&&(node.parentElement&&node.parentElement.closest("[x-data]")||this.discoverUninitializedComponents(el=>{this.initializeComponent(el)},node.parentElement))})}).observe(targetNode,{childList:!0,attributes:!0,subtree:!0})},initializeComponent:function(el){el.__x||(el.__x=new Component(el))},clone:function(component,newEl){newEl.__x||(newEl.__x=new Component(newEl,component.getUnobservedData()))}};isTesting()||(window.Alpine=Alpine,window.Alpine.start());export default Alpine;
//# sourceMappingURL=alpine-es.js.map
