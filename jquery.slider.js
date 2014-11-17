!(function ($) {
	"use strict";

	var defaults = {
		animduration: 200, // 动画时间
		animspeed: 3000, // 延迟时间
		animtype: 'push', // 动画效果
		direction: 'left', // 默认移动方向
		automatic: true, // 自动开始滚动
		curindex: 0, // 当前下标
		itemparent: '', // 显示项的父节点 可以是标签名、类名、id
		items:  '' // 显示项，配置传入egg： 'ul.news li'
	};

	var animate = {
		push: {
			init: function() {
				var data = this.data('_data');
				console.log(data);
			},
			prev: function() {

			},
			next: function() {

			},
			show: function() {

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
		},
		prev: function() {
			var dom = this.dom,
				option = dom.data('option');
			animate[option.animtype].prev.call(dom);
		},
		show: function(index) {
			var dom = this.dom,
				option = dom.data('option');
			animate[option.animtype].show.call(dom);
		}
	};

	function next() {
		$(this).data();
	}

	function prev() {

	}

	function bindEvents() {
		this.on('next', next)
			.on('prev', prev);
	}

	function initAnimation(name) {
		var anim = animate[name];
		anim.init && anim.init.call(this);
	}

	function init(opt) {
		var me = $(this), data = {};
		
		if(!me[0] || !opt) {
			return;
		}

		opt = $.extend(true, {}, defaults, opt);

		data.items = $(opt.items);

		if(data.items.length) {
			data.width = data.items.eq(0).outerWidth();
			initAnimation.call(me, opt.animtype);
			data.itemparent = data.items.eq(0).closest(opt.itemparent);
		}

		this.data('controller', new Controller(me))
			.data('option', opt)
			.data('_data', data);
	}

	init.defaults = defaults;
	init.animate = animate;

	$.slider = init;
})(jQuery);
