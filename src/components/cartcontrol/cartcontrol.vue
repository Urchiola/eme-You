<template>
    <div class="cartctrl">
        <transition name="slide">
            <div class="cart-decrease"  @click.stop.prevent="removeCount($event)" v-show="food.count > 0" >
                 <i class='inner icon-remove_circle_outline'></i>
            </div>
        </transition>
        <div class="cart-count" v-show="food.count > 0" >
            {{food.count}}
        </div>
        <div class="cart-add" @click.stop.prevent="addCount($event)">
            <i class='icon icon-add_circle'></i>
        </div>
    </div>
</template>
<script>
import Vue from 'vue';
export default {
     props: {
         food: {
             type: Object
         }
     },
     created() {
         // console.log(this.food);
     },
     methods: {
         addCount(event) {
            // 判断是原生还是betterScroll 派发的
           if (!event._constructed) {
               return;
           }
           // vue 不会对没有的属性进行赋值 例如这里的 food.count,
           // 所以需要在 之前引入 vue   在进行赋值 。
           // 赋值方法： vue.set(this.food,'你需要的字段名','你想要赋的值')
           if (!this.food.count) {
              Vue.set(this.food, 'count', 1);
              // console.log(this.food);
           } else {
               this.food.count++;
           }
           // 小球掉下触发源
           // 点击时派发一个事件，告诉父组件  此处将dom作为参数 告诉父组件 good.vue
          // $dispatch vue2.0废弃 this.$dispatch('cart.add', event.target);
          this.$emit('addCount', event.target);
         },
         removeCount(event) {
              if (!event._constructed) {
               return;
              }
             if (!this.food.count) {
                 return;
             }
             this.food.count--;
         }
     }
};
</script>
<style  lang="stylus" rel="stylesheet/stylus">
.cartctrl{
    // width:200px
    font-size:0
    .cart-decrease,.cart-count,.cart-add{
        vertical-align:top
        display:inline-block
    }
    .cart-count{
        width:24px
        font-size:15px
        padding-top:6px
        line-height:24px
        text-align:center
        color:rgb(147,153,159)
    }
    .cart-decrease,.cart-add{
        padding:6px
        font-size:24px
        line-height:24px
        color:rgb(0,160,200)
    }
    // v-enter v-enter-active v-leave v-leave-active
    .cart-decrease{
        transition: all .2s linear
        transform: translate3d(0,0,0) 
        &.slide-enter-active,&.slide-leave{
        }
        &.slide-enter, &.slide-leave-active{
            transform:translate3d(24px,0, 0)
            opacity: 0
        }
    }
    
}
</style>
