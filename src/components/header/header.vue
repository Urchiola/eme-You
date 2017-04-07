<template>
	<div class="header">
		<div class="content-wrap" >
			<div class="avatar">
				<img :src="pSeller.avatar" width="64" height="64">
			</div>
			<div class="content">
				<div class='title'>
					<span class='brand'> </span>
					<span class='name'>{{pSeller.name}}</span>
				</div>
				<div class='description'>
					{{pSeller.description}}/{{pSeller.deliveryTime}}
				</div>
				<div v-if="pSeller.supports" class="supports">
					<span class='icon' :class= "classMap[pSeller.supports[0].type]"></span>
					<span class='text'>{{pSeller.supports[0].description }}</span>
				</div>
			</div>
			<div class="supportCount" v-if="pSeller.supports" @click="showDetail">
				<span class="count">{{pSeller.supports.length}}个</span>
				<i class='icon icon-keyboard_arrow_right'></i>
			</div>
		</div>
		<div class="notices-wrap"  @click="showDetail">
			 <span class="notices-title" ></span><span class="notices-text" >{{pSeller.bulletin}}</span>
			 <i class="icon icon-keyboard_arrow_right" ></i>
		</div>
		<div class='bground'>
			<img :src="pSeller.avatar" width='100%' height='100%'>
		</div>
		<transition name="fade">
			<div class="detail"   v-show="detailShow" >
				<div class="detail-wrap clearfix">
					<div class="detail-main">
						<h1 class="name">{{pSeller.name}}</h1>
						<div class="star-wrapper">
							<star :size="48" :score="pSeller.score"></star>
						</div>
						<div class="title">
							<div class="line"></div>
							<div class="text">商家详情</div>
							<div class="line"></div>
						</div>
						<ul v-if="pSeller.supports"  class="supports">
							<!--此处 track-by='$index' vue2.0 已经移除-->
							<li class="supports-item" v-for="(item,index) in pSeller.supports">
								<i class="icon" :class="classMap[pSeller.supports[index].type]" ></i>
								<span class="text">{{pSeller.supports[index].description}}</span>
							</li>
						</ul>
						<div class="title">
							<div class="line"></div>
							<div class="text">商家公告</div>
							<div class="line"></div>
						</div>
						<div class="bulletin">
							<p class="content">{{pSeller.bulletin}}</p>
						</div>
					</div>
				</div>
				<div class="detail-close" >
					<i class='icon icon-close' @click="hideDetail"></i>
				</div>
			</div>
		</transition>
	</div>
</template>

<script >
import star from 'components/star/star';
export default {
  props: {
    pSeller: {
      type: Object
    }
  },
  data () {
    return {
        detailShow: false
    };
  },
  methods: {
    showDetail() {
       this.detailShow = true;
    },
    hideDetail() {
       this.detailShow = false;
    }
  },
  created() {
     this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];
  },
  components: {
    star
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
		@import "../../common/stylus/mixin.styl";
		.header{
			color:#fff
			//background:#999
			background:rgba(7,17,27,.5)
			position:relative
			overflow:hidden
			.content-wrap{
				padding:24px 12px 18px 24px;
				font-size:0
				position:relative
				.avatar{
					display:inline-block
					font-size:15px
					vertical-align: top;
					img{
						border-radius:2px
					}
				}
				.content{
					display:inline-block
					margin-left:16px
					font-size:15px
					.title{
						margin:2px 0 8px 0
						.brand{
							display:inline-block
							vertical-align:middle
							width:30px
							height:18px
							bg-image('brand')
							background-size:30px 18px
							background-repeat:no-repeat
						}
						.name{
							margin-left:6px
							font-size:16px
							line-height:18px
							font-weight:bold
						}
					}
					.description{
						margin-bottom:10px
						line-height:12px
						font-size:12px
					}
					.supports{
						font-size:14px
						.icon{
							display:inline-block
							width:12px
							height:12px
							margin-right:4px
							background-size:12px 12px
							background-repeat:no-repeat
							&.decrease{
							bg-image('decrease_1')  
							}
							&.discount{
								bg-image('discount_1')
							}
							&.guarantee{
								bg-image('guarantee_1')
							}
							&.invoice{
								bg-image('invoice_1')
							}
							&.special{
								bg-image('special_1')
							}
						}
					}
				}
				.supportCount{
					position:absolute
					z-index:9
					right:12px
					bottom:14px
					color:#fff
					// width:24px
					height:24px
					line-height:25px
					padding:0 8px
					border-radius:14px
					background:rgba(0,0,0,.2)
					text-align:center
					.count{
						font-size:10px
						 vertical-align:top
					}
					.icon-keyboard_arrow_right{
						margin-left:2px
						font-size:10px
						line-height:24px
					}
				}
			}
			.notices-wrap{
				background:rgba(7,17,27,.2)
				position:relative
				height:28px
				line-height:28px
				padding:0  22px 0 12px
				white-space:nowrap
				overflow:hidden
				text-overflow:ellipsis
				.notices-title{
					display:inline-block
					vertical-align:top
					width:22px
					height:12px
					bg-image('bulletin')
					background-size:22px 12px
					background-repeat:no-repeat
					margin-top:8px
				}
				.notices-text{
					vertical-align:top
					font-size:10px
					margin: 0 4px 
				}
				.icon-keyboard_arrow_right{
					position:absolute
					font-size:12px
					top:8px
					right:12px
				}
			}
			.bground{
				position:absolute
				top:0
				left:0
				width:100%
				height:100%
				z-index:-1
				filter:blur(7px)
			}
			
			.detail{
				position:fixed
				z-index:100
				top:0
				left:0
				width:100%
				height:100%
				overflow:auto
				background: rgba(7,17,27,.8)
				//ios 上呈现的背景颜色高斯模糊
				backdrop-filter:blur(10px)
				 
				// 渐变
				/* 可以设置不同的进入和离开动画 */
				/* 设置持续时间和动画函数 */
				&.fade-enter-active,&.fade-leave-active {
				 transition: all .5s
				}
				&.fade-enter, &.fade-leave-active {
				  opacity: 0
				  //background: rgba(7,17,27,.8)
				}
				.detail-wrap{
					min-height:100%
					width:100%
					.detail-main{
						margin-top:64px
						padding-bottom:64px
						.name{
							font-size:16px
							line-height:16px
							font-weight:700
							text-align:center
						}
						.star-wrapper{
							margin-top:18px
							padding:2px 0
							text-align:center;
						}
						.title{
							display:flex
							width:80%
							margin:28px auto  20px auto
							.line{
								flex:1
								position:relative
								top:-6px
								border-bottom:1px solid rgba(255,255,255,.2)
							}
							.text{
								padding: 0 12px
								font-size:14px
								font-weight:700
							}
						}
						.supports{
							width:80%
							margin:0 auto
							.supports-item{
								padding:0 12px
								margin-bottom:12px
								font-size:0
								&:last-child{
									margin-bottom:0
								}
								.icon{
									display:inline-block
									width:16px
									height:16px
									vertical-align:top
									margin-right:16px
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
								.text{
									font-size:10px
									line-height:16px
								}
							}
						}
						.bulletin{
							width:80%
							margin:0 auto
							.content{
								padding:0 12px;
								font-size:12px
								line-height:24px
							}
						}
					}
					
				}
				.detail-close{
						position:relative
						width:32px
						height:32px
						margin: -64px auto 0 auto;
						clear:both
						font-size:32px
					}
			}
		}
</style>

