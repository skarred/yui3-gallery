YUI.add("gallery-itsatabkeymanager",function(e,t){"use strict";function n(){n.superclass.constructor.apply(this,arguments)}e.extend(n,e.Plugin.Base,{keyCodeMap:{32:"space",33:"pgup",34:"pgdown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down"},preventDefaultMap:{down:1,end:1,home:1,left:1,pgdown:1,pgup:1,right:1,space:1,up:1},initializer:function(e){this._host=e.host,this._attachEvents(),this.refresh()},destructor:function(){this._detachEvents()},ascend:function(){var e=this._getActiveContainer(),t=this._host,n;return e===t?null:(n=e.ancestor(this.get("itemSelector"),!1,function(e){return e===t}),this.set("activeItem",n,{src:"ascend"}),n)},descend:function(){var e=this.get("activeItem"),t=this.get("anchoredContainerSelector"),n;return!t||!e?null:(n=e.one(t),n?this.first({container:n}):null)},first:function(e){e=e||{};var t=e.container||this.get("host"),n=this.get("disabledSelector"),r=this.get("itemSelector"),i=t.one(this.get("anchoredItemSelector"));while(i&&n&&i.test(n))i=i.next(r);return e.silent||this.set("activeItem",i,{src:"first"}),i},last:function(e){e=e||{};var t=e.container||this._host,n=this.get("disabledSelector"),r=t.all(this.get("anchoredItemSelector")),i=r.pop();while(i&&n&&i.test(n))i=r.pop();return e.silent||this.set("activeItem",i,{src:"last"}),i},next:function(t){t=t||{};var n=this.get("activeItem"),r,i,s;if(!n)return null;r=this.get("disabledSelector"),i=this.get("itemSelector"),s=n.next(i);while(s&&r&&s.test(r))s=s.next(i);return s?t.silent||this.set("activeItem",s,{src:"next"}):this.get("circular")&&(s=this.first(e.merge(t,{container:this._getActiveContainer(n)}))),s||n},previous:function(t){t=t||{};var n=this.get("activeItem"),r,i,s;if(!n)return null;r=this.get("disabledSelector"),i=this.get("itemSelector"),s=n.previous(i);while(s&&r&&s.test(r))s=s.previous(i);return s?t.silent||this.set("activeItem",s,{src:"previous"}):s=this.last(e.merge(t,{container:this._getActiveContainer(n)})),s||n},refresh:function(e){var t=this.get("activeItem"),n=this.get("disabledSelector"),r=this.get(e?"anchoredItemSelector":"itemSelector");return(e||this._host).all(r).each(function(e){n&&e.test(n)?e.removeAttribute("tabIndex"):e.set("tabIndex",e===t?0:-1)}),this},_attachEvents:function(){var e=this._host;this._events=[e.on("keydown",this._onKeyDown,this),e.after("blur",this._afterBlur,this),e.after("focus",this._afterFocus,this),this.after({activeItemChange:this._afterActiveItemChange})]},_detachEvents:function(){(new e.EventHandle(this._events)).detach()},_getActiveContainer:function(e){var t=this.get("containerSelector"),n=this._host,r;return t?(e||(e=this.get("activeItem")),e?(r=e.ancestor(t,!1,function(e){return e===n}),r||n):n):n},_getAnchoredContainerSelector:function(e){if(e)return e;var t=this.get("containerSelector");return t?">"+t:null},_getAnchoredItemSelector:function(e){return e?e:">"+this.get("itemSelector")},_afterActiveItemChange:function(e){var t=e.newVal,n=e.prevVal;n&&n.set("tabIndex",-1),t&&(t.set("tabIndex",0),this.get("focused")&&t.focus())},_afterBlur:function(){this._set("focused",!1)},_afterFocus:function(e){var t=e.target;this._set("focused",!0),t!==this._host&&t.test(this.get("itemSelector"))&&this.set("activeItem",t,{src:"focus"})},_onKeyDown:function(e){if(e.altKey||e.ctrlKey||e.metaKey||e.shiftKey)return;var t=this.keyCodeMap[e.keyCode]||e.keyCode,n=this.get("keys"),r=n[t]||n[e.keyCode];r&&(this.preventDefaultMap[t]&&e.preventDefault(),typeof r=="string"?this[r].call(this):r.call(this))}},{NAME:"focusManager",NS:"focusManager",ATTRS:{activeItem:{valueFn:function(){return this.first()}},anchoredContainerSelector:{getter:"_getAnchoredContainerSelector"},anchoredItemSelector:{getter:"_getAnchoredItemSelector"},circular:{value:!0},containerSelector:{},disabledSelector:{value:'[aria-disabled="true"], [aria-hidden="true"], [disabled]'},focused:{readOnly:!0,value:!1},itemSelector:{value:"*"},keys:{cloneDefaultValue:"shallow",value:{down:"next",left:"ascend",right:"descend",up:"previous"}}}}),e.namespace("Plugin").FocusManager=n,e.Node.prototype.displayInDoc=function(){var e=this,t=e.inDoc();while(e&&t)t=e.getStyle("display")!=="none",t&&(e=e.get("parentNode"));return t};var r=e.Array,i="itsa-focused",s='[data-focusable="true"]',o="pure-button-primary",u='data-initialfocus="true"';e.namespace("Plugin").ITSATabKeyManager=e.Base.create("itsatabkeymanager",e.Plugin.FocusManager,[],{initializer:function(){var e=this,t;e._eventhandlers=[],e.host=t=e.get("host"),e._bindUI(),e.set("keys",{}),e.set("circular",!0)},destructor:function(){this._clearEventhandlers()},first:function(e){e=e||{};var t=this,n=e&&e.container||t.host,r=t.get("disabledSelector"),i=e&&e.selector||t.get("itemSelector"),s=n&&n.one(i),o=0,u;while(s&&(r&&s.test(r)||s.getStyle("visibility")==="hidden"||!s.displayInDoc()))u=u||n&&n.all(i),s=++o<u.size()?u.item(o):null;return e.silent||t.set("activeItem",s,{src:"first"}),s},focusInitialItem:function(){var e=this,t,n,r,s;e.host.hasClass(i)&&(t=e.first({selector:"["+u+"]"})||((r=e.host.one(".itsa-panelbody"))?e.first({container:r}):null)||e.first({selector:"."+o})||((s=e.host.one(".itsa-panelfooter"))?e.last({container:s}):null)||((n=e.host.one(".itsa-panelheader"))?e.first({container:n}):null)||e.first(),t&&t.focus())},last:function(e){var t=this,n=e&&e.container||t.host,r=t.get("disabledSelector"),i=n&&n.all(t.get("itemSelector")),s=i?i.size()-1:0,o=i.pop();e=e||{};while(o&&(r&&o.test(r)||o.getStyle("visibility")==="hidden"||!o.displayInDoc()))o=--s>=0?i.item(s):null;return e.silent||t.set("activeItem",o,{src:"last"}),o},next:function(e){var t=this,n=e&&e.container||t.host,r=t.get("activeItem"),i,s,o,u,a;e=e||{};if(!r)return t.first(e);i=t.get("disabledSelector"),a=n&&n.all(t.get("itemSelector")),u=a?a.size():0,o=a.indexOf(r),s=++o<u?a.item(o):null;while(s&&(i&&s.test(i)||s.getStyle("visibility")==="hidden"||!s.displayInDoc()))s=++o<u?a.item(o):null;return s?e.silent||this.set("activeItem",s,{src:"next"}):this.get("circular")&&(s=t.first(e)),s||r},previous
:function(e){var t=this,n=e&&e.container||t.host,r=t.get("activeItem"),i,s,o,u;e=e||{};if(!r)return t.first(e);i=t.get("disabledSelector"),u=n&&n.all(t.get("itemSelector")),o=u?u.indexOf(r):0,s=--o>=0?u.item(o):null;while(s&&(i&&s.test(i)||s.getStyle("visibility")==="hidden"||!s.displayInDoc()))s=--o>=0?u.item(o):null;return s?e.silent||this.set("activeItem",s,{src:"previous"}):this.get("circular")&&(s=t.last(e)),s||r},setFirstFocus:function(t){var n=this,r=n.host,i;typeof t=="string"&&(t=e.one(t)),i=t&&n._nodeIsFocusable(t),i&&(r&&r.all("["+u+"]").removeAttribute(u),t.addAttribute(u))},_bindUI:function(){var e=this,t=e.host;e._eventhandlers.push(t.on("keydown",function(t){t.keyCode===9&&(t.preventDefault(),t.shiftKey?e.previous():e.next())})),e._eventhandlers.push(t.after("click",function(n){var r=n.target;t.hasClass(i)&&(r.get("tagName")==="BUTTON"&&e._nodeIsFocusable(r)?r.focus():e._retreiveFocus())}))},_clearEventhandlers:function(){r.each(this._eventhandlers,function(e){e.detach()})},_nodeIsFocusable:function(e){var t=this,n=t.host,r=t.get("disabledSelector"),i=t.get("itemSelector"),s=e&&n&&n.contains(e),o;return o=s&&e.test(i)&&e.getStyle("visibility")!=="hidden"&&e.displayInDoc()&&(!r||!e.test(r)),o},_retreiveFocus:function(){var e=this,t=e.get("activeItem");e.host.hasClass(i)&&(t?t.focus():e.focusInitialItem())}},{NS:"itsatabkeymanager",ATTRS:{itemSelector:{value:s,validator:function(e){return typeof e=="string"}}}})},"gallery-2013.09.25-18-27",{requires:["yui-base","oop","base-base","base-build","event-custom","plugin","node-core","node-style","node-pluginhost","event-focus","selector-css3"]});
