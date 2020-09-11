<template>
  <div id="app">
    <router-view style="height: 100%;" />
  </div>
</template>

<style lang="less">
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
.file_drop_container {
  .ivu-upload-drag {
    border: none !important;
  }
  .ivu-upload {
    height: 100%;
  }
}
.ivu-steps-head {
  pointer-events: none;
}
.ivu-steps-main {
  pointer-events: none;
}
.step_prev_btn {
  &.ivu-btn-text {
    color: #c8c8c8;
  }
  &.ivu-btn:focus {
    box-shadow: none !important;
    border: none !important;
  }
}
</style>
