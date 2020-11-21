/* 绑定事件处理函数_兼容 */
function addEvent(el, type, fn){
  if(el.addEventListener){
    el.addEventListener(type, fn, false);
  }else if(el.attachEvent){
    // 因为这个方法中的this默认指向window
    el.attachEvent('on' + type, function(){
      fn.call(el)
    })
  }else{
    el['on' + type] = fn;
  }
}

/* 移除事件处理函数_兼容 */
function removeEvent(el, type, fn){
  if(el.addEventListener){
    el.removeEventListener(type, fn, false);
  }else if(el.attachEvent){
    el.detachEvent('on' + type, fn);
  }else {
    el['on' + type] = null;
  }
}

/* 获取传入元素的所有元素子节点_兼容 */
function myChildren(node){
  var temp = {
    length: 0,
    push: Array.prototype.push,
    splice: Array.prototype.splice
  },
  len = node.childNodes.length;
  for(var i = 0; i < len; i++){
    var childItem = node.childNodes[i];
    if(childItem.nodeType === 1){
      temp.push(childItem);
    }
  }
  return temp;
}

/* 查询第n层父元素节点 */
function elParent(node, n){
  var type = typeof(n);

  if(type === 'undefined'){
    return node.parentNode;
  }else if(n <=0 || type !== 'number'){
    return undefined;
  }

  while(n){
    node = node.parentNode;
    n--;
  }
  return node;
}

/* 查看滚动条滚动的距离_兼容 */
function getScrollOffset(){
  if(window.pageXOffset){
    return {
      top: window.pageYOffset,
      left: window.pageXOffset
    }
  }else{
    return {
      top: document.body.scrollTop + document.documentElement.scrollTop,
      left: document.body.scrollLeft + document.documentElement.scrollLeft
    }
  }
}

/* 
 * 获取鼠标相对于当前文档的坐标-兼容
 * document.documentElement.clientLeft/Top
 * 获取文档偏移值
 */
function pagePos(e){
  var sLeft = getScrollOffset().left,
      sTop = getScrollOffset().top,
      cLeft = document.documentElement.clientLeft || 0,
      cTop = document.documentElement.clientTop || 0;
  return {
    x: e.clientX + sLeft - cLeft,
    y: e.clientY + sTop - cTop
  }
}

/* 获取浏览器可视窗口尺寸_兼容 */
function getViewportSize() {
  if(window.innerWidth){
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }else{
    if(document.compatMode === 'BackCompat'){
      return {
        width: document.body.clientWidth,
        height: document.body.clientHeight
      }
    }else{
      return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
      }
    }
  }
}

/* 获取整个文档大小_兼容 
 * 可视区域 + 滚动距离
 */
function getScrollSize(){
  if(document.body.scrollWidth){
    return {
      width: document.body.scrollWidth,
      height: document.body.scrollHeight
    }
  }else{
    return {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight
    }
  }
}

/* 直接获取距离文档的距离无论父级有没有定位_兼容 */
function getElDocPosition(el){
  var parent = el.offsetParent,
      left = el.offsetLeft,
      top = el.offsetTop;
  while(parent){
    left += parent.offsetLeft;
    top += parent.offsetTop;
    parent = parent.offsetParent;
  }
  return {
    left,
    top
  }
}

/* 获取元素属性_兼容 */
function getStyles(el, prop){
  if(window.getComputedStyle){
    if(prop){
      return parseInt(window.getComputedStyle(el, null)[prop]);
    }else{
      return parseInt(window.getComputedStyle(el, null));
    }
  }else{
    if(prop){
      return el.currentStyle[prop];
    }else{
      return el.currentStyle;
    }
  }
}

/* 阻止事件冒泡_兼容 */
function stopBubble(e){
  var e = e || window.event;
  if(e.stopPropagation){
    e.stopPropagation();
  }else{
    e.cancelBubble = true;
  }
}

/* 阻止默认行为_兼容 */
function preventDefaultEvent(e){
  var e = e || window.event;
  if(e.preventDefault){
    e.preventDefault();
  }else{
    e.returnValue = false;
  }
}


/* 拖拽与点击分离 */
Element.prototype.dragClick = (function(menu, elClick){
  var sTime = 0,
      eTime = 0,
      originPos = [],
      vWidth = getViewportSize().width,
      vHeight = getViewportSize().height,
      maxLeft = vWidth - getStyles(this, 'width'),
      maxTop = vHeight - getStyles(this, 'height'),
      mWidth = getStyles(menu, 'width'),
      mHeight = getStyles(menu, 'height'),
      c1Time = 0,
      c2Time = 0,
      count = 0,
      t = null;
  drag.call(this);

  function drag(){
    var _self = this,
        x,
        y;
    addEvent(this, 'mousedown', function(e){
      var e = e || window.e
          btnCode = e.button;
      if(btnCode === 0){
        sTime = new Date().getTime();
        originPos = [getStyles(this, 'left'), getStyles(this, 'top')];
        x = pagePos(e).x - getStyles(this, 'left');
        y = pagePos(e).y - getStyles(this, 'top');
        addEvent(document, 'mousemove', mouseMove);
        addEvent(document, 'mouseup', mouseUp);
        menu.style.display = 'none';
        stopBubble(e);
        preventDefaultEvent(e);
      }else if(btnCode === 2){
        var mLeft = pagePos(e).x,
            mTop = pagePos(e).y;
        if(mLeft <= 0){
          mLeft = 0;
        }else if(mLeft >= vWidth - mWidth){
          mLeft = mLeft - mWidth;
        }
        if(mTop <= 0){
          mLeft = 0;
        }else if(mTop >= vHeight - mHeight){
          mTop = mTop - mHeight;
        }
        menu.style.display = 'block';
        menu.style.left = mLeft + 'px';
        menu.style.top = mTop + 'px';
      }
      
    });

    addEvent(document, 'contextmenu', function(e){
      var e = e || window.event;
      preventDefaultEvent(e);
    });

    addEvent(document, 'click', function(){
      menu.style.display = 'none';
    });

    addEvent(menu, 'click', function(e){
      var e = e || window.event;
      stopBubble(e);
    });

    function mouseMove(e){
      var e = e || window.e,
          elLeft = pagePos(e).x - x,
          elTop = pagePos(e).y - y;
      elLeft <= 0 ? elLeft = 0 : elLeft;
      elTop <= 0 ? elTop = 0 : elTop;
      elLeft >= maxLeft ? elLeft = maxLeft : elLeft;
      elTop >= maxTop ? elTop = maxTop : elTop;
      _self.style.left = elLeft +'px';
      _self.style.top = elTop +'px';
    }

    function mouseUp(e){
      var e = e || window.e;
      eTime = new Date().getTime();
      if(eTime - sTime < 300){
        _self.style.left = originPos[0] + 'px';
        _self.style.top = originPos[1] + 'px';

        count++;

        if(count === 1){
          c1Time = new Date().getTime();
        }
        if(count === 2){
          c2Time = new Date().getTime();
        }
        if(c1Time && c2Time && (c2Time - c1Time < 300)){
          elClick();
        }
        t = setTimeout(function(){
          c1Time = 0;
          c2Time = 0;
          count = 0;
          clearTimeout(t);
        }, 500)
      }
      removeEvent(document, 'mousemove', mouseMove);
      removeEvent(document, 'mouseup', mouseUp);
    }
  }
});