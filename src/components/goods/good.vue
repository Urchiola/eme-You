<template>
	<div class="goods">
		<div class="menu-wrap" ref="menuWrapper">
			<ul>
				<li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex === index}" v-on:click = "selectMenu(index,$event)" >
					<span class="text border-1px">
						<span class="icon" v-show="item.type > 0" :class="classMap[index]"></span>{{item.name}}
					</span>
				</li>
			</ul>
		</div>
		<div class="foods-wrap" ref="foodsWrapper">
			<ul>
				<li class="food-list food-list-hook" v-for="item in goods">
					<h1 class="title">{{item.name}}</h1>
					<ul>
						<li @click="selectCurFood(food,$event)" v-for="food in item.foods" class="food-item  border-1px">
							<div class="food-image">
								<img width="57px" :src="food.icon">
							</div>
							<div  class="content">
								<h2 class="name">{{food.name}}</h2>
								<p class="desc">{{food.description}}</p>
								<div class="extra">
									<span class="count">月售{{food.sellCount}}份</span>
									<span>好评率{{food.rating}}%</span>
								</div>
								<div class="price">
									<span class="now">￥{{food.price}}</span><s class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</s>
								</div>
								<div class="cartctrl-wrap">
									<cartcontrl v-on:addCount="_drop"  :food="food"></cartcontrl>
								</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<shopcart ref="shopcart" :selectFoods="selectFoods" :delPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></shopcart> 
		<food :food="CurFood" ref="food"></food>
	</div>
</template>

<script>
import BScroll from 'better-scroll';
import shopcart from 'components/shopcart/shopcart';
import cartcontrl from 'components/cartcontrol/cartcontrol';
import food from 'components/food/food';
const ERROR_OK = 0;
export default {
    props: {
       seller: {
           type: Object
       }
    },
    data () {
        return {
           goods: [],
           listHeihgt: [],
           scrollY: 0,
           CurFood: {}
        };
    },
    computed: {
       // 计算当前索引值高度
       currentIndex() {
           for (let i = 0; i < this.listHeihgt.length; i++) {
               let height1 = this.listHeihgt[i];
               let height2 = this.listHeihgt[i + 1];
               if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                 return i;
               }
           }
           return 0;
       },
      // 监控添加的food 并保存起来
       selectFoods() {
           let foods = [];
           this.goods.forEach((good) => {
                good.foods.forEach((food) => {
                    if (food.count) {
                     // console.log(food);
                       foods.push(food);
                   }
               });
           });
           return foods;
       }
    },
    created () {
       this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];
       this.$http.get('/api/goods').then((response) => {
           response = response.body;
           // errno===0 表示成功
           if (response.errno === ERROR_OK) {
                this.goods = response.data;
                // 滚动效果未成功
                // vue是异步更新数据的，数据变化dom未变化 调用 _initScroll 所以不生效，所以调用 $nextStick() 回调函数
                // 未保证dom渲染成功先执行 $nextTick()
                this.$nextTick(() => {
                   // 調用 _initScroll
                   this._initScroll();
                   this._cacutleteHeihgt();
                });
                // console.log(this.goods);
           }
       });
    },
    methods: {
       selectMenu(index, event) {
           // 在移动端点击事件会执行一次，而在pc端 会执行（包括betterscroll派发的事件）两次事件
           // 当触发原生点击事件时 return
           if (!event._constructed) {
               return;
           }
           // 获取到右侧列表
           let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
           let el = foodList[index];
           this.foodsScroll.scrollToElement(el, 300);
       },
       _initScroll() {
          // console.log(this.$refs.menuWrapper);
          this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          // v-on 绑定会失效，因为betterScroll有监听，则在初始化时 click：true
                click: true
          });
          this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
              // 监听事件的触发时间 1为即时触发，3为延迟到事件完毕后触发
              probeType: 3,
              // 此处 在cartcontrol 组建中 @click 才会生效
              click: true
          });
          // 坚挺后 scroll 事件,并记录滚动高度
          this.foodsScroll.on('scroll', (pos) => {
              // console.log(pos);
              this.scrollY = Math.abs(Math.round(pos.y));
              // console.log(this.scrollY);
          });
       },
       _cacutleteHeihgt() {
           // 1、 計算每個区间的高度 并记录到 listHeihgt当中
           let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
           let height = 0;
           this.listHeihgt.push(height);
           for (let i = 0; i < foodList.length; i++) {
                let item = foodList[i];
                height += item.clientHeight;
                this.listHeihgt.push(height);
           }
           // console.log(this.listHeihgt);
       },
      // 获取子组件（cartcontrol.vue）传递过来的 target，，监听到子组件 必须用 v-on:子组件方法="当前组件方法"
       _drop(target) {
          // console.log(target);
          // 之后可以通过 vue2.0 ref="变量名"添加到使用的组件上，可以访问子组件中的方法，并将 target 传递到其他组件中，
          // 这里传递到子组件(shopcart.vue) 中
          this.$refs.shopcart.drop(target);
       },
        // 点击当前food
       selectCurFood(food, event) {
          if (!event._constructed) {
              return;
          }
           console.log(food);
          this.CurFood = food;
          this.$refs.food.show(food);
       }
    },
    components: {
       shopcart,
       cartcontrl,
       food
    }
     // vue 2.0  events 移除
     // events: {
     //     'cart-add'(target) {
     //        console.log(target);
    //        this._drop(target);
    //     }
     // }
};
</script>

<style  lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl";
	.goods{
		position:absolute
		width:100%
		top:176px
		bottom:46px
		display:flex
		overflow:hidden
		.menu-wrap{
			//等分 缩放型号 占位空间
			flex:0 0 80px
			width:80px
			background:#f3f5f7
			.menu-item{
				display:table
				width:56px
				height:54px
				line-height:14px
				// background:rgba(0,0,0,.3)
				padding:0 12px
				&.current{
					position:relative
					margin-top:-1px
					background:#fff
					.text {
						font-weight:700
						border-none1px()
					}
				}
				.icon{
					display:inline-block
					width:12px
					height:12px
					margin-right:2px
					background-size:12px 12px
					background-repeat:no-repeat
					&.decrease{
					bg-image('decrease_3')  
					}
					&.discount{
						bg-image('discount_3')
					}
					&.guarantee{
						bg-image('guarantee_3')
					}
					&.invoice{
						bg-image('invoice_3')
					}
					&.special{
						bg-image('special_3')
					}
				}
				.text{
					font-size:12px
					vertical-align:middle
					border-1px(rgba(7,17,27,.1))
					display:table-cell
				}
			}
		}
		.foods-wrap{
			flex:1
			.title{
				padding-left:14px;
				height:26px
				line-height:26px
				border-left:2px solid #d9dde1
				font-size:12px
				color:rgb(147,153,159)
				background:#f3f5f7
			}
			.food-item{
				display:flex
				margin:18px
				padding-bottom:18px
				border-1px(rgba(7,17,27,.1))
				&:last-child{
					border-none1px()
					margin-bottom:0
				}
				.food-image{
					flex:0 0 57px
					margin-right:10px
				}
				.content{
					flex:1
					.name{
						font-size:14px
						line-height:14px
						height:14px
						color:rgb(7,17,27)
						margin:2px 0 8px 0
					}
					.desc,.extra{
						font-size:10px
						margin-bottom:10px
						line-height:10px
						color:rgb(147,153,159)
					}
					.desc{
						line-height:12px
					}
					.extra{
						margin-bottom:0
						.count{
							margin-right:7px
							&:last-child{
								margin-right:0
							}
						}
					}
					.price{
						font-weight:700
						line-height:24px
						.now{
							margin-right:8px
							font-size:14px
							color:rgb(240,20,20)
						}
						.old{
							font-size:10px
							color:rgb(147,153,159)
						}
					}
					.cartctrl-wrap{
						position:absolute
						right:0
						bottom:0px
					}
				}
			}

		}
	}
</style>
