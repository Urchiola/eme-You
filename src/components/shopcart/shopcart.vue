<template>
    <div class="shopcart">
        <div class="content" >
            <div class="content-left" @click="toggleList">
                <div class="logo-wrap">
                    <div class="logo" :class="{'highlight':totalCount>0}">
                        <i class="icon icon-shopping_cart"></i>
                    </div>
                    <div class="num" v-show="totalCount>0" >{{totalCount}}</div>
                </div>
                <div class="price" :class="{'highlight':totalPrice>0}">
                    ￥{{totalPrice}}
                </div>
                <div class="des">
                    另需配送费{{delPrice}}元
                </div>
            </div> 
            <!--@click.stop.prevent   禁止冒泡-->
            <div class="content-right" @click.stop.prevent="pay">
                <div class="pay" :class="{'highlight':totalPrice>=minPrice}" >
                    {{differValue}}
                </div>
            </div>
        </div>
        <div class="ball-container">
            <transition name="drop">
                <div v-for="ball in balls" v-show="ball.show" class="ball">
                    <div class="inner">
                        
                    </div>
                </div>
            </transition>
        </div>
         <transition name='slidtop'>
            <div class="shopcart-list" v-show="listShow" >
                <div class='list-header clearfix'>
                    <h1 class="title">购物车</h1>
                    <span class="empty" @click="clearCart">清空</span>
                </div>
                <div class="list-content" ref='shopcartList'>
                    <ul>
                        <li v-for="food in selectFoods" class="food-item border-1px">
                            <span class="name">{{food.name}}</span>
                            <div class="price">
                                ￥<span>{{food.price*food.count}}</span>
                            </div>
                            <div class="cartCtrl-wrap">
                                <cartcontrol :food="food"></cartcontrol>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
         </transition>
        <transition name='fade'> <div class="list-mask" @click="hidecart" v-show="listShow"></div></transition>
    </div>
    <!---->
</template>
<script>
import BScroll from 'better-scroll';
import cartcontrol from 'components/cartcontrol/cartcontrol';
    export default {
        data() {
            return {
                balls: [{
                    show: false
                }],
                fold: false

            };
        },
        props: {
          selectFoods: {
                type: Array,
                default() {
                    return [
                        {
                            price: 3,
                            count: 4
                        }
                    ];
                }
            },
         // 配送费
          delPrice: {
              type: Number,
              default: 0
          },
          // 起送费，例如20元起送
          minPrice: {
            type: Number,
            default: 0
          }
        },
        methods: {
            drop(el) {
                // el.getBoundingClientRect() 浏览器提供的方法 ，可获取当前元素在视口的当前位置
                console.log(el.getBoundingClientRect());
            },
            toggleList() {
                 if (!this.totalCount) {
                    return;
                } else {
                    this.fold = !this.fold;
                }
            },
            hidecart() {
                this.fold = true;
            },
            // 清空购物车
            clearCart() {
                this.selectFoods.forEach((food) => {
                    food.count = 0;
                });
            },
            pay() {
                 if (this.totalPrice < this.minPrice) {
                   return;
                 }
                 window.alert('去支付：' + this.totalPrice);
            }
        },
       computed: {
          // 计算商品总价
          totalPrice() {
            let total = 0;
            this.selectFoods.forEach((food) => {
                total += food.count * food.price;
            });
            return total;
          },
          // 计算商品总数
          totalCount() {
              let count = 0;
               this.selectFoods.forEach((food) => {
                count += food.count;
            });
            return count;
          },
          // 计算 配送费差值
          differValue() {
            if (this.totalPrice === 0) {
                return '￥' + this.minPrice + '起送';
                // es6 扩展符号
                // return `￥${this.minPrice}起送`
            } else if (this.totalPrice < this.minPrice) {
                let diff = this.minPrice - this.totalPrice;
                return '还差￥' + diff + '起送';
            } else {
                return '去结算';
            }
          },
          // 计算 listShow
          listShow() {
             if (!this.totalCount) {
                this.fold = true;
                return false;
             }
             let show = !this.fold;
             if (show) {
                this.$nextTick(() => {
                   if (!this.scroll) {
                        this.scroll = new BScroll(this.$refs.shopcartList, {
                            click: true
                        });
                   } else {
                       this.scroll.refresh();
                   }
                });
             }
             return show;
          }
       },
       components: {
           cartcontrol
       }
    };
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl";
    
    .shopcart{
        position:fixed
        left:0
        bottom:0
        z-index:50
        width:100%
        height:48px
        .content{
            background:#141d27
            display:flex
            color:rgba(255,255,255,.4)
            .content-left{
                flex:1
                font-size:0
                background:#131D26
                .logo-wrap,.price,.des{
                    display:inline-block
                }
                .logo-wrap{
                    position:relative
                    top:-8px;
                    margin:0 10px 12px 0
                    padding:6px
                    width:56px
                    height:56px
                    box-sizing:border-box
                    vertical-align:top
                    border-radius:50%
                    background:#131D26
                    .logo{
                        width:100%
                        height:100%
                        border-radius:50%
                        text-align:center
                        background:rgba(255,255,255,.2)
                        .icon-shopping_cart{
                            font-size:24px
                            line-height:44px
                            color:rgba(255,255,255,.4)
                        }
                        &.highlight{
                            background:rgb(0,160,220)
                            .icon-shopping_cart{
                                color:rgb(255,255,255)
                            }
                        }
                    }
                    .num{
                        position:absolute
                        top:0
                        right:0
                        padding:0 6px
                        // width:24px
                        height:16px
                        vertical-align:middle
                        line-height:17px
                        color:#fff
                        font-size:9px
                        font-weight:700
                        text-align:center
                        background:rgb(240,20,20)
                        border-radius:8px
                        box-shadow:0 4px 8px rgba(0,0,0,0.4)
                        box-sizing:border-box
                    }
                }
                .price,.des{
                    vertical-align:top
                    color:rgba(255,255,255,.4)
                    line-height:24px
                    margin-top:12px
                }
                .price{
                    font-size:16px
                    padding-right:7px
                    box-sizing:border-box
                    font-weight:700
                    border-right:1px solid rgba(255,255,255,.1)
                    &.highlight{
                        color:rgb(255,255,255)
                    }
                }
                .des{
                    font-size:10px
                    margin-left:8px
                }
            }
            .content-right{
                flex:0 0 105px
                width:105px
                .pay{
                    font-size:12px
                    height:48px
                    line-height:48px
                    text-align:center
                    background:#2B333B
                    font-weight:700
                    &.highlight{
                        color:#fff
                        background:#0F9E42
                    }
                }
            }
        }
        .ball-container{
            .ball{
                position:fixed
                left:32px
                bottom:22px
                z-index:200

            }
        }
        .shopcart-list{
            position:absolute
            left:0
            top:0
            width:100%
            z-index:-2
            transition:all .3s
            transform: translate3d(0,-100%,0) 
            &.slidtop-enter-active{
                transform: translate3d(0,0,0)  
            }
            &.slidtop-leave{
                transition:all .3s
            }
           &.slidtop-enter,&.slidtop-leave-active{
               transform: translate3d(0,0,0) 
            }
            .list-header{
                height:40px
                line-height:40px
                background:#f3f5f7
                padding:0 18px
                border-bottom:1px solid rgba(7,17,27,.1)
                .title,.empty{
                    display:inline-block
                }
                .title{
                    color:rgb(7,17,27)
                    font-size:14px
                    font-weight:200
                    float:left
                }
                .empty{
                    color:rgb(0,160,200)
                    font-size:12px
                    float:right
                }
            }
            .list-content{
                background:#fff
                padding:0 18px 30px  18px
                max-height:217px
                overflow:hidden
                .food-item{
                    position:relative
                    border-1px(rgba(7,17,27,.1))
                    height:48px
                    line-height:48px
                    .name{
                        
                        font-size:14px
                        color:rgb(7,17,27)
                    }
                    .price,.cartCtrl-wrap{
                        position:absolute
                    }
                    .price{
                        
                        right:90px
                        top:0
                        margin-right:6px
                        font-size:14px
                        font-weight:700
                        color:rgb(240,20,20)
                    }
                    .cartCtrl-wrap{
                          right:0
                          top:0
                          .cartctrl{
                              display:inline-block
                          }
                    }
                }
            }
            
        }
        .list-mask{
                position:fixed
                top:0
                left:0
                width:100%
                height:100%
                background:rgba(7,17,27,0.7)
                backdrop-filter: blur(10px);
                z-index:-3
                transition: all .5s
                &.fade-enter-active{
                  background:rgba(7,17,27,0.7)
				}
				&.fade-enter, &.fade-leave-active {
                  background:rgba(7,17,27,0)
				}
            }
    }
</style>
