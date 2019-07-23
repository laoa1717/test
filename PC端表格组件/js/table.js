/*固定表格滑动脚本开始*/
function tableSwiperFunc(init) {
    /*表格主滑动区域*/
    var wrap_body = init.wrap_body;
    var scroll_body = init.scroll_body;
    var wrap_body_width = 0;
    var wrap_body_height = 0;
    var scroll_body_width = 0;
    var scroll_body_height = 0;
    /*表格头部区域*/
    var wrap_head = init.wrap_head;
    var scroll_head = init.scroll_head;
    /*表格左边固定区域*/
    var left_wrap_body = init.left_wrap_body;
    var left_scroll_body = init.left_scroll_body;
    
    transform(scroll_body, "translateX", 0);
    transform(scroll_body, "translateY", 0);
    transform(scroll_head, "translateX", 0);
    transform(left_scroll_body, "translateY", 0);
    
    /* 竖向滚动条 */
    var verticalBarHeight = 0; // 设置竖向滚动条的初始高度
    var verticalBoxHeight = 0; // 设置竖向滚动条外层父级的高度
    var verticalBarRange = []; // 竖向滚动条滚动范围
    var verticalAreaRange = []; // 竖向区域滚动范围
    function setVerticalBar() {
	    wrap_body_height = $(wrap_body).height() - $(wrap_head).height();
	    scroll_body_height = $(scroll_body).height() - $(wrap_head).height();
	    verticalBoxAllHeight = wrap_body_height - 7; // 包括内边距
	    verticalBoxHeight = verticalBoxAllHeight - 44; // 可滑动的区域高度
	  	if (scroll_body_height <= wrap_body_height) {
  			verticalBarHeight = 0;
  			$(init.vertical_bar).parent().css({height: '0', visibility: 'hidden'});
		} else {
			verticalBarHeight = (wrap_body_height/scroll_body_height)*verticalBoxHeight;
			$(init.vertical_bar).parent().css({height: verticalBoxAllHeight, visibility: 'visible', top:$(wrap_head).height()});
			if (verticalBarHeight<50) {
	    		verticalBarHeight = 50;
			}
		}
	    $(init.vertical_bar).height(verticalBarHeight);
	    verticalBarRange = [22,verticalBoxHeight - verticalBarHeight + 22];
	  	verticalAreaRange = [0,scroll_body_height - wrap_body_height];
	}
    setVerticalBar();
  	//竖向滚动条拖动事件
    var startY = 0;
    var endY = 0;
    var top = 22;
    var elemTargetY = 0;
    function down1(e){
    		setVerticalBar();
    		startY = e.clientY;
    		top = $(init.vertical_bar).position().top;
        function move(e){
        		var newTop = 0;
        		endY = e.clientY;
        		newTop = top + endY - startY;
            if (newTop > verticalBarRange[1]) {
                newTop = verticalBarRange[1];
            } else if (newTop < verticalBarRange[0]) {
                newTop = verticalBarRange[0];
            }
            $(init.vertical_bar).css({
                top: newTop
            });
            elemTargetY = verticalAreaRange[1] * ((newTop-verticalBarRange[0]) / (verticalBarRange[1]-verticalBarRange[0]));
            transform(scroll_body, "translateY", -elemTargetY);
            transform(left_scroll_body, "translateY", -elemTargetY);
         }
           
       	function up(){
           $(document).off('mousemove');
           $(document).off('mouseup');
           //释放捕获
           init.vertical_bar.releaseCapture && init.vertical_bar.releaseCapture();
        }
       	$(document).on('mousemove',move);
       	$(document).on('mouseup',up);
        //设置捕获
        init.vertical_bar.setCapture && init.vertical_bar.setCapture();
        //阻止浏览器默认事件
        e.preventDefault && e.preventDefault();
        return false;
    }
    $(init.vertical_bar).on('mousedown',down1);
  	//竖向滚动条滚轮事件
    $('.scroll-table-box').on("mousewheel DOMMouseScroll", function (e) {
				var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1))||
			              (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1)); 
				var dir = '';
				top = $(init.vertical_bar).position().top;
				if (scroll_body_height <= wrap_body_height) {
						return;
				}
		   	if (delta != 0) {
		   			dir = delta > 0 ? 'Up' : 'Down';
		   	    if (dir == 'Up') {
			   	    	top -= 10;
			   	    	if (top<verticalBarRange[0]) {
										top = verticalBarRange[0];
								}
		   	    } else {
			   	    	top += 10;
			   	    	if (top>verticalBarRange[1]) {
										top = verticalBarRange[1];
								}
		   	    }
		   	 		$(init.vertical_bar).css({
                top: top
            });
            elemTargetY = verticalAreaRange[1] * ((top-verticalBarRange[0]) / (verticalBarRange[1]-verticalBarRange[0]));
            transform(scroll_body, "translateY", -elemTargetY);
            transform(left_scroll_body, "translateY", -elemTargetY);
		   	}
		   	return false;
		});
  	//竖向滚动条点击滚动区域自动定位功能
    $('.v-scroll-bar-box').on('click', function(e) {
    		var clickPos = e.clientY + $(window).scrollTop() - $(this).offset().top;
    		var barTop = parseInt($(init.vertical_bar).css('top'));
    		var newTop = 0;
    		//确定新的滚动条top值
    		if (clickPos <= barTop) {
    				newTop = clickPos;
    				if (clickPos<verticalBarRange[0]+30) {
    					newTop = verticalBarRange[0];
						}
				} else {
						newTop = clickPos - verticalBarHeight;
						if (clickPos - verticalBarHeight>verticalBarRange[1]-30) {
    						newTop = verticalBarRange[1];
						}
				}
				if (e.target == $(this)[0]) {
					$(init.vertical_bar).css({
							transition: 'top .3s',
							top: newTop
					});
					$(left_scroll_body).css({
							transition: 'transform .3s'
					});
					$(scroll_body).css({
							transition: 'transform .3s'
					});
					elemTargetY = verticalAreaRange[1] * ((newTop-verticalBarRange[0]) / (verticalBarRange[1]-verticalBarRange[0]));
          transform(scroll_body, "translateY", -elemTargetY);
          transform(left_scroll_body, "translateY", -elemTargetY);
          setTimeout(function() {
        	  $(init.vertical_bar).css({
								transition: 'none',
						});
						$(left_scroll_body).css({
								transition: 'none'
						});
						$(scroll_body).css({
								transition: 'none'
						});
					}, 300);
				}
				
		});
  	
    /* 横向滚动条 */
    var horizontalBarWidth = 0; // 设置横向滚动条的初始宽度
    var horizontalBoxWidth = 0; // 设置横向滚动条外层父级的初始宽度
    var horizontalBarRange = []; // 横向滚动条滚动范围
    var horizontalAreaRange = []; // 横向区域滚动范围
  	function setHorizontalBar() {
  			wrap_body_width = $(wrap_body).width();
  	    scroll_body_width = $(scroll_body).width();
	  	  horizontalBoxAllWidth = wrap_body_width + 5; // 包括内边距
		  	horizontalBoxWidth = horizontalBoxAllWidth - 44; // 可滑动的区域宽度
  	  	if (scroll_body_width <= wrap_body_width) {
  	  			horizontalBarWidth = 0;
						$(init.horizontal_bar).parent().css({width: '0', visibility: 'hidden'});
				} else {
						horizontalBarWidth = (wrap_body_width/scroll_body_width)*horizontalBoxWidth;
						$(init.horizontal_bar).parent().css({width: horizontalBoxAllWidth, visibility: 'visible'});
		  	    if (horizontalBarWidth<50) {
		  	    		horizontalBarWidth = 50;
		  			}
				}
  	    $(init.horizontal_bar).width(horizontalBarWidth);
  	    horizontalBarRange = [22,horizontalBoxWidth - horizontalBarWidth + 22]; // 22为左边内边距的距离
  	  	horizontalAreaRange = [0,scroll_body_width - wrap_body_width];
		}
  	setHorizontalBar();
    //横向滚动条拖动事件
    var startX = 0;
    var endX = 0;
    var left = 22;
    var elemTargetX = 0;
    function down2(e){
    		setHorizontalBar();
				startX = e.clientX;
		    left = $(init.horizontal_bar).position().left;
        function move(e){
        		var newLeft = 0;
            endX = e.clientX;
            newLeft = left + endX - startX;
            // 限制区域
            if (newLeft > horizontalBarRange[1]) {
                newLeft = horizontalBarRange[1];
            } else if (newLeft < horizontalBarRange[0]) {
                newLeft = horizontalBarRange[0];
            }
            // 控制左边固定区域显隐
            if (newLeft > horizontalBarRange[0]) {
            	$('.scroll-table-fixed-left').removeClass('hide');
            } else {
            	$('.scroll-table-fixed-left').addClass('hide');
            }
            
            $(init.horizontal_bar).css({
                left: newLeft
            });
            elemTargetX = horizontalAreaRange[1] * ((newLeft-horizontalBarRange[0]) / (horizontalBarRange[1]-horizontalBarRange[0]));
            transform(scroll_head, "translateX", -elemTargetX);
            transform(scroll_body, "translateX", -elemTargetX);
         }
           
       	function up(){
           $(document).off('mousemove');
           $(document).off('mouseup');
           //释放捕获
           init.horizontal_bar.releaseCapture && init.horizontal_bar.releaseCapture();
        }
       	$(document).on('mousemove',move);
       	$(document).on('mouseup',up);
        //设置捕获
        init.horizontal_bar.setCapture && init.horizontal_bar.setCapture();
        //阻止浏览器默认事件
        e.preventDefault && e.preventDefault();
        return false;
    }
    $(init.horizontal_bar).on('mousedown',down2);
    //横向滚动条点击滚动区域自动定位功能
    $('.scroll-bar-box').on('click', function(e) {
    		var clickPos = e.clientX - $(this).offset().left;
    		var barLeft = parseInt($(init.horizontal_bar).css('left'));
    		var newLeft = 0;
    		//确定新的滚动条left值
    		if (clickPos <= barLeft) {
    				newLeft = clickPos;
    				if (clickPos<horizontalBarRange[0]+30) {
    						newLeft = horizontalBarRange[0];
						}
				} else {
						newLeft = clickPos - horizontalBarWidth;
						if (clickPos-horizontalBarWidth>horizontalBarRange[1]-30) {
    						newLeft = horizontalBarRange[1];
						}
				}
				if (e.target == $(this)[0]) {
					// 控制左边固定区域显隐
          if (newLeft > horizontalBarRange[0]) {
          	$('.scroll-table-fixed-left').removeClass('hide');
          } else {
          	$('.scroll-table-fixed-left').addClass('hide');
          }
					$(init.horizontal_bar).css({
							transition: 'left .3s',
							left: newLeft
					});
					$(scroll_head).css({
							transition: 'transform .3s'
					});
					$(scroll_body).css({
							transition: 'transform .3s'
					});
					elemTargetX = horizontalAreaRange[1] * ((newLeft-horizontalBarRange[0]) / (horizontalBarRange[1]-horizontalBarRange[0]));
          transform(scroll_head, "translateX", -elemTargetX);
          transform(scroll_body, "translateX", -elemTargetX);
          setTimeout(function() {
        	  $(init.horizontal_bar).css({
								transition: 'none',
						});
						$(scroll_head).css({
								transition: 'none'
						});
						$(scroll_body).css({
								transition: 'none'
						});
					}, 300);
				}
				
		});
    
}
function calcRowHeight() {
		var row_h = [];
  	var self = this;
  	$('.scroll-table-fixed-left-head tr').height($('.scroll-table-head tr').height());
		$('.scroll-table-body tbody tr').each(function(index, item) {
			var h = $(item).height();
			row_h.push(h);
		});
		$('.scroll-table-fixed-left-body tr').each(function(index, item) {
			if (self.tableHasRowspan) {
				var rowSpan = parseInt($(item).find('td').attr('rowspan')) ? parseInt($(item).find('td').attr('rowspan')) : 0;
				var total_h = 0;
				var start = index;
				var end = index + rowSpan;
				var array_h = row_h.slice(start,end);
				if (array_h.length > 0) {
					array_h.forEach(function(item) {
						total_h = com.accAdd(total_h, item);
					});
					if (total_h > 0) {
						$(item).height(total_h);
					}
				}
				if ($(item).hasClass('heji-tr')) {
					$(item).height(row_h[index]);
				}
			} else {
				$(item).height(row_h[index]);
			}
			
		});
}

/*固定表格滑动脚本结束*/