<template>
    <transition name="rightIn">
        <div v-show="showFlag"  class="food" ref="bfood">
            <div class="content-wrap">
                <div class="food-content">
                    <div class="image-header">
                        <div class="back-wrap" @click="hide">
                            <i class="back-icon icon-arrow_lift"></i>
                        </div>
                        <img :src="food.image" alt="">
                    </div>
                    <div class="content">
                        <h1 class="title">{{food.name}}</h1>
                        <div class="detail">
                            <span class="sell-count">月售{{food.sellCount}}份</span><span class="sell-rating">好评率{{food.rating}}%</span>
                        </div>
                        <div class="price">
                            <span class="now">￥{{food.price}}</span><s class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</s>
                        </div>
                    </div>
                    <div class="cartctrl-wrap">
                        <div class="buy" @click.stop.prevent="addFirstFood"  v-show=" !food.count || food.count === 0">加入购物车</div>
                        <cartctrl  v-show="food.count > 0" :food="food"></cartctrl>
                    </div>
                </div>
                <split></split>
                <div class="shop-present">
                    <div class="title">商品介绍</div>
                    <div class="shop-info" v-show="food.info">{{food.info}}</div>
                </div>
                <split></split>
                <div class="shop-ratings">
                    <div class="title">商品评价</div>
                    <div class="ratings-box">
                        <sltrating @change-type="sltType" @change-OnlyContent="changeOnlyContent" :selectType="selectType" :OnlyContent="OnlyContent" :desc="desc" :ratings="food.ratings" ></sltrating>
                    </div>
                </div>
                <div class="rating-wrap">
                    <ul v-show="food.ratings && food.ratings.length">
                        <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings">
                            <div class="rating-a border-1px">
                                <div class="user clearfix">
                                    <span class="time fl">{{rating.rateTime | transDate}}</span><span class="name fr">{{rating.username}} <img class="avatar" :src="rating.avatar" width="12" heihgt="12"></span>
                                </div>
                                <div class="content">
                                    <i class="icon" :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></i>
                                    <span class="text">{{rating.text}}</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div class="no-ratings" v-show="!food.ratings || !food.ratings.length">
                        暂无评论信息
                    </div>
                </div>
            </div>
            
        </div>
    </transition>
</template>
<script >
import BScroll from 'better-scroll';
import Vue from 'vue';
import cartctrl from 'components/cartcontrol/cartcontrol';
import split from 'components/split/split';
import sltrating from 'components/ratingselect/ratingselect';
import {formatDate} from 'common/js/formateDate.js';
// 负面评价
// const POSITIVE = 0;
// 正面评价
// const NAGETIVE = 1;
// 所有评价
 var ALL = 2;
    export default {
        props: {
            food: {
                type: Object
            }
        },
        data() {
            return {
                showFlag: false,
                // 传入子组件 的几个状态
                selectType: ALL,
                OnlyContent: true,
                desc: {
                    all: '全部',
                    positive: '推荐',
                    nagetive: '吐槽'
                }
            };
        },
        filters: {
            transDate(time) {
                let date = new Date(time);
                return formatDate(date, 'yyyy-M-d h:m');
            }
        },
        methods: {
            show() {
                this.showFlag = true;
                // 初始化几个状态
                this.selectType = 2;
                this.OnlyContent = false;
                // 当页面出现时 调用 better scroll
                this.$nextTick(() => {
                    if (!this.nscroll) {
                        this.nscroll = new BScroll(this.$refs.bfood, {
                            click: true
                        });
                    } else {
                        this.nscroll.refresh();
                    }
                });
            },
            // 子组件传递回来的值处理
            sltType(id) {
               this.selectType = id;
               // 数据改变 刷新dom  我们这改变了列表页的切换 所以要让better-scroll 重新计算高度
               this.$nextTick(() => {
                   this.nscroll.refresh();
               });
            },
             // 子组件传递回来的值处理
            changeOnlyContent(num) {
                this.OnlyContent = num;
                // 数据改变 刷新dom , 我们这改变了列表页的切换 所以要让better-scroll 重新计算高度
               this.$nextTick(() => {
                   this.nscroll.refresh();
               });
            },
            hide() {
                this.showFlag = false;
            },
            addFirstFood(event) {
               if (!event._constructed) {
                   return;
               }
               Vue.set(this.food, 'count', 1);
            },
            needShow(type, text) {
                if (this.OnlyContent && !text) {
                    return false;
                }
                if (this.selectType === ALL) {
                    return true;
                } else {
                    return type === this.selectType;
                }
            }
        },
        components: {
            cartctrl,
            split,
            sltrating
        }
    };
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl";
    .food{
        position:fixed
        z-index:48
        top:0
        left:0
        bottom:48px
        width:100%
        background:#fff
        transition: all .3s linear
        transform: translate3d(0,0,0) 
        &.rightIn-enter-active{
            // transform: translate3d(0,0,0) 
        }
       &.rightIn-enter,&.rightIn-leave-active{
            transform: translate3d(100%,0,0) 
        }
        .food-content{
            position:relative
            .image-header{
                position:relative
                width:100%
                height:0
                padding-top:100%
                img{
                    position:absolute
                    top:0
                    left:0
                    width:100%
                    height:100%
                }
                .back-wrap{
                    position:absolute;
                    
                    z-index:2
                    top:14px
                    left:10px
                    .back-icon{
                        display:block
                        padding:10px;
                        font-size:20px
                        color:#fff
                    }  
                }
                
            }
            .content{
                padding:18px
                .title{
                    line-height:12px
                    font-size:14px
                    color:rgb(7,17,27)
                    margin-bottom:8px
                }
                .detail{
                    margin-bottom:18px
                    font-size:0
                    line-height:10px
                    .sell-count,.sell-rating{
                        font-size:10px
                        color:rgb(147,153,159)
                    }
                    .sell-count{
                        margin-right:12px
                    }
                }
                .price{
                    line-height: 24px;
                    .now,.old{
                        font-weight: 700
                    }
                    .now{
                        margin-right: 8px;
                        font-size: 14px;
                        color: #f01414;
                    }
                    .old{
                        font-size: 10px;
                        color: #93999f;
                    }
                }
            }
            .cartctrl-wrap{
                position:absolute;
                z-index:2
                bottom:12px
                right:12px
                .buy{
                    padding:6px 12px
                    line-height:24px
                    background:rgb(0,160,220)
                    border-radius:24px
                    font-size:10px
                    color:#fff
                    box-sizing:border-box
                }
            }
        }
        .shop-present{
            padding:18px
            .title{
                font-size:14px
                color:rgb(7,17,27)
                line-height:28px
                margin-bottom:6px
            }
            .shop-info{
                font-size:12px
                line-height:24px
                color:rgb(77,85,93)
                font-weight:200
            }
        }
        .shop-ratings{
            padding-top: 18px
            // border-bottom:1px solid #c40000
            .title{
                font-size:14px
                color:rgb(7,17,27)
                line-height:14px
                margin-left:6px
            }
            // .ragings-box{
            //     font-size:12px
            // }
        }
        .rating-wrap{
            padding:0 18px 
            .rating-a{
                border-1px(rgba(7,17,27,.1))
                padding:16px 0
                .user{
                    margin-bottom:6px
                    .time,.name{
                        font-size:10px
                        color:rgb(147,153,159)
                        line-height:12px
                    }
                    .avatar{
                        margin-left:6px
                        border-radius:50%
                        vertical-align:middle
                    }
                }
                .content{
                    .icon{
                        font-size:12px
                        line-height:16px
                        margin-right:4px
                        &.icon-thumb_down{
                            color:rgb(147,153,159)
                        }
                        &.icon-thumb_up{
                            color:rgb(0,160,200)
                        }
                    }
                    .text{
                        font-size:12px
                        color:rgb(7,17,27)
                        line-height:16px
                        font-weight:600
                    }
                }
            }
            .no-ratings{
                text-align:center
                color:rgb(147,153,159)
                padding:10px 0  15px 0
            }
        }
        
    }
</style>
