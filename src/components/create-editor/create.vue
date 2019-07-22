<style lang="scss">
  @import "../../style/scss/helpers/functions";

  .editor__wrap {
    background: transparent;
    &.full__screen {
      background: #f2f2f2;

      &, .edui-editor-toolbarbox {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
      }
    }
    .editor__inner {
      margin: auto;
      background: #ffffff;
    }
  }
</style>

<template>
  <div class="editor__wrap" ref="editor__wrap">
    <div class="editor__inner" :style="`width:${width}px`">
      <textarea :name="name" :id="editorId" :style="`height:${height}px;width:${width}px`"></textarea>
    </div>
  </div>
</template>

<script>
	import {
		createId,
		editorReady,
		editorBindScrollFun,
		editorBindToolBarTips,
		editorRefresh,
		editorAddEventListener,
		bindKeyMap
	} from './createTools'
	import $ from 'jquery'

	export default {
		name: 'create-editor',
		props: {
			name: {
				type: String,
				default: ''
			},
			content: {
				type: String,
				default: ''
			},
			height: {
				type: Number,
				default: $(window).height() - 60
			},
			width: {
				type: [Number],
				default: 850
			},
			full_screen: {
				type: Boolean,
				default: false
			},
			toolbars: {
				type: Array,
				default: function () {
					return window.UEDITOR_CONFIG.toolbars
				}
			}
		},
		data() {
			return {
				editorId: createId(),
				fullScreen: this.full_screen
			}
		},
		watch: {
			fullScreen() {
				editorRefresh(this, this.editor)
			}
		},
		computed: {
			editorNumberKey() {
				window.__ueditorNumber__ = (window.__ueditorNumber__ || 0) + 1
				return 'editor-index-' + window.__ueditorNumber__
			}
		},
		mounted() {
			var vm = this
			vm.editor = UE.getEditor(vm.editorId, {
				toolbars: this.toolbars,
				onready: function () {
					editorReady(vm, this)
					//绑定toolbar提示文字
					editorBindToolBarTips(vm, this)
					//添加快捷键
					bindKeyMap(vm, this)
          //执行编辑器初始化回调
					UE.readyCallBack && UE.readyCallBack()
          //把编辑器暴露给全局以供调用
          window['myEditor'] = this
				}
			})
			vm.editor.fullScreen = this.fullScreen
			vm.editor.key = this.editorNumberKey
			vm.editor.$emitEvent = (eventType, params) => {
				this.$emit('trigger:click:event', eventType, params)
				if (eventType === 'full_screen') {
					this.fullScreen = vm.editor.fullScreen = !this.fullScreen
				}
			}

			//绑定滚动事件
			$(window).on('scroll.editor', function () {
				editorBindScrollFun(vm, vm.editor)
			})

			//编辑器绑定事件
			editorAddEventListener(vm, vm.editor)

		},
		methods: {
			setContent(content) {
				vm.editor.setContent(content || '')
			}
		},
		beforeDestroy() {
			$(window).off('scroll.editor')
			if (this['ToolBarWrap']) {
				vm['ToolBarWrap'].off('mouseenter.editor')
				vm['ToolBarWrap'].off('mouseleave.editor')
			}
		}
	}
</script>
