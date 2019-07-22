<style lang="less">
  @import "./components/animate";

  .editor__wrap {
    width: 850px;
    margin: auto;
  }
</style>

<template>
  <div class="editor__wrap" style="position: relative;">
    <create-editor
      @editor-ready="editorReady"
      @trigger:click:event="TriggerClickEvent"
      :content="content"
      :name="name"
      :toolbars="toolbars"
    />
    <inert-video
      v-if="filtersToolbars('insert_video')"
      :visibile.sync="InsertVideoVisibile"
      @insert:html="InsertHtml"
    />
    <inert-image
      v-if="filtersToolbars('insert_image')"
      :visibile.sync="InsertImageVisibile"
      @insert:html="InsertHtml"
    />
    <inert-card
      v-if="filtersToolbars('insert_card')"
      :visibile.sync="InsertCardVisibile"
      @insert:html="InsertHtml"
      ref="inert-card"
    />
    <inert-link
      v-if="filtersToolbars('new_link')"
      :visibile.sync="InsertLinkVisibile"
      @insert:html="InsertHtml"
    />
    <highlighting-Keywords
      v-if="filtersToolbars('highlighting_keywords')"
      :visibile.sync="HighlightingKeywordsVisibile"
      @insert:html="InsertHtml"
    />

    <InserUserInfo
      v-if="userInfo"
      :userInfo="userInfo"
      @insert:userInfo="insertUserInfo"/>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'
  import InertVideo from './components/insert-video.vue'
  import InertImage from './components/insert-image.vue'
  import InertCard from './components/insert-card.vue'
  import InertLink from './components/insert-link.vue'
  import ProductList from './product-list'
  import InserUserInfo from './components/insert-userInfo'
  import HighlightingKeywords from './components/highlinghting-keywords'

  import {flatProcessing} from '../../common/flatProcessing'
  import {getFormatHtmlToJSON} from '../../common/getFormatHtmlToJSON'

  import $ from 'jquery'

  export default {
    props: {
      name: {
        type: String,
        required: true
      },
      userInfo: {
        type: Object,
        default: null
      },
      content: {
        type: String,
        default: ''
      },
      publicKey: {
        type: String,
        default: 'id' + String(Math.random()).replace('.', '')
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
        InsertVideoVisibile: false,
        InsertImageVisibile: false,
        InsertCardVisibile: false,
        InsertLinkVisibile: false,
        HighlightingKeywordsVisibile: false
      }
    },
    components: {
      InertVideo,
      InertImage,
      InertCard,
      InertLink,
      InserUserInfo,
      HighlightingKeywords
    },
    methods: {
      editorReady(editor) {
        var vm = this
        this.$nextTick(() => {
          this.hidePageLoading()
        })
        this.editor = window[this.publicKey] = editor

        //获取产品卡片数量，并在页面上显示相应信息
        this.editor.addListener("contentChange", function () {
          this.__listBox__ = this.__listBox__ || $('#editor-link-product-box')
          if (false && this.__listBox__.length <= 0) return

          var cid = ''
          var productLinkId = {}
          $(this.body).find('iframe[data-productid]').each(function () {
            cid += ',' + $(this).attr('data-cid');
            productLinkId['productLinkId' + $(this).attr('data-productid')] = $(this).attr('data-default-link-id');
          });
          cid = cid.substr(1);
          if (cid == '') {
            this.__listBox__.html('');
            return;
          }

          $.get('/admin/ajax/getproduct', {
            cardid_string: cid
          }, (replayDate) => {
            for (var i in  replayDate) {
              replayDate[i].productLinkId = productLinkId['productLinkId' + replayDate[i].id];
            }
            var tempVueTpl = new vm.constructor({
              render(createElement) {
                return createElement(ProductList, {
                  props: {
                    data: replayDate
                  }
                })
              }
            })
            tempVueTpl.$mount()
            this.__listBox__.html(tempVueTpl.$el)
            tempVueTpl.$destroy()
          }, 'json')
        })


        editor.addListener("setValue", (eventType, content) => {
          if (this.editorTextareaJson) {
            let tempDiv = document.createElement('div')
            tempDiv.innerHTML = content
            this.editorTextareaJson.value = JSON.stringify(flatProcessing(getFormatHtmlToJSON(tempDiv)) || [])
          }
        })

        if (
          !editor.textarea.previousSibling ||
          editor.textarea.previousSibling.tagName !== 'TEXTAREA'
        ) {
          var newTextarea = document.createElement('textarea')
          newTextarea.setAttribute('name', editor.textarea.getAttribute('name') + '[json]')
          newTextarea.setAttribute('style', 'height:0;width:0;opacity:0.01')
          editor.textarea.parentNode.insertBefore(newTextarea, editor.textarea)
          this.editorTextareaJson = newTextarea
          setTimeout(() => {
            editor.fireEvent("setValue", editor.getContent())
          }, 666)
        }

        this.$emit('editor-ready', editor)
      },
      TriggerClickEvent(eventType) {
        switch (eventType) {
          case 'insert_video': {
            this.InsertVideoVisibile = true
            break
          }
          case 'insert_image': {
            this.InsertImageVisibile = true
            break
          }
          case 'insert_card': {
            this.InsertCardVisibile = true
            this.$refs['inert-card'].init()
            break
          }
          case 'new_link': {
            this.InsertLinkVisibile = true
            break
          }
          case 'highlighting_keywords': {
            this.HighlightingKeywordsVisibile = true
            break
          }
        }
      },
      InsertHtml(html, callBack) {
        if (typeof callBack == 'function') {
          if (callBack(this.editor)) {
            this.editor.execCommand('inserthtml', html)
          }
        } else {
          this.editor.execCommand('inserthtml', html)
        }
      },
      filtersToolbars(tool, toolbars) {
        var result = false
        ;(toolbars || this.toolbars).forEach((item) => {
          if (item instanceof Array) {
            result = this.filtersToolbars(tool, item)
          } else if (item == tool) {
            result = true
          }
        })
        return result
      },
      insertUserInfo(html) {
        this.editor.setContent(html, true)
      },
      ...mapActions(['hidePageLoading'])
    }
  }
</script>
