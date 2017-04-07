<template>
	<div class="seller" ref="sellerBscroll">
		<div class="seller-content">
			<div class="overview">
				<div class="overview-top border-1px ">
					<div class="clearfix">
						<div class="overview-info fl">
							<h1 class="title">{{seller.name}}</h1>
							<div class="desc">
								<star :size="36" :score="seller.score"></star>
								<span class="text">({{seller.ratingCount}})</span>
								<span class="text">月售{{seller.sellCount}}单</span>
							</div>
						</div>
						<div class="favorite fr" @click="savefavorite">
							<i class="icon icon-favorite" :class="{'active':favorite}"></i>
							<p class="save-favorite">{{favoriteText}}</p>
						</div>
					</div>
				</div>
				<div class="overview-down">
					<ul class="remark">
						<li class="block">
							<h2 class="title">起送价</h2>
							<div class="content">
								<span class="stress">{{seller.minPrice}}</span>元
							</div>
						</li>
						<li class="block">
							<h2 class="title">商家配送</h2>
							<div class="content">
								<span class="stress">{{seller.deliveryPrice}}</span>元
							</div>
						</li>
						<li class="block">
							<h2 class="title">平均配送时间</h2>
							<div class="content">
								<span class="stress">{{seller.deliveryTime}}</span>元
							</div>
						</li>
					</ul>
				</div>
			</div>
			<split></split>
			<div class="bulletin">
				<h1 class="title">公告与活动</h1>
				<div class="content-warp border-1px">
					<p class="content">{{seller.bulletin}}</p>
				</div>
				<ul v-if="seller.supports"  class="supports">
					<!--此处 track-by='$index' vue2.0 已经移除-->
					<li class="supports-item border-1px" v-for="(item,index) in seller.supports">
						<i class="icon" :class="classMap[seller.supports[index].type]" ></i>
						<span class="text">{{seller.supports[index].description}}</span>
					</li>
				</ul>
			</div>
			<split></split>
			<div class="pics">
				<h1 class="title">商家实景</h1>
				<div class="pic-wrap" ref="picWrap">
					<ul class="pic-list" ref="picList">
						<li class="pic-item" v-for="pic in seller.pics">
							<img :src="pic" width="120" height="90">
						</li>
					</ul>
				</div>
			</div>
			<split></split>
			<div class="seller-wrap">
				<h1 class="title">商家信息</h1>
				<ul class="info-list">
					<li v-for="info in seller.infos" class="info-item">{{info}}</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
import BScroll from 'better-scroll';
import star from 'components/star/star';
import split from 'components/split/split';
import {saveToLocal, loadFromLocal} from 'common/js/store';
export default {
    props: {
        seller: {
            type: Object
        }
    },
    data() {
        return {
             favorite: (() => {
                  return loadFromLocal(this.seller.id, 'favorite', false);
             })()
        };
    },
    methods: {
        savefavorite(event) {
            if (!event._constructed) {
                 return;
            }
            this.favorite = !this.favorite;
            saveToLocal(this.seller.id, 'favorite', this.favorite);
        },
       _Bscroll() {
            this.$nextTick(() => {
               if (!this.scroll) {
                     this.scroll = new BScroll(this.$refs.sellerBscroll, {
                          click: true
                     });
                } else {
                      this.scroll.refresh();
                 }
            });
        },
        _Xscroll() {
          if (this.seller.pics) {
            let picWidth = 120;
            let mar = 6;
            let allWidth = (picWidth + mar) * this.seller.pics.length - mar;
            this.$refs.picList.style.width = allWidth + 'px';
            this.$nextTick(() => {
               if (!this.picscrll) {
                   this.picscrll = new BScroll(this.$refs.picWrap, {
                      scrollX: true,
                     // 忽略外部竖向滚动
                     eventPassthrough: 'vertical'
                  });
               } else {
                   this.picscrll.refresh();
               }
            });
          }
        }
    },
    watch: {
        seller() {
           this._Bscroll();
           this._Xscroll();
        }
     },
    created() {
        this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];
    },
    // ready 2.0替换
    mounted() {
        // 加载bscroll
         this._Bscroll();
        // 横向滚动
         this._Xscroll();
    },
    computed: {
        favoriteText() {
            return this.favorite ? '已收藏' : '收藏';
        }
    },
    components: {
        star,
        split
    }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl";
.seller{
	position absolute
	top:174px
	left:0
	bottom:0
	width:100%
	overflow hidden
	.seller-content{
		.overview{
			padding:18px
			.overview-top{
				border-1px(rgba(7,17,27,.1))
				padding-bottom:18px
				.overview-info{
					.title{
						font-size:14px
						color:rgb(7,17,27)
						line-height:14px
					}
					.desc{
						margin-top:8px
						.star,.text{
							display:inline-block 
							vertical-align:top
						}
						.star{
							.star-item{
								@media only screen  and (max-width:320px){
									margin-right:2px
								}
							}
						}
						.text{
							margin-left:8px
							font-size:10px
							color:rgb(77,85,93)
							line-height:18px
						}
					}
				}
				.favorite{
					width:40px
					text-align:center
					.icon{
						font-size:24px
						color:rgb(77,85,93)
						 &.active{
							 color:rgb(240,20,20)
						 }
					}
					.save-favorite{
						margin-top:4px
						font-size:10px
						line-height:10px
						color:rgb(77,85,93)
					}
				}
			}
			.overview-down{
				.remark{
					display:flex
					padding-top:18px
					.block{
						flex:1
						text-align:center
						border-right:1px solid rgba(7,17,27,.1)
						&:last-child{
							border-right:none
						}
						.title{
							color:rgb(147,153,159)
							font-size:10px
							line-height:10px
						}
						.content{
							margin-top:4px
							color:rgb(7,17,27)
							font-size:10px
							.stress{
								font-size:24px
							}
						}
					}
				}
			}
		}
		.bulletin{
			padding:18px 18px 0 18px;
			.title{
				color:rgb(7,17,27)
				font-size:14px
				line-height 14px
			}
			.content-warp{
				padding:0 12px 16px 12px 
				border-1px(rgba(7,17,27,.1))
				margin-top 8px
				color:rgb(240,20,20)
				font-weight:200
				font-size:12px
				line-height 24px
			}
			.supports{
				.supports-item{
					padding:16px 12px
					border-1px(rgba(7,17,27,.1))
					font-size:0
					font-weight 200
					color:rgb(7,17,27)
					line-height 16px
					&:last-child{
						border-none1px()
					}
					.text{
						font-size:12px
					}
					.icon{
						display:inline-block
						width:16px
						height:16px
						vertical-align:top
						margin-right:6px
						background-size:16px 16px
						background-repeat:no-repeat
                        &.decrease{
                            bg-image('decrease_2')  
                        }
						&.discount{
							bg-image('discount_2')
						}
						&.guarantee{
							bg-image('guarantee_2')
						}
						&.invoice{
							bg-image('invoice_2')
						}
						&.special{
							bg-image('special_2')
						}
				  	}
				}
			}

		}
		.pics{
			padding:18px 0 18px 18px
			.title{
				color:rgb(7,17,27)
				font-size:14px
				line-height:14px
				margin-bottom:12px
			}
			.pic-wrap{
				width:100%
				white-space:nowrap
				overflow:hidden
				.pic-list{
					font-size:0
					.pic-item{
						display:inline-block
						width:120px
						height:90px
						margin-right:6px
						&:last-child{
							margin-right:0
						}
					}
				}
			}
		}
		.seller-wrap{
			padding:18px 18px 40px 18px
			.title{
				padding-bottom:12px
				border-1px(rgba(7,17,27,.1))
			}
			.info-list{
				.info-item{
					padding:16px 12px;
					font-size:12px
					font-weight 200
					line-height 16px
					border-1px(rgba(7,17,27,.1))
					&:last-child{
						border-none1px()
					}
				}
			}
		}
	}
}
</style>

