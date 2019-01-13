<template>
<div class="camare">
  <div class='show'>
  <img class="pictureFull"  :src="outputURL">
  <span v-show='spaninfo' class='spanInfo' >点击重新拍摄</span>
  </div>
  <input type="file" accept="image/*"  @change="handlechange" class="show" style='margin-top:20px;opacity:0;zIndex:100'>
</div>
</template>
<script>
// import { InlineLoading } from 'vux'
import ImageCompressor from 'image-compressor.js'
import lrz from 'lrz'
let URL = window.URL || window.webkitURL
export default {
  // components: {
  //   InlineLoading
  // },
  props: ['data'],
  mounted () {
    this.outputURL = this.data.src
  },
  data () {
    return {
      // loading: false,
      outputURL: '',
      // show: false，
      spaninfo: true
    }
  },
  methods: {
    postImg () {
      this.$emit('getImg', this.outputURL, this.data.type)
      this.spaninfo = true
      console.log('imgposted')
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
        // this.loading = false
        if (URL) {
          this.outputURL = URL.createObjectURL(result)
          // this.show = true
        }
        // this.$emit('picChange', this.outputURL)
        this.postImg()
      }).catch((err) => {
        this.show = false
        console.log(err)
      })
    },
    compressBase64 (file) {
      // this.loading = true
      lrz(file)
        .then((rst) => {
          // 处理成功会执行
          this.outputURL = rst.base64
          // this.show = true
          // this.loading = false
          // this.$emit('picChange', rst.base64)
          this.postImg()
          // this.$emit('update:src', rst.base64)
        })
        .catch((err) => {
          this.show = false
          // this.loading = false
          throw new Error(err)
        })
    },
    handlechange: function (e) {
      let file = e.target.files ? e.target.files[0] : null
      /**
       * Bolb 模式 前台渲染需要 URL.createObjectURL()
       */
      if (!this.upType) {
        this.compressBolb(file)
        return false
      }
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
  .uploadAdd {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: #1d7ffe;
    display: flex;
    justify-content: center;
    align-items: center;
    .svg-icon {
      width: 36px;
      height: 36px;
      color: #fff;
    }
  }
  img {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
  }
  .uploadFile {
    opacity: 0;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
  }
</style>
