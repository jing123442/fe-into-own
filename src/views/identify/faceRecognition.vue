<template>
 <div class='faceRecognition'>
  <img :src="liveCanImg" alt="" class='largeImg'>
  <box class="marg">
   <x-button type="primary" class='group' @click.native='openScan'>跟着提示做动作</x-button>
  </box>
 </div>
</template>

<script>
import {XButton, Box} from 'vux'
export default {
  data () {
    return {
      liveCanImg: require(`@/asset/livescan.png`)
    }
  },
  methods: {
    openScan () { // 活体界面
      try {
        if (this.$route.query.platform === 'ios') {
          window.webkit.messageHandlers.openLivescan.postMessage('')
        } else {
          window.javaObj.openLivescan()
        }
      } catch (error) {
        console.log(error)
      }
    },
    livescanFinish () { // 活体识别结束，跳转到集合页
      this.$router.push({
        path: '/authentication/status', query: this.$route.query ? this.$route.query : ''
      })
    },
    livenessencry () { // android端识别
      this.$vux.loading.show({text: '数据加载..'})
      window.javaObj.submitLivenessencry()
    }
  },
  components: {
    XButton,
    Box
  },
  mounted () {
    window.livescanFinish = this.livescanFinish
    window.livenessencry = this.livenessencry
  }
}
</script>

<style lang='less' scoped>
 @import url('../../style/variable.less');
.faceRecognition{
  text-align:center;
  .largeImg{
   margin:35px 0 45px 0;
   width:90%;
  }
}
</style>