<template>
  <div >
    <v-header :pSeller="seller"></v-header>
    <div class="tab  border-1px">
    	<div class="tab-item">
    		<!--<a v-link="{path:'/seller'}">商品</a>-->
    		 <router-link to="/business">商品</router-link>
    	</div>
    	<div class="tab-item"><router-link to="/ratings">评论</router-link></div>
    	<div class="tab-item"><router-link to="/seller">商家</router-link></div>
    </div>
    <keep-alive><router-view :seller="seller"></router-view></keep-alive>
    <!--<div class="content">
    	content
    </div>-->
    <!--<div class="footer">
      footer
    </div>-->
  </div>
</template>

<script>
import {urlParse} from 'common/js/queryUrl';
import header from './components/header/header.vue';

const ERR_OK = 0;

export default {
  data () {
    return {
      seller: {
         type: Object,
         id: (() => {
           let queryParam = urlParse();
           console.log(queryParam);
           return queryParam.id;
         })()
      }
    };
  },
  created () {
    // 请求商家（id） 数据
    this.$http.get('api/seller?id=' + this.seller.id).then((response) => {
      response = response.body;
      // console.log(response);
      if (response.errno === ERR_OK) {
         // this.seller = response.data;
         // 请求回的数据 直接赋值给 this.seller  会 把 data 里面的 id 覆盖掉
         // 请求回的数据并不包含 id ,所以此链接路径中的Id,并保存到 this.seller
         this.seller = Object.assign({}, this.seller, response.data);
        //  console.log(this.seller);
      }
    });
  },
  components: {
    'v-header': header
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
	/* lang='stylus' rel='stylesheet/stylus' */
 	@import "./common/stylus/mixin.styl" 
	
.tab{
  display: flex
  width: 100%
  height: 40px
  line-height: 40px
  /*border-bottom: 1px solid rgba(7,17,27,0.1)*/
  border-1px(rgba(7,17,27,0.1))
  .tab-item{
    flex: 1
    text-align: center
    & > a{
      display: block;
      &.active{
    	 color:#F01414;
     }
    }
  }
}
</style>
