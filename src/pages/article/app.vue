<style lang="scss">
  @import '../../components/jiguo-element-ui/element-ui';

  $IMAGES_PATH: '../../style/images/';
  @import '../../style/scss/app.scss';
  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: #F5F5F5;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    background-color: #F5F5F5;
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    background-color: #b7b7b7;
  }
</style>





<template>
  <div class="page">
    <!--<loading v-show="show"/>-->
    <div class="content-wrap">
      <article-edit/>
      <slot name=""></slot>
    </div>
  </div>
</template>

<script>
	import {mapState} from 'vuex'
	import mainMixins from '../mainMixins'
	import ArticleEdit from './pages/edit'

	export default {
		mixins: [mainMixins],
		computed: {
			...mapState([
				'show'
			])
		},
		components: {
			ArticleEdit
		}
	}
</script>



