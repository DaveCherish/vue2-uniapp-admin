module.exports = {
  transpileDependencies: [],
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/styles/variables.scss";`
      }
    }
  }
}