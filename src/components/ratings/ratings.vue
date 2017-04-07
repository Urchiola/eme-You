<template >
    <div class="all-ratings" ref="newScroll">
        <div class="ratings-content">
            <div class="show-view">
                <div class="view-left">
                    <h1 class="score">{{seller.score}}</h1>
                    <p class="score-title">综合评分</p>
                    <p class="than-score">高于周边商家{{seller.rankRate}}%</p>
                </div>
                <div class="view-right">
                    <p class="score-wrap">
                        <span class="ser-title">商品相符</span>
                        <star :size="36" :score="seller.foodScore"></star>
                        <span class="right-score">{{seller.foodScore}}</span>
                    </p>
                    <p class="score-wrap">
                        <span class="ser-title">服务态度</span>
                        <star :size="36" :score="seller.serviceScore"></star>
                        <span class="right-score">{{seller.serviceScore}}</span>
                    </p>
                    <p class="delTime-wrap">
                        <span class="ser-title">送达时间</span>
                        <span class="deltime">{{seller.deliveryTime}}分</span>
                    </p>
                </div>
            </div>
            <split></split>
            <sltrating @change-type="sltType" @change-OnlyContent="changeOnlyContent" :ratings="ratings" :OnlyContent="OnlyContent" :selectType="selectType" ></sltrating>
            <!--  :selectType="selectType" :OnlyContent="OnlyContent" :desc="desc" -->
            <div class="rating-wrapper" >
                <ul>
                    <li v-show="needShow(rating.rateType,rating.text)" v-for= "rating in ratings" class="rating-item">
                        <div class="rating-item-box  border-1px">
                            <div class="avatar">
                                <img :src="rating.avatar" class="avatar-img" width="28" height="28">
                            </div>
                            <div class="content">
                                <div class="clearfix">
                                    <h1 class="name fl">{{rating.username}}</h1>
                                    <span class="time fr">{{rating.rateTime | transDate}}</span>
                                </div>
                                <div class="star-wrapper" >
                                    <star :size="24" :score="rating.score"></star>
                                    <span class="delTime" v-show="rating.deliveryTime ">{{rating.deliveryTime}}送达</span>
                                </div>
                                <p class="text">{{rating.text}}</p>
                                <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                                    <span class="icon" :class="{'icon-thumb_up':rating.rateType === 0,'icon-thumb_down':rating.rateType === 1}"></span>
                                    <span class="recommend-text" v-for="txt in rating.recommend">{{txt}}</span>
                                </div>
                            </div>
                            
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import BScroll from 'better-scroll';
import {formatDate} from 'common/js/formateDate.js';
import star from 'components/star/star';
import split from 'components/split/split';
import sltrating from 'components/ratingselect/ratingselect';
const ERR_OK = 0;
const ALL = 2;
    export default {
        props: {
            seller: {
                type: Object
            }
        },
        created() {
            this.$http.get('/api/ratings').then((response) => {
                response = response.body;
                if (response.errno === ERR_OK) {
                    this.ratings = response.data;
                    // better scroll
                    this._initScroll();
                }
            });
        },
        data() {
            return {
                ratings: [],
                showFlag: false,
                // 传入子组件 的几个状态
                selectType: ALL,
                OnlyContent: true
            };
        },
        methods: {
            _initScroll() {
                this.$nextTick(() => {
                    this.listScroll = new BScroll(this.$refs.newScroll, {
                        click: true
                    });
                });
            },
            // 子组件传递回来的值处理
            sltType(id) {
               this.selectType = id;
               // 数据改变 刷新dom  我们这改变了列表页的切换 所以要让better-scroll 重新计算高度
               this.$nextTick(() => {
                   this.listScroll.refresh();
               });
            },
             // 子组件传递回来的值处理
            changeOnlyContent(num) {
                this.OnlyContent = num;
                // 数据改变 刷新dom , 我们这改变了列表页的切换 所以要让better-scroll 重新计算高度
               this.$nextTick(() => {
                   this.listScroll.refresh();
               });
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
            star,
            split,
            sltrating
        },
         filters: {
            // 时间戳转换
            transDate(time) {
                let date = new Date(time);
                return formatDate(date, 'yyyy-M-d h:m');
            }
        }
    };
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl";
    .all-ratings{
        position:absolute
        top:174px
        bottom:0
        left:0
        width:100%
        overflow:hidden
        .show-view{
            padding:18px 0
            display:flex
            .view-left{
                flex:0 0 137px
                @media only screen  and (max-width:320px){
                    flex:0 0 120px
                    width:120px
                }
                width:137px
                text-align:center
                border-right:1px solid rgba(7,17,27,.1)
                .score{
                    font-size:24px
                    color:rgb(255,153,0)
                    line-height:28px
                }
                .score-title{
                    font-size:12px
                    color:rgb(7,17,27)
                    line-height:12px
                    margin:6px 0 8px 0
                }
                .than-score{
                    font-size:10px
                    color:rgba(7,17,27,.6)
                    line-height:10px
                    margin-bottom:6px;
                }
            }
            .view-right{
                flex:1
                padding-left:14px
                @media only screen  and (max-width:320px){
                     padding-left:6px
                 }
                .score-wrap,.delTime-wrap{
                    .ser-title{
                        display:inline-block
                        vertical-align:top
                        font-size:12px
                        color:rgb(7,17,27)  
                    }
                }
                .score-wrap{
                    margin-bottom:8px
                    line-height:18px
                    font-size:0
                    .star{
                        display:inline-block
                        vertical-align:top
                        margin:0 12px
                        .star-item{
                            margin-right:8px
                            @media only screen  and (max-width:320px){
                                margin-right:3px
                            }
                            
                        }
                    }
                }
                .right-score{
                    display:inline-block
                    vertical-align:top
                    font-size:12px
                    color:rgb(255,153,0)
                }
                .delTime-wrap{
                    font-size:0
                    .deltime{
                        display:inline-block
                        vertical-align:top
                        font-size:12px
                        color:rgb(147,154,159)
                        margin-left:12px
                    }
                    
                }
                
            }
        }
        .rating-wrapper{
            .rating-item{
                padding: 18px 18px 0 18px;
                .rating-item-box{
                    display:flex
                    padding-bottom:18px
                    border-1px(rgba(7,17,27,.1))
                    .avatar{
                        flex:0 0 28px
                        width:28px
                        margin-right:12px
                        .avatar-img{
                            border-radius:50%
                        }
                    }
                    .content{
                        flex:1
                        .name,.time{
                            font-size:10px
                            line-height:12px
                        }
                        .name{
                            color:rgb(7,17,27)
                        }
                        .time{
                            color:rgb(147,153,159)
                        }
                        .star-wrapper{
                            margin: 4px 0  6px 0
                            .star{
                                display:inline-block
                                margin-right:6px
                            }
                            .delTime{
                                font-size:10px
                                font-weight:200
                                color:rgb(147,153,159)
                                line-height:12px
                            }
                        }
                        .text{
                            font-size:12px
                            color:rgb(7,17,27)
                            line-height:18px
                            margin-bottom:8px
                        }
                        .recommend{
                            font-size:0
                            .icon{
                                font-size:12px
                                margin-right:8px
                                &.icon-thumb_down{
                                    color:rgb(147,153,159)
                                }
                                &.icon-thumb_up{
                                    color:rgb(0,160,200)
                                }
                            }
                            .recommend-text{
                                display:inline-block
                                font-size:8px
                                color:rgb(147,153,159)
                                line-height:16px
                                padding:0 8px
                                border:1px solid rgba(7,17,27,.1)
                                margin-right:8px
                                margin-bottom:4px
                            }
                        }
                    }
                }
            }
        }
    }
</style>
