<style lang="less" scoped>
  .link-product-ul {
    margin-top: 10px;
    li {
      position: relative;
    }
  }
</style>

<template>
  <ul class="link-product-ul">
    <li v-for="item in data" :id="`product-${item.id}`">
      <input type="hidden" name="productlinkid[]" :value="item.productLinkId"/>
      <div class="Z-list-image Z-left">
        <img :src="`//s2.jiguo.com/${item.cover}/640`" />
      </div>
      <div class="Z-list-desc">
        <div class="Z-list-title">
          <strong>{{item.name}}</strong>
          <span class="Z-time Z-right">{{item.addtime}}</span>
        </div>
        <div class="Z-list-brief">
          <div class="Z-list-brief-inner">{{item.detail}}</div>
          <div class="Z-list-subscribe">
            <p><a href="javascript:;">作者：<em style="color:forestgreen">{{item.author}}</em></a></p>
          </div>
          <div class="Z-list-subscribe">
            <p>
              <a :href="`javascript:commentManage('/admin/comment/CaptureList/id/${item.cid}');`" class="blue">
                评论管理
              </a>
            </p>
          </div>
        </div>
      </div>
      <div class="tips-wanshan" v-if="item.category!='OK'">
        <a :href="`/admin/product/edit?id=${item.id}`" target="_blank">
          去完善
        </a>
      </div>
    </li>
  </ul>
</template>

<script>
	export default {
		props: {
			data: {
				type: Array,
				default: []
			}
		},
		methods: {}
	}
</script>
