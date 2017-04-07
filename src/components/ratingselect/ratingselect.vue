<template>
    <div class="ratingselect-wrap">
        <div class="ragings-type border-1px">
            <span class="block positive" @click="selectCur(2,$event)" :class="{'active':selectType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
            <span class="block positive" @click="selectCur(0,$event)" :class="{'active':selectType===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
            <span class="block nagetive" @click="selectCur(1,$event)" :class="{'active':selectType===1}">{{desc.nagetive}}<span class="count">{{nagetives.length}}</span></span>
        </div>
        <div class="switch" @click="toggleContent" :class="{'on':OnlyContent}">
            <span class="icon-check_circle"></span>
            <span class="text">只看有内容的评价</span>
        </div>
    </div>
</template>
<script>
// 正面评价
const POSITIVE = 0;
// 负面评价
const NAGETIVE = 1;
// 所有评价
 var ALL = 2;
    export default {
        props: {
            ratings: {
                type: Array,
                default() {
                    return [];
                }
            },
            selectType: {
                type: Number,
                default: ALL
            },
            OnlyContent: {
                type: Boolean,
                default: false
            },
            desc: {
                type: Object,
                default() {
                    return {
                        all: '全部',
                        positive: '满意',
                        nagetive: '不满意'
                    };
                }
            }
        },
        data() {
            return {
                // 1、创建一个props selectType的副本
                mySelectType: this.selectType,
                myOnlyContent: this.OnlyContent
            };
        },
        methods: {
            selectCur(typeid, event) {
                if (!event._constructed) {
                    return;
                }
                // 3调用 mySelectType 并赋值
                this.mySelectType = typeid;
            },
            toggleContent(event) {
                if (!event._constructed) {
                    return;
                }
                this.myOnlyContent = !this.OnlyContent;
            }
        },
        watch: {
            // 2、监听 props 中的selectType，时时赋值给副本 mySelectType
           selectType(val) {
               this.mySelectType = val;
           },
           // 2、创建一个props selectType的副本 并监听
           mySelectType(typeid) {
               // 4 通知父组件
               this.$emit('change-type', typeid);
           },
           OnlyContent(val) {
               this.myOnlyContent = val;
           },
           myOnlyContent(val) {
               this.$emit('change-OnlyContent', val);
           }
        },
        computed: {
            //
            positives() {
                // 获得 ratings === 1 的数组 好评的个数
                 return this.ratings.filter((rating) => {
                     return rating.rateType === POSITIVE;
                 });
            },
            nagetives() {
                return this.ratings.filter((rating) => {
                     return rating.rateType === NAGETIVE;
                 });
            }
        }
    };
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl";
.ratingselect-wrap{
    .ragings-type{
        padding:18px 0 
        margin:0 18px
        border-1px(rgba(7,17,27,.1))
        font-size:0
        .block{
            display:inline-block
            font-size:12px
            padding:8px 12px
            border-radius:2px
            margin-right:8px
            color:rgb(77,85,93)
            line-height:16px
            .count{
                margin-left:2px
                font-size:8px
            }
            &.active{
                    color:#fff
                }
            &.positive{
                background:rgba(0,160,220,.2)
                &.active{
                    background:rgb(0,160,220)
                }
            }
            &.nagetive{
                background:rgba(77,85,93,.2)
                &.active{
                    background:rgb(77,85,93)
                }
            }
        }
    }
    .switch{
        padding:12px 18px
        border-bottom:1px solid #E6E7E8
        line-height:24px
        font-size:0
        color:rgb(147,153,159)
        &.on{
            .icon-check_circle{
                color:#23C75B
            }
        }
        .icon-check_circle,.text{
            display:inline-block
            vertical-align:top
        }
        .icon-check_circle{
            font-size:24px
            margin-right:4px
        }
        .text{
            font-size:12px
        }
    }
}
</style>
