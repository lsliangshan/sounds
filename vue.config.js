const path = require("path");
function resolve (dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      mainProcessFile: 'src/main/index.js',
      outputDir: 'dist',
      mainProcessWatch: ['src/main/*.js'],
    }
  },
  pages: {
    index: {
      entry: 'src/renderer/main.js'
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set("@", resolve("src/renderer"))
      .set("assets", resolve("src/renderer/assets"))
      .set("components", resolve("src/renderer/components"))
  }
}
