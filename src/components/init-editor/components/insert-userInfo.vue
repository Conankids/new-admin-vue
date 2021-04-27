<template>
  <div class="insert-userInfo-wrap" @click="inserUserInfo">载入用户基本信息</div>
</template>

<script>
  export default {
    props: {
      userInfo: {
        type: Object,
        default: null
      }
    },
    data() {
      return {}
    },
    methods: {
      inserUserInfo() {
        const html = `<p><br></p><p><strong>本文作者极果${this.userInfo.groupName}：${this.userInfo.userName}</strong></p>`
        this.$emit('insert:userInfo', html)
      }
    }
  }
</script>

<style lang="less" scoped>
  .insert-userInfo-wrap {
    position: absolute;
    bottom: 0;
    left: 10px;
    color: #00a2d4;
    font-size: 14px;
    cursor: pointer;
  }
</style>
