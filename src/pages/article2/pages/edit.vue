<template>
  <init-editor-index
    name="article[message]"
    public-key="ueditorContentBox"
    :content="content"
    :toolbars="toolbars"
  />
</template>

<script>
	import InitEditorIndex from '../../../components/init-editor/index'
	import content from './content.html'

	export default {
		data() {
			return {
				content: process.env.NODE_ENV !== 'production' ? content : window.ueditorContent,
				toolbars: [
					[
						'source',
						'undo', //撤销
						'redo', //重做
						'|',
						'title_h3', //标题
						'bold', //加粗
						'forecolor',
						'|',
						'horizontal', //分隔线
						'insertorderedlist2',
						'insertunorderedlist2',
						'|',
						'justifyleft',
						'justifycenter',
						'justifyright',
						'|',
						'insert_video',
						'new_link',
						'simpleupload',
						'insert_image',
						'insert_card',
            '|',
            'quick_layout',
            'highlighting_keywords',
            'remote_catch',
            'drafts',
            '|',
            'full_screen'
					]
				]
			}
		},
		components: {
			InitEditorIndex
		}
	}
</script>



