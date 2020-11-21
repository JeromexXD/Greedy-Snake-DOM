var start = document.getElementsByClassName('start')[0];

    addEvent(start, 'click', function(){
      init();
    })

    function init(){
      initGame();
    }

    var initGame = (function(){
      var area = document.getElementsByClassName('area')[0],
          areaW = getStyles(area, 'width'),
          areaH = getStyles(area, 'height');
      var Snake = function(){
        this.bodyArr = [
          {x:0, y:0},
          {x:0, y:15},
          {x:0, y:30},
          {x:0, y:45},
          {x:0, y:60},
          {x:0, y:75}
        ];
        this.dir = 'DOWN',
        this.count = 0,
        this.isDead = false;
      }

      Snake.prototype = {
        init: function(){
          this.initSnake();
          this.createFood();
          this.run();
          this.bindEvent();
        },
        bindEvent: function(){
          var _self = this;
          addEvent(document, 'keydown', function(){
            _self.changeDir.call(_self)
          });
        },
        initSnake: function(){
          var arr = this.bodyArr,
              len = arr.length,
              frag = document.createDocumentFragment(),
              item,
              t = null;
          for(var i = 0;i < len; i++){
            item = arr[i];
            var bodyItem = document.createElement('i');
            bodyItem.className = i === len - 1 ? 'bodyItem head' : 'bodyItem';
            bodyItem.style.left = item.x + 'px';
            bodyItem.style.top = item.y + 'px';
            frag.appendChild(bodyItem);
          }
          area.appendChild(frag);
        },
        move: function(){
          var arr = this.bodyArr,
              len = arr.length;

          for(var i = 0; i < len; i++){
            if(i === len - 1){
              this.setHeadXY(arr);
            }else{
              arr[i].x = arr[i + 1].x;
              arr[i].y = arr[i + 1].y;
            }
          }

          this.removeSnake();
          this.initSnake();
          this.gameOver(arr);
          this.eatFood(arr);
        },
        removeSnake: function(){
          var bodys = document.getElementsByTagName('i');
          while(bodys.length > 0){
            bodys[0].remove();
          }
        },
        run: function(){
          var _self = this;
          t = setInterval(function(){
            _self.move();
          }, 200)
        },
        changeDir: function(e){
          var e = e || window.event,
              code = e.keyCode;
          this.setDir(code);
        },
        setDir: function(code){
          switch(code){
            case 38:
              if(this.dir !== 'TOP' && this.dir !== 'DOWN'){
                this.dir = 'TOP';
              }
              break;
            case 40:
              if(this.dir !== 'TOP' && this.dir !== 'DOWN'){
                this.dir = 'DOWN';
              }
              break;
            case 37:
              if(this.dir !== 'LEFT' && this.dir !== 'RIGHT'){
                this.dir = 'LEFT';
              }
              break;
            case 39:
              if(this.dir !== 'LEFT' && this.dir !== 'RIGHT'){
                this.dir = 'RIGHT';
              }
              break;
            default:
              break;
          }
        },
        setHeadXY: function(arr){
          head = arr[arr.length - 1];
          switch(this.dir){
                case 'TOP':
                  if(head.y <= 0){
                    head.y = areaH - 15;
                  }else{
                    head.y -= 15;
                  }
                  break;
                case 'DOWN':
                  if(head.y >= areaH){
                    head.y = 0;
                  }else{
                    head.y += 15;
                  }
                  break;
                case 'LEFT':
                  if(head.x <= 0){
                    head.x = areaW - 15;
                  }else{
                    head.x -= 15;
                  }
                  break;
                case 'RIGHT':
                  if(head.x >= areaW - 15){
                    head.x = 0;
                  }else{
                    head.x += 15;
                  }
                  break;
                default:
                  break;
              }
        },
        gameOver: function(arr){
          var headX = arr[arr.length - 1].x,
              headY = arr[arr.length - 1].y,
              item,
              _self = this;
          for(var i = 0; i < arr.length - 2; i++){
            item = arr[i];
            if(item.x === headX && item.y === headY){
              setTimeout(function(){
                _self.isDead = true;
                _self.setCount(_self.isDead);
                clearInterval(t);
                _self.removeSnake();
              }, 100)
            }
          }
        },
        createFood: function(){
          var food = document.createElement('span');
          food.className = 'food';
          food.style.left = this.setRandomPos(areaW) * 15 + 'px';
          food.style.top = this.setRandomPos(areaH) * 15 + 'px';
          area.appendChild(food);
        },
        setRandomPos: function(wOrH){
          return Math.floor(Math.random() * (wOrH / 15));
        },
        eatFood: function(arr){
          var food = document.getElementsByClassName('food')[0],
              foodX = getStyles(food, 'left'),
              foodY = getStyles(food, 'top'),
              headX = arr[arr.length - 1].x,
              headY = arr[arr.length - 1].y,
              x,
              y;
          if(headX === foodX && headY === foodY){
            this.foodRemove();
            this.createFood();
            this.setCount(this.isDead);
            if(arr[0].x === arr[1].x){
              x = arr[0].x;
              if(arr[0].y > arr[1].y){
                y = arr[0].y + 15;
              }else if(arr[0].y < arr[1].y){
                y = arr[0].y - 15;
              }
            }else if(arr[0].y === arr[1].y){
              y = arr[0].y;
              if(arr[0].x > arr[1].x){
                x = arr[0].x + 15;
              }else if(arr[0].x < arr[1].x){
                x = arr[0].x - 15;
              }
            }
            arr.unshift({x, y})
          }
        },
        foodRemove:function(){
          var food = document.getElementsByClassName('food')[0];
          food.remove();
        },
        setCount: function(isDead){
          var count = document.getElementsByClassName('count')[0];
          if(!isDead){
            this.count++;
            count.innerHTML = this.count;
          }else{
            alert('game over!!! 当前分数为:' + this.count);
            this.count = 0;
            count.innerHTML = this.count;
            this.foodRemove();
          }
        }
      }

      return new Snake().init();
    });