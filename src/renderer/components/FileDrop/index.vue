<template>
  <div class="file_drop_container"
       id="fileDropRef">
    <!-- <input type="file"
           accept="image/png"
           @dragenter="dragEnter"
           @dragend="dragEnd"
           @drop="drop"> -->
    <!-- <Upload multiple
            type="drag"
            :before-upload="beforeUpload"
            action="/">
      <div class="upload_container">
        <Icon type="ios-cloud-upload"
              size="52"
              style="color: #3399ff"></Icon>
        <p>上传zip</p>
      </div>
    </Upload> -->
    <!-- <div class="upload_container">
      <Icon type="ios-cloud-upload"
            size="52"
            style="color: #3399ff"></Icon>
      <p>上传zip</p>
    </div> -->
    <slot></slot>
  </div>
</template>

<script>
import { Input, Button, Upload, Icon } from 'view-design'
export default {
  name: 'FileDrop',
  components: {
    Input, Button, Upload, Icon
  },
  props: {
    width: {
      type: [String, Number],
      default: '100%'
    },
    height: {
      type: [String, Number],
      default: '100%'
    },
    accept: {
      type: String,
      default: 'zip|jpg|png|jpeg|gif'
    }
  },
  mounted () {
    let ref = document.querySelector('#fileDropRef')
    ref && ref.removeEventListener('drop', this.initFileDropEvent)
    ref && ref.addEventListener('drop', this.initFileDropEvent, false)
    ref && ref.removeEventListener('dropover', this.initFileDragOverEvent)
    ref && ref.addEventListener('dragover', this.initFileDragOverEvent, false)
  },
  methods: {
    initFileDropEvent (e) {
      e.preventDefault()
      const files = e.dataTransfer.files;
      const acceptType = this.accept.split('|')
      let _files = Array.from(files) //.filter(item => acceptType.indexOf(item.name.split('.').pop()) > -1)
      if (_files.length > 0) {
        this.$emit('change', _files.map(item => ({
          name: item.name,
          path: item.path,
          type: item.type
        })))
      }
    },
    initFileDragOverEvent (e) {
      e.preventDefault()
    },
    dragEnter (e) {
      console.log('【Drag Enter】', e)
    },
    dragEnd (e) {
      console.log('【Drag End', e)
    },
    drop (e) {
      console.log('【Drop】', e.target.files)
    },
    beforeUpload (e) {
      console.log('>>>>>>', e)
      return false
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
  .upload_container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>