<template>
<div class="camare">
  <div class='show'>
  <img :class="{'pictureNormal':normalsize,'pictureFull':fullSize,}" :style="'backgroundImage:url('+outputURL+')'">
  <span v-show='spaninfo' class='spanInfo' >点击重新拍摄</span>
  </div>
  <input type="file" accept="image/*"  @change="handlechange" class="show" style='margin-top:20px;opacity:0;zIndex:100'>
</div>
</template>
<script>
import ImageCompressor from 'image-compressor.js'
import lrz from 'lrz'
let URL = window.URL || window.webkitURL
export default {
  props: ['data'],
  mounted () {
    this.outputURL = this.data.src
  },

  data () {
    return {
      outputURL: '',
      // show: false，
      spaninfo: false,
      normalsize: true,
      fullSize: false,
      fullSizeIos: false
    }
  },
  methods: {
    postImg () {
      this.$emit('getImg', this.outputURL, this.data.type)
      this.spaninfo = true
      this.normalsize = false
      this.fullSize = true
      // if (this.$route.query.platform === 'ios') {
      //   this.fullSizeIos = true
      // } else {
      //   this.fullSize = true
      // }
    },
    compressBolb: function (file) {
      if (!file) {
        return
      }
      // this.loading = true
      let imgcompress = new ImageCompressor()
      imgcompress.compress(file, {
        checkOrientation: true,
        maxWidth: undefined,
        maxHeight: undefined,
        minWidth: 0,
        minHeight: 0,
        width: undefined,
        height: undefined,
        quality: 0.8,
        mimeType: '',
        convertSize: 5000000
      }).then((result) => {
        if (URL) {
          this.outputURL = URL.createObjectURL(result)
        }
        this.postImg()
      }).catch((err) => {
        this.show = false
        console.log(err)
      })
    },
    compressBase64 (file) {
      lrz(file)
        .then((rst) => {
          // 处理成功会执行
          this.outputURL = rst.base64
          this.postImg()
        })
        .catch((err) => {
          this.show = false
          throw new Error(err)
        })
    },
    handlechange: function (e) {
      let file = e.target.files ? e.target.files[0] : null
      /**
       * Bolb 模式 前台渲染需要 URL.createObjectURL()
       */
      // if (!this.upType) {
      //   this.compressBolb(file)
      //   return false
      // }
      /**
       * 转为 base64
       */
      if (file.size > 0) {
        this.compressBase64(file)
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import url('../../style/variable');
.camare {
    // position:relative;
    padding:20px;
		.show {
			width: 530px;
			height: 330px;
			overflow: hidden;
			position: absolute;
			top: 0;
      left: 0;
		}
		.picture {
			width: 100%;
			height: 100%;
			background-position: center center;
			background-repeat: no-repeat;
			background-size: 500px 316px;
		}
		.pictureFull {
			width:530px;
			height:100%;
			background-position: center center;
			background-repeat: no-repeat;
			background-size: 600px 700px;
      border-radius: 15px;
      
    }
    .pictureFullRotate{
      // width:100%;
			height:530px;
			background-position: -125px center;
			background-repeat: no-repeat;
			background-size: 600px 600px;
      border-radius: 15px;
      transform: rotate(90deg); 
    }
    .pictureNormal{
     	width: 100%;
			height: 100%;
			background-position: center center;
			background-repeat: no-repeat;
			background-size: 600px 400px;
			border-radius: 15px;
    }
		.spanInfo {
			.font-dpr(28px);
			width: 100%;
			position: absolute;
			bottom: 0;
			padding: 10px 0 10px 0;
			display: block;
			background: rgba(0, 0, 0, 0.1);
			color: #fff;
			border-radius: 15px;
      text-align: center;
      z-index:1000;
		}
	}
</style>
