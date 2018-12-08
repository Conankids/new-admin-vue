<template>
  <init-editor-index
    name="article[message]"
    public-key="ueditorContentBox"
    :content="content"
    :userInfo="userInfo"
    @editor-ready="editorReady"
  />
</template>

<script>
	import InitEditorIndex from '../../../components/init-editor/index'
	import content from './content.html'

	export default {
		data() {
			return {
				content: process.env.NODE_ENV !== 'production' ? content : window.ueditorContent,
        userInfo: process.env.NODE_ENV !== 'production' ? {groupName: '玩家', userName: '极果小编'} : window.userInfo
			}
		},
		components: {
			InitEditorIndex
		},
		methods: {
			editorReady(editor) {


			}
		}
	}
</script>



