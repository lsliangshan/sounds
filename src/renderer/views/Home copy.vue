<template>
  <div class="home">
    <FileDrop @change="fileChanged">
      <div class="home_container">
        <div class="steps"
             @click="setStep">
          <Steps :current="currentStep"
                 class=" usn"
                 direction="vertical">
            <Step :data-index="0"
                  title="选择素材"></Step>
            <Step :data-index="1"
                  title="配置参数"></Step>
            <Step :data-index="2"
                  title="生成视频"></Step>
          </Steps>
          <Button type="primary"
                  :disabled="images.length < 1"
                  @click="nextStep"
                  v-text="currentStep < 2 ? '下一步' : '生成视频'"></Button>
          <Button type="text"
                  @click="prevStep"
                  class="step_prev_btn"
                  style="font-size: 12px; margin-top: 10px; margin-left: 25px;"
                  v-text="'上一步'"
                  :style="{opacity: currentStep > 0 ? 1 : 0, pointerEvents: currentStep > 0 ? 'auto' : 'none'}"></Button>
        </div>
        <div class="home_container_content">
          <!-- v-model="renderImages" -->
          <draggable element="span"
                     v-bind="dragOptions"
                     :value="renderImages"
                     :move="onMove"
                     @end="onEnd"
                     @change="onChange"
                     style="width: 100%;">
            <transition-group type="transition"
                              :name="'flip-list'"
                              class="list-group"
                              tag="div">
              <div v-for="(item, index) in renderImages"
                   :key="item.id"
                   :style="{pointerEvents: item.src ? 'auto' : 'none'}">
                <div class="list-group-item"
                     v-if="item.src">
                  <div class="item_top">
                    <div class="item_top_left">{{index + 1}}</div>
                    <div class="item_top_right"
                         @click="removeItem(index)">
                      <Icon type="md-trash"
                            size="20"
                            color="red" />
                    </div>
                  </div>
                  <div class="list-group-item-img">
                    <img :src="item.src"
                         alt="">
                  </div>
                  <div class="item_bottom"
                       v-text="$timeFormat(item.duration, 'mm:ss')"></div>
                </div>
                <div v-else
                     :key="item.id"
                     style="width: 80px; height: 150px; background-color: red; pointer-events: none;"></div>
              </div>
            </transition-group>
          </draggable>
        </div>
      </div>
    </FileDrop>
  </div>
</template>

<script>
import { ipcRenderer, nativeImage } from 'electron'
import { Step, Steps, Icon, Button } from 'view-design'
import draggable from 'vuedraggable'
export default {
  name: 'Home',
  components: {
    FileDrop: () => import('@/components/FileDrop'),
    draggable,
    Step, Steps, Icon, Button
  },
  data () {
    return {
      allAnimations: ['fade', 'fadegrayscale', 'circleopen', 'directionalwarp', 'directionalwipe', 'crosswarp', 'crosszoom', 'dreamy', 'squareswire', 'angular', 'radial', 'cube', 'swap'],
      images: [],
      currentStep: 0,
      dragOptions: {
        animation: 0,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      },
      transitions: [
      ],
      renderImages: [],
      activeNames: ''
    }
  },
  mounted () {
    ipcRenderer.on('response-get-files', this.getFiles)
  },
  watch: {
    images: {
      immediate: true,
      handler (val) {
        // let out = []
        // let i = 0
        // let images = this.images
        // let transitions = this.transitions
        // for (i; i < images.length; i++) {
        //   out.push(images[i])
        //   if (i !== images.length - 1) {
        //     out.push(transitions[i])
        //   }
        // }
        // this.renderImages = out
      }
    }
  },
  methods: {
    onEnd (e) {
      console.log('on end: ', e)
      // setTimeout(() => {
      //   this.refreshRenderImages()
      // }, 300)
    },
    onChange (e) {
      let oldIndex = Number(e.oldIndex)
      // this.ima
      console.log('change', e)
    },
    fileChanged (e) {
      ipcRenderer.send('get-files', {
        dirs: e,
        type: 'image'
      })
    },
    getFiles (e, data) {
      let c = this.images.length
      this.images = data.map(item => ({
        src: nativeImage.createFromPath(item).toDataURL(),
        duration: 3000 + Math.floor(Math.random() * 1000),
        animation: this.allAnimations[0],
        transitionTime: 1500,
        status: true,
        id: this.$getUUID()
      })).concat(this.images)

      let transitions = data.map(item => ({
        animation: this.allAnimations[0],
        transitionTime: 1500,
        status: false,
        id: this.$getUUID()
      }))
      if (c == 0 && data.length > 1) {
        transitions.pop()
      }
      this.transitions = transitions.concat(this.transitions)
      this.refreshRenderImages()
    },
    refreshRenderImages () {
      let out = []
      let i = 0
      let images = this.images
      let transitions = this.transitions
      for (i; i < images.length; i++) {
        out.push(images[i])
        if (i !== images.length - 1) {
          out.push(transitions[i])
        }
      }
      this.renderImages = out
    },
    onMove ({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element;
      const draggedElement = draggedContext.element;
      return draggedElement.status
    },
    removeItem (index) {
      this.images.splice(index, 1)
    },
    setStep (e) {
      if (e.target.classList.contains('ivu-steps-item')) {
        this.currentStep = Number(e.target.dataset.index)
      }
    },
    nextStep () {
      this.currentStep = Math.min(2, this.currentStep + 1)
    },
    prevStep () {
      this.currentStep = Math.max(0, this.currentStep - 1)
    }
  }
}
</script>

<style lang="less" scoped >
.pen {
  pointer-events: none;
}
.usn {
  user-select: none;
}
.home {
  position: relative;
  width: 100%;
  height: 100%;
  &_container {
    position: relative;
    width: 100%;
    height: 100%;
    &_content {
      width: calc(100% - 130px);
      height: 100%;
      padding: 10px;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      .list-group {
        min-height: 182px;
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        padding: 10px;
        box-sizing: border-box;
        &-item {
          position: relative;
          cursor: move;
          margin: 8px;
          width: 150px;
          // height: 214px;
          height: 182px;
          border-radius: 4px;
          overflow: hidden;
          background-color: #f0f0f0;
          box-shadow: 0 0 15px 1px #c8c8c8;
          // opacity: 1;
          // transition: all 0.5s ease-in-out;
          // transform: scale3d(1, 1, 1);
          transition: all 0.25s cubic-bezier(0.215, 1.61, 0.355, 1);
          transform: scale3d(1, 1, 1);
          &.disabled {
            opacity: 0.3;
          }
          &-img {
            width: 150px;
            // height: 150px;
            height: 118px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            img {
              max-width: 100%;
              max-height: 100%;
            }
          }
          &-desc {
            width: 100%;
            height: 32px;
            padding: 0 8px;
            box-sizing: border-box;
            line-height: 32px;
            text-align: center;
            font-size: 13px;
            color: #888;
            background-color: #f8f8f8;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          &-status {
            position: absolute;
            right: 4px;
            top: 4px;
            width: 30px;
            height: 20px;
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            justify-content: flex-end;
          }
          &-delete {
            position: absolute;
            left: 4px;
            top: 4px;
            width: 30px;
            height: 20px;
            z-index: 3;
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            justify-content: flex-start;
          }
        }
      }
      .item {
        &_top {
          // position: absolute;
          // left: 0;
          // top: 0;
          width: 100%;
          height: 32px;
          padding: 4px 0px;
          box-sizing: border-box;
          background-color: #f0f0f0;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          &_left {
            font-size: 13px;
            // width: 40px;
            height: 20px;
            padding-left: 10px;
            padding-right: 10px;
            background-color: #f0f0f0;
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
          }
          &_right {
            width: 32px;
            height: 32px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }
        }
        &_bottom {
          // position: absolute;
          // left: 0;
          // bottom: 0;
          width: 100%;
          height: 32px;
          padding: 4px 10px;
          box-sizing: border-box;
          background-color: #f0f0f0;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        }
      }
    }
    .steps {
      position: absolute;
      right: 20px;
      top: 0;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  transform: scale3d(0.8, 0.8, 1) !important;
  // background: #c8ebfb;
}
</style>