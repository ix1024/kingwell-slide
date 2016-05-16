(function(window) {
	var isNumber = function(num) {
		return Object.prototype.toString.call(num) === "[object Number]";
	};
	$.fn.kSlide = function(options) {
		var opts = $.fn.extend({
			name: 'kSlide',
			timeOut: 3000,
			duration: 400,
			zIndex: 10,
			type: 'slide'
		}, options);
		return this.each(function() {
			var that = this,
				ul = $(that).children('ul'),
				li = ul.children('li'),
				len = li.length,
				width,
				height,
				timeout,
				icons = '',
				span,
				init = 0,
				setinterval,
				lock = true,
				status = true;
			if (len <= 1) {
				return;
			}
			for (var i = li.length - 1; i >= 0; i--) {
				icons += '<span></span>';
			}
			$(that).append('<div class="' + opts.name + '-icons" data-main="icons" style="z-index:' + opts.zIndex + 10 + '">' + icons + '</div>');
			span = $(that).children('div[data-main=icons]').children('span');
			span.eq(0).addClass('current').end().click(function() {
				if (!lock) {
					return;
				}
				var index = $(this).index();

				span.removeClass('current');
				$(this).addClass('current');
				init = index;
				_run();
			});
			$(that).mouseenter(function() {
				//clearInterval(setinterval);
				status = false;
			}).mouseleave(function() {
				//setinterval = setInterval(_run, opts.timeOut+opts.duration);
				status = true;
			});

			function _run() {
				clearInterval(setinterval);
				run();
				setinterval = setInterval(run, opts.timeOut + opts.duration);
			}
			li.eq(0).css({
				zIndex: opts.zIndex
			});

			function run() {
				// if (!status) {
				// 	return;
				// }
				if (init >= len) {
					init = 0;
				} else if (init < 0) {
					init = len;
				}
				lock = false;
				span.removeClass('current').eq(init).addClass('current');
				if (opts.type === 'fade') {
					li.each(function(i) {
						if (i === init) {
							$(this)
								.fadeIn(opts.duration, function() {
									lock = true;
								})
								.css({
									zIndex: opts.zIndex
								});
						} else {
							$(this)
								.fadeOut(opts.duration).css({
									zIndex: 0
								});
						}
					});

				} else {
					ul.animate({
						left: -init * $(that).outerWidth()
					}, {
						//easing: 'easeInOutBack',
						duration: 1000,
						complete: function() {
							lock = true;
						}
					}, function() {
						lock = true;
					});
				}
				init++;
			}
			setinterval = setInterval(run, opts.timeOut + opts.duration);
			span.eq(0).click();

			function calc() {
				width = isNumber(opts.width) ? opts.width : $(window).width();
				height = isNumber(opts.height) ? opts.height : $(that).parent().outerHeight();
				$(that).css({
					position: 'relative',
					width: width,
					height: height,
					overflow: 'hidden'
				});
				if (opts.type === 'fade') {
					ul.css({
						width: width,
						left: 0,
						top: 0
					});
					li.css({
						width: width,
						height: height,
						position: 'absolute',
						top: 0,
						left: 0
					});
				} else {
					ul.css({
						width: width * len,
						left: 0,
						top: 0
					});
					li.css({
						width: width,
						height: height,
						'float': 'left'
					});
				}

			}
			calc();

			$(window).resize(function() {
				clearTimeout(timeout);
				timeout = setTimeout(calc, 10);
			});
		});
	};
})(this);