	var SLIDECHECKBOX='SlideCheckbox',
	CBX = 'contentBox',
	WRAPPER = 'wrapper',
	SLIDER = 'slider',
	SLIDERWRAP = 'sliderwrap',
	LABELON = 'labelOn',
	LABELOFF = 'labelOff',
	HANDLE = 'handle';
	
	Y[SLIDECHECKBOX] = Y.Base.create(
	SLIDECHECKBOX,
	Y.Widget,
	[Y.MakeNode],
		{
			anim : null,
			currentX : null,
			lastX : null,
			renderUI : function() {

				this.src = this.get('srcNode').addClass(this.getClassName('hidden'));
				
				//we have to remove any label around a checkbox to prevent erronous selecting
				var lbl = this.get(CBX).ancestor("label");
				if(lbl){
					lbl.setAttribute("for",Math.random());
				}
				this.get(CBX).append(this._makeNode()).append(this.src);
				
				this._locateNodes();

				var onNode = this._labelOnNode,
				offNode = this._labelOffNode,
				onDiv = onNode.one('div'),
				offDiv = offNode.one('div'),
				leftX = onDiv.get('offsetWidth'),
				rightX = offDiv.get('offsetWidth'), 
				//width is the widest
				width = onNode.get('offsetWidth'),
				skin = this.getSkinName(),
				ios5 = skin? skin.indexOf('ios5') > -1 : null;				
				
				if(leftX > rightX){
					offDiv.setStyle('width',leftX);
				}else{
					onDiv.setStyle('width',rightX);
					width = onNode.get('offsetWidth');
				}
				
				this.left = -onNode.get('offsetWidth') + 3;

				var wrapperWidth = 2 * width;
				
				if(ios5){
					this._slideWrapWidth = 2 * width + 28;
					this.left = this.left + 11;
					wrapperWidth = width + 14;
				}else{
					this._slideWrapWidth = 3 * width + 10;
					this._handleNode.setStyle('width',width - 3);
				}
				this._sliderwrapNode.setStyle('width',this._slideWrapWidth);
				this._wrapperNode.setStyle('width',wrapperWidth);
			},
			bindUI : function(){
				this.disabled = this.src.get('disabled') || this.src.get('readonly');
				
				var dd = new Y.DD.Drag({
					node: this._sliderwrapNode,
					activeHandle : this._handleNode,
					lock: this.disabled
				}),
				cb = this.get(CBX);
				
				this.dd = dd;
				
				this._addDragConstraint(dd);
				
				dd.on('drag:mouseup',function(e){

					//Detect a click in stead of a drag
					if(dd.lastXY[0] === dd.nodeXY[0]){
						this.move();
					}
					
				}, this);
				
				dd.on('drag:drag',function(e){
					var xy = this._wrapperNode.getXY();
					
					//If the node is repositioned we need to reapply the constraint
					if(xy[1] !== dd.actXY[1]){
						dd.unplug();
						this._addDragConstraint(dd);
						e.halt(true);
					}
					
					if(Math.round(dd.actXY[0]) % 2 === 0){
						this.lastX = this.currentX;
					}
					
					this.currentX = dd.actXY[0];
					
				}, this);
				
				dd.on('drag:end',function(e){
					this.currentX = dd.actXY[0];
					this.move();
				}, this);
				
				cb.on('focus',function(){
					cb.on('key',this.goLeft,'down:37',this);
					cb.on('key',this.goRight,'down:39',this);
					cb.on('key',function(e){
						e.preventDefault();
						this.move();
					},'down:32',this);
				},this);
				cb.on('blur',function(){
					cb.detach('key');
					cb.blur();
				},this);
				
			},syncUI : function(){
				this._sliderwrapNode.setStyle('left',this.src.get('checked')?  0 : this.left);
			},destructor : function(){
				this.anim && this.anim.stop().destroy();
				this.dd && this.dd.destroy();
				this.src=null;
			},
			goLeft : function(){
				this.to = this.left;
				this._execute();
			},
			goRight : function(){
				this.to = 0;
				this._execute();
			},
			move : function(){
				this.from = this._replacePx(this._sliderwrapNode.getComputedStyle('left'));
				
				if(this.dd.lastXY[0] !== this.dd.nodeXY[0]){
					if(this.currentX < this.lastX || this.from === this.left){
						this.goLeft();
					}else{
						this.goRight();
					}
				}else{
				
					if(this.from === 0){
						this.goLeft();
					}else{
						this.goRight();
					}
				}
			},
			_addDragConstraint : function(dd){
				var xy = this._wrapperNode.getXY();
				dd.plug(Y.Plugin.DDConstrained, {
					constrain:{
						top:xy[1],
						bottom:xy[1] + this._wrapperNode.get('offsetHeight'),
						right:xy[0] + this._slideWrapWidth,
						left:xy[0] + this.left
					}
				});
			},
			_defaultCB : function(el) {
				return null;
			},
			_execute : function(){
				
				this.focus();
				
				if(this.disabled){
					return;
				}
				
				this.src.set('checked',!this.src.get('checked'));
				
				Y.log( 
					"checked:" + this.src.get('checked') + '<br/>' + 
					"this.from:" + this.from + "<br/>" + 
					"this.currentX:" + this.currentX + "<br/>" + 
					"this.lastX:" + this.lastX + "<br/>" +
					"this.left:" + this.left + "<br/>" +
					"this.dd.lastXY[0]:" + this.dd.lastXY[0] + "<br/>" + 
					"this.dd.nodeXY[0]:" + this.dd.nodeXY[0] + "<br/>********"
					);
				
				if(this.anim === null){
					this.anim = new Y.Anim({
						node: this._sliderwrapNode,
						from: {left:this.from},
						duration: this.get('duration'),
						to: {left:this.to},
						easing: 'easeIn'
					});
				}
				this.lastX = null;
				this.anim.set('from',{left:(this.from? this.from : this.baseX)});
				this.anim.set('to',{left:this.to});
				this.anim.run();

			},
			_replacePx : function(el){
				return parseInt(el.replace('px',''),10);
			}
		},
		{
			ATTRS:{
				duration: {value:0.2},
				strings : {
					value:{
						labelOn: 'ON',
						labelOff: 'OFF'
					}
				}
			},
			_CLASS_NAMES: [WRAPPER,SLIDER,SLIDERWRAP,LABELON,LABELOFF,HANDLE],
			_TEMPLATE: [
				'<div class="{c wrapper}"><span class="edge lt">&nbsp;</span><span class="edge rt">&nbsp;</span>',
				'<div class="{c slider}"><div class="{c sliderwrap}">',
				'<div class="{c labelOn}"><label><div>{s labelOn}</div></label></div>',
				'<div class="{c handle}"><span class="edge lt">&nbsp;</span><span class="edge rt">&nbsp;</span></div>',
				'<div class="{c labelOff}"><label><div>{s labelOff}</div></label></div>',
				'</div></div></div>'
			].join('\n'),
			HTML_PARSER: {
				value: function (srcNode) {
					return srcNode.getAttribute('checked'); 
				}
			}
		}
	);
