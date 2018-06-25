<style lang="less">
  @import "./bottom-btn";

  .link__wrap {
    font-size: 14px;
    margin: 10px 0;

    .link__cell {
      display: flex;
      align-items: center;
      margin: 20px;
    }
    .link__cell-input {
      flex: 1;
      position: relative;
    }
    .error-tips {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 5px;
      font-size: 12px;
      color: red;
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
  }

  .dialog__input-tips {
    color: #999;
    font-size: 14px;
    text-align: right;
    padding-right: 20px;
  }
</style>

<template>
  <transition name="window__modal">
    <dialog-base
      v-show="inner_visibile"
      @close="close"
      title="超链接"
      :width="400"
    >
      <div class="link__wrap">
        <div class="link__cell">
          <div class="link__sub-title">链接：</div>
          <div class="link__cell-input">
            <input class="input" type="text" v-model="link"/>
            <div v-if="link && !urlSuccess" class="error-tips">http://或https://开头</div>
          </div>
        </div>
        <div class="link__cell" v-show="false">
          <div class="link__sub-title">描述：</div>
          <div class="link__cell-input">
            <input class="input" type="text" v-model="description"/>
          </div>
        </div>
      </div>
      <div class="dialog__input-tips">小程序内跳转链接需以<span class="red">https://</span>开头，且属于<span class="red">https://api.jiguo.com</span>下域名</div>
      <div class="dialog__bottom-wrap" slot="bottom">
        <div class="dialog__bottom gary" @click="close">关闭</div>
        <div class="dialog__bottom" :class="urlSuccess?'red':'gary'" @click="insertLink">插入链接</div>
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
				description: '',
				link: 'http://',
				urlSuccess: false
			}
		},
		watch: {
			inner_visibile(newVal) {
				if (newVal && this.$parent.editor) {
					var me = this.$parent.editor
					var range = me.selection.getRange()
					var rangeCommon = range.getCommonAncestor()
					var rangeLink = domUtils.findParentByTagName(rangeCommon, 'a', true)
					if (rangeLink) {
						range.setStartBefore(rangeLink)
						range.setEndAfter(rangeLink)
						this.link = rangeLink.getAttribute('href')
						this.description = rangeLink.getAttribute('title')
					}
					var range = me.selection.getRange()

					var fragment = range.cloneContents()
					var node = document.createElement("div")
					node.appendChild(fragment)
					this.description = node.innerText
					this.range = range
					this.editor = me
				}
			},
			link(newVal) {
				this.urlSuccess = /^https?:\/\/.+/i.test(newVal)
			}
		},
		methods: {
			insertLink() {
				if (!this.urlSuccess) {
					return
				}
				if (!this.range || !this.editor) {
					return
				}

				var fragment = this.range.extractContents()
				var A = this.range.document.createElement('a')
				A.setAttribute('href', this.link)
				A.setAttribute('title', this.description)
				A.setAttribute('class', 'editor-link-a-href')
				A.innerHTML = fragment.textContent
				if (this.range.startContainer.tagName == 'BODY') {
					var p = this.range.document.createElement('p')
					p.appendChild(A)
					this.range.insertNode(p)
					if (
						p.previousElementSibling &&
						p.previousElementSibling.tagName == 'P' &&
						p.previousElementSibling.textContent == ''
					) {
						p.parentElement.removeChild(p.previousElementSibling)
						if (
							p.nextElementSibling &&
							p.nextElementSibling.tagName == 'P' &&
							p.nextElementSibling.textContent == ''
						) {
							p.parentElement.removeChild(p.nextElementSibling)
						}
					}
				} else {
					this.range.insertNode(A)
				}
				this.editor.fireEvent('contentchange')
				this.close()
			}
		}
	}
</script>