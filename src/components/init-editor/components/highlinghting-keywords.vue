<style lang="less">
  @import "./bottom-btn";

  .keywords__wrap {
    font-size: 14px;
    margin: 10px 0;

    .keywords__cell {
      display: flex;
      align-items: center;
      margin: 20px;
    }
    .keywords__cell-input {
      flex: 1;
      position: relative;
    }
    .tips {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 5px;
      font-size: 12px;
      color: #808080;
      &.error{
        color: red;
      }
    }
    .input {
      border: none;
      height: 34px;
      display: block;
      width: 100%;
      border-radius: 5px;
      padding: 0 10px;
      outline: none;
      box-shadow: 0 0 0 1px #ccc;
      &:focus {
        box-shadow: 0 0 0 1px #F66039;
      }
    }
    .keywords__cell-search{
      @h: 42px;
      display: block;
      background: #F66039;
      color: #fff;
      font-size: 14px;
      text-align: center;
      height: @h;
      line-height: @h;
      width: 120px;
      border-radius: 3px;
      cursor: pointer;
      user-select: none;
      margin-left: 10px;
      &:active {
        opacity: 0.8;
      }
      &.gary {
        background: #D8D8D8;
        pointer-events:none;
      }
      &.red {
        background: #F66039;
      }
    }
  }

</style>


<template>
  <transition name="window__modal">
    <dialog-base
      v-show="inner_visibile"
      @close="close"
      title="关键词"
      class="keywords"
    >
      <div class="keywords__wrap">
        <div class="keywords__cell">
          <div class="keywords__sub-title">高亮关键词：</div>
          <div class="keywords__cell-input">
            <input class="input" type="text" v-model="keywords" @input="search" placeholder="请输入要高亮的关键词"/>
            <div class="tips" v-if="keywords_num">已找到{{keywords_num}}个关键词</div>
            <div class="error tips" v-else-if="!keywords">未输入关键词</div>
            <div class="error tips" v-else>未找到关键词</div>
          </div>
        </div>
        <div class="dialog__bottom-wrap" slot="bottom">
          <div class="dialog__bottom gary" @click="cancelKeywords">取消</div>
          <div class="dialog__bottom" :class="keywords?'red':'gary'" @click="searchKeywords">标记</div>
        </div>
      </div>
    </dialog-base>
  </transition>
</template>
<script>
	import mixins from './mixins'

	export default {
		mixins: [mixins],
		data() {
			return {
				activeName: 'second',
        keywords: '',
        keywords_num: 0
			};
		},
		components: {
		},
		created() {
//			busEvent.$on('change:tabbar', (name) => {
//				this.activeName = name
//				this.$emit('update:visibile', true)
//			})
		},
		methods: {
			insertCard(html, callBack) {
				this.$emit('insert:html', html, callBack)
			},
      search(){
        var keywords = this.keywords
        var keywords_num = 0
        if(!keywords){
          this.keywords_num = 0
          return
        }

        var reg1 = new RegExp(`(?<=>)[^<>]*(${keywords}+?)[^<>]*(?=<)`, "img")
        var reg2 = new RegExp(`${keywords}`, "img")
        var old_content = this.editor.getContent()
        // 正则匹配关键词并高亮
        old_content.replace(reg1, function () {
          return arguments[0].replace(reg2, function () {
            keywords_num++
          })
        })
        this.keywords_num = keywords_num
      },
      searchKeywords(){
        // 还原上次高亮的关键词
        this.editor.removeKeywordsHighlighting()

        var keywords = this.keywords
        var reg1 = new RegExp(`(?<=>)[^<>]*(${keywords}+?)[^<>]*(?=<)`, "img")
        var reg2 = new RegExp(`${keywords}`, "img")
        var old_content = this.editor.getContent()

        // 正则匹配关键词并高亮
        var new_content = old_content.replace(reg1, function () {
          return arguments[0].replace(reg2, function (...args) {
            return `<span class='highlighting'>${args[0]}</span>`
          })
        })
        if(new_content !== old_content){
          this.editor.setContent(new_content)
        }
      },
      cancelKeywords(){
        this.editor.removeKeywordsHighlighting()
        this.keywords_num = 0
        this.keywords = ''
        this.close()
      }
		},
    watch :{
      inner_visibile(newVal) {
        if (newVal && this.$parent.editor) {
          var me = this.$parent.editor
          this.editor = me
          if(!this.editor.removeKeywordsHighlighting){
            this.editor.removeKeywordsHighlighting = function () {
              var old_content = this.getContent()
              // 还原上次高亮的关键词
             var new_content = old_content.replace(/<span class="highlighting">(.*?)<\/span>/ig, function () {
                return arguments[1]
              })
              if(new_content !== old_content){
                this.setContent(new_content)
              }
            }
          }
        }
      }
    }
	}
</script>
