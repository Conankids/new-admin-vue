<style lang="scss" scoped>
  .jui-uploader {
    .uploader-list li{
      width: 126px;
    }
    .item-insert{
      top: auto !important;
      bottom: 0;
    }
  }
</style>
<template>
  <uploader :options="options" class="jui-uploader" ref="uploader">
    <uploader-unsupport></uploader-unsupport>
    <uploader-list>
      <ul slot-scope="props" class="uploader-list-ul" ref="uploader-list-ul">
        <li v-for="file in props.fileList" :key="file.id" :id="`li-id-${file.id}`">
          <uploader-file :file="file" :list="true" class="uploader-list-inner">
            <template slot-scope="props">
              <!--关闭-->
              <div @click="itemClose(props.file)" class="item-close hover-show">
                <img src="./icon/item_close.svg"/>
              </div>

              <!--等待上传-->
              <template v-if="props.status=='waiting'">
                <div class="uploading-status">等待上传...</div>
              </template>
              <!--上传中-->
              <template v-else-if="props.status=='uploading'">
                <div class="uploading-status">上传中</div>
                <div class="uploader-progress-wrap">
                  <div class="uploader-progress-bar" :style="`width:${props.progress*100}%`"></div>
                </div>
              </template>
              <!--上传停止-->
              <template v-else-if="props.status=='paused'">
                <div class="uploading-status">上传停止</div>
              </template>
              <!--上传成功-->
              <template v-else-if="props.status=='success'">
                <!--旋转-->
                <div
                  @click="itemRotation('success-img-' + props.file.id,props.file)"
                  class="item-rotation hover-show"
                >
                  <img src="./icon/item_rotat.svg"/>
                </div>
                <div class="item-view" @click="selectedItem(`success-img-${props.file.id}`,props.file)">
                  <img
                    :ref="`success-img-${props.file.id}`"
                    :src="`//s2.jiguo.com/${props.respon.field}/logo`"
                    @load="successFirstLoadImage(`success-img-${props.file.id}`,props.file)"
                  />
                  <input
                    type="hidden"
                    name="product[pic][]"
                    :value="`//s2.jiguo.com/${props.respon.field}/640`"
                  />
                </div>
                <div @click="insertItem('success-img-' + props.file.id,props.file)" class="item-insert hover-show">
                  封面
                </div>
              </template>
              <!--上传错误-->
              <template v-else-if="props.status=='error'">
                <div class="uploading-status">上传错误</div>
              </template>
              <!--其他未知状态-->
              <template v-else>
                <div class="uploading-status">{{ props.status }}</div>
              </template>
              <div class="uploading-status image-loading-status">加载中...</div>
            </template>
          </uploader-file>
        </li>
        <li>
          <uploader-btn class="uploader-list-inner" :attrs="attrs" ref="uploader-btn">
            <div class="jui-uploader__btn-inner">
              <img src="./uploader.svg"/>
              <div>最大8Mb</div>
            </div>
          </uploader-btn>
        </li>
      </ul>
    </uploader-list>
  </uploader>
</template>
<script>

	import $ from 'jquery'

	export default {
		props: {
			mode: {
				type: Number,
				default: 1
			},
			value: {
				type: Array,
				default: function () {
					return []
				}
			},
			visible: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				options: {
					target: UEDITOR_CONFIG.serverUrl + '&action=uploadimage',
					testChunks: false,
					allowDuplicateUploads: true,
					query: {
						uid: 11,
						code: 'c20ad4d76fe97759aa27a0c99bff6710',
						action: 'uploadimage'
					},
					fileParameterName: 'upfile',
					chunkSize: 8 * 1024 * 1024,
					progressCallbacksInterval: 300
				},
				attrs: {
					accept: 'image/jpg,image/jpeg,image/png,image/gif'
				},
				selectedList: this.value
			}
		},
		watch: {
			selectedList(newVal) {
				this.$emit('input', newVal)
			},
			visible() {
				if ($(this.$refs['uploader-list-ul']).find('li').length <= 1) {
					setTimeout(() => {
						$(this.$refs['uploader-btn'].$el).trigger('click')
					}, 240)
				}
			}
		},
		methods: {
			getInsertHtml() {
				var html = ''
				if (!this.selectedList.length) {
					var array = []
					for (var i in this.$refs) {
						if (i.substr(0, 12) == 'success-img-') {
							array.push(i)
						}
					}
					array.sort(function (a, b) {
						return parseInt(a.substr(12)) <= parseInt(b.substr(12)) ? -1 : 1
					})

					for (var i = 0; i < array.length; i++) {
						var item = this.$refs[array[i]]
						if (item.length) {
							if (this.mode == 1) {
								html += '<p style="text-align:center">' + $(item[0]).prop('outerHTML') + '</p>'
							} else {
								html += $(item[0]).prop('outerHTML')
							}

							this.$refs['uploader'].fileList.forEach((file) => {
								if (array[i].substr(12) == file.id) {
									this.$refs['uploader'].uploader.removeFile(file)
								}
							})
						}
					}
					if (this.mode != 1 && html) {
						html = '<p style="text-align:center">' + html + '</p>'
					}
					this.selectedList = []
					return html
				}

				this.selectedList.forEach((id) => {
					var item = this.$refs[id]
					if (item.length) {
						if (this.mode == 1) {
							html += '<p style="text-align:center">' + $(item[0]).prop('outerHTML') + '</p>'
						} else {
							html += $(item[0]).prop('outerHTML')
						}
					}
					this.$refs['uploader'].uploader.removeFile(item.file)
				})
				if (this.mode != 1 && html) {
					html = '<p style="text-align:center">' + html + '</p>'
				}
				this.selectedList = []
				return html
			},
			insertItem(id, file) {
				if (this.$refs[id].length) {
					if (index !== -1) {
						this.selectedList.splice(index, 1)
					}
					this.$refs['uploader'].uploader.removeFile(file)
				}
			},
			itemClose(file) {
				this.$refs['uploader'].uploader.removeFile(file)
			},
			itemRotation(id, file) {
				file.rotate = ((file.rotate || 0) + 90) % 360;
				var logo = '|watermark/1/image/aHR0cDovL3dhdGVybWFyay0xMjUyMTA2MjExLnBpY3NoLm15cWNsb3VkLmNvbS8xNDk3OTQyODk2MjgzNTk0OGNiNzA1NGViZi5wbmc=/gravity/southeast/dx/20/dy/20';
				var src = '//s2.jiguo.com/' + file.respon.field + '?imageView2/2/w/640/q/100|imageMogr2/rotate/' + file.rotate + logo;
				this.loadingImageMask(src, this.$refs[id][0], file.respon.type)
			},
			loadingImageMask(src, img, type) {
				var tempImg = new Image()
				var mask = $(img).closest('li').find('.image-loading-status')
				mask.css('display', 'flex')
				tempImg.onload = function () {
					$(img).attr({
						'catchremote': true,
						'src': this.src,
						'_src': this.src,
						"title": $(img).attr('title'),
						"alt": $(img).attr('alt'),
						"data-original": $(img).attr('data-original'),
						'data-width': this.width,
						'data-height': this.height,
						'data-img-type': type || 2,
						'data-ratio': this.width / this.height,
					})
					mask.css('display', 'none')
				}
				tempImg.src = src
			},
			successFirstLoadImage(id, file) {
				var currentImg = $(this.$refs[id][0])
				if (currentImg.data('first-loading')) {
					return
				}
				var src = '//s2.jiguo.com/' + file.respon.field + '/logo';
				$(currentImg).attr({
					'catchremote': true,
					'src': src,
					'_src': src,
					"title": file.respon.title,
					"alt": file.respon.alt || file.respon.title,
					"data-original": file.respon.original,
					'data-width': file.respon.width,
					'data-height': file.respon.height,
					'data-img-type': file.respon.type,
					'data-ratio': file.respon.ratio,
				})

				this.loadingImageMask(src, currentImg, file.respon.type)
				currentImg.data('first-loading', true)
			},
			//选中/取消图片
			selectedItem(id, file) {
				this.$refs[id].file = file
				if (this.selectedList.indexOf(id) === -1) {
					this.selectedList.push(id)
				} else {
					var index = this.selectedList.indexOf(id)
					this.selectedList.splice(index, 1)
				}
			},
			imgLoadEvent(id, file) {
				var _this = this
				var reader = new FileReader();
				reader.onload = function (evt) {
					if (_this.$refs[id].length) {
						_this.$refs[id][0].src = evt.target.result
					}
				}
				reader.readAsDataURL(file.file);
			}
		},
		filters: {}
	}
</script>
