<template>
  <div class="file_drop_container">
    <input type="file"
           accept="image/png"
           @dragenter="dragEnter"
           @dragend="dragEnd"
           @drop="drop">
  </div>
</template>

<script>
export default {
  name: 'FileDrop',
  props: {
    width: {
      type: [String, Number],
      default: '100%'
    },
    height: {
      type: [String, Number],
      default: '100%'
    }
  },
  methods: {
    dragEnter (e) {
      console.log('【Drag Enter】', e)
    },
    dragEnd (e) {
      console.log('【Drag End', e)
    },
    drop (e) {
      console.log('【Drop】', e.target.files)
    }
  }
}
</script>

<style lang="less" scoped>
.file_drop_container {
  width: 100%;
  height: 100%;
  input[type="file"] {
    width: 100%;
    height: 100%;
    outline: none;
  }
}
</style>