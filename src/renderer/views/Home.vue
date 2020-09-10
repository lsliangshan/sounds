<template>
  <div class="home">
    <FileDrop></FileDrop>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {
    FileDrop: () => import('@/components/FileDrop')
  }
}
</script>

<style lang="less" scoped >
.home {
  width: 100%;
  height: 100%;
}
</style>