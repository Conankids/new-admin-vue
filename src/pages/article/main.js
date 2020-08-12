import Vue from 'vue'
import Uploader from '../../components/jui-simple-uploader'
import App from './app.vue'
import CreateEditor from '../../components/create-editor'
import store from '../../store'
import ElementUI from 'element-ui'

Vue.use(ElementUI)

Vue.use(CreateEditor)
Vue.use(Uploader)

require('../boot')({
	store,
	el: '#ueditorContentBox',
	render: _ => _(App)
})

