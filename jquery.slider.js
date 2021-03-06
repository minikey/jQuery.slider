!(function ($) {
	"use strict";

	var defaults = {
		animduration: 200, // 动画时间
		animspeed: 3000, // 延迟时间
		animtype: 'push', // 动画效果
		automatic: true, // 自动开始滚动
		curindex: 0, // 当前下标
		fixspace: 10,
		itemparent: '', // 显示项的父节点 可以是标签名、类名、id
		items:  '' // 显示项，配置传入egg： 'ul.news li'
	};

	var animate = {
		push: {
			init: function() {
				var data = this.data('_data'),
					option = this.data('option'),
					width = data.width,
					size = data.items.length;
				data.itemparent.width(width * size + option.fixspace);
			},
			prev: function() {
				var option = this.data('option'),
					data = this.data('_data'),
					len = data.items.length;
				show((len - 1 + data.curindex) % len);
			},
			next: function() {
				var option = this.data('option'),
					data = this.data('_data'),
					len = data.items.length;
				show((len + 1 + data.curindex) % len);
			},
			show: function(index) {
				var option = this.data('option'),
					data = this.data('_data'),
					cur =  data.curindex === undefined ? option.curindex : data.curindex,
					det = -index * data.width,
					p = data.itemparent,
					dir = option.direction,
					that = this;
				if (cur == index) {
					return;
				}

				this.trigger('beforeAnimate', [cur]);

				p.stop(false, true).animate({left: det + 'px'}, option.animduration, function() {
					data.curindex = index;
					that.trigger('afterAnimate', [index]);
				});
			},
			auto: function() {
				var option = this.data('option'),
					data = this.data('_data'),
					animspeed = option.animspeed,
					animduration = option.animduration,
					that = this;
				if(option.automatic === true) {
					data.timerId = setTimeout(function() {
						that.data('controller').next().auto();
					}, animspeed);
				}
			}
		}
	};

	function Controller($dom) {
		this.dom = $dom;
	}

	Controller.prototype = {
		next: function() {
			var dom = this.dom,
				option = dom.data('option');
			animate[option.animtype].next.call(dom);
			return this;
		},
		prev: function() {
			var dom = this.dom,
				option = dom.data('option');
			animate[option.animtype].prev.call(dom);
			return this;
		},
		show: function(index) {
			var dom = this.dom,
				option = dom.data('option');
			animate[option.animtype].show.call(dom, index);
			return this;
		},
		auto: function() {
			var dom = this.dom,
				option = dom.data('option');
			animate[option.animtype].auto.call(dom);
			return this;
		},
		stop: function() {
			var data = this.dom.data('_data'),
				timerId = data.timerId;
			return timerId ? (clearTimeout(timerId), true): false;		
		},
		getItem: function(index) {
			var data = this.dom.data('_data');
			return data.items.eq(index);
		},
		getCurIndex: function() {
			var data = this.dom.data('_data');
			return data.curindex;
		}
	};

	function next() {
		$(this).data('controller').next();
	}

	function prev() {
		$(this).data('controller').prev();
	}

	function show(index) {
		$(this).data('controller').show(index);
	}

	function bindEvents() {
		this.on('next', next)
			.on('prev', prev)
			.on('show', show);
	}

	function initAnimation(name) {
		var anim = animate[name];
		anim.init && anim.init.call(this);
		anim.auto && anim.auto.call(this);
	}

	function init(opt) {
		var me = this, data = {};
		
		if(!me[0] || !opt) {
			return;
		}

		opt = $.extend(true, {}, defaults, opt);

		data.items = $(opt.items);
		data.curindex = opt.curindex;

		if(data.items.length) {
			data.width = data.items.eq(0).outerWidth();
			data.itemparent = data.items.eq(0).closest(opt.itemparent);
			this.data('controller', new Controller(this))
				.data('option', opt)
				.data('_data', data);

			initAnimation.call(this, opt.animtype);
		}

		
	}

	init.defaults = defaults;
	init.animate = animate;

	$.fn.slider = init;
})(jQuery);
