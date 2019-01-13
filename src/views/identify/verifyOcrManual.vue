<template>
 <div class='hand'>
  <div class="dangercenter">
   必须使用本人身份证，身份证将联网公安部门认证
  </div>
  <div class='cardBox'>
   <div class='con'>
    <takePhoto :data='frontImg'  @getImg='getImg'></takePhoto>
   </div>
  </div>
  <div class='cardBox'>
   <div class='con'>
    <takePhoto :data='backImg' @getImg='getImg'></takePhoto>
   </div>
  </div>
  <group class='group'>
   <x-input title="真实姓名" placeholder="请输入姓名" v-model="userName" :show-clear="false" text-align="left" @on-blur='testReg("name")'></x-input>
   <x-input title="身份证号" placeholder="请输入身份证号码" :max='18' type="text" v-model="userCard" :show-clear="false" text-align="left" @on-blur='testReg("idCard")'></x-input>
  </group>
  <box class="marg">
   <x-button type="primary" @click.native="submit" class='group'>提交</x-button>
  </box>
  <footer class='infoMessage'>
   <i class='blueicon'></i><span>信息仅用于身份验证</span>
  </footer>
 </div>
</template>

<script>
import {Group, XButton, Box} from 'vux'
// import takaPhotoNew from '@/views/identify/takaPhotoNew'
import takePhoto from '@/views/identify/takePhoto'
import indexApi from '@/api/index'
export default {
  data () {
    return {
      frontPicUrl: '',
      backPicUrl: '',
      userName: '',
      userCard: '',
      frontGet: false,
      backGet: false,
      frontImg: {
        src: require(`@/asset/Portrait_face.png`),
        type: 'front'
      },
      backImg: {
        src: require(`@/asset/Portrait_face.png`),
        type: 'back'
      }
    }
  },
  methods: {
    getImg (res, type) {
      if (type === 'front') {
        this.frontPicUrl = res
        this.frontGet = true
      } else if (type === 'back') {
        this.backPicUrl = res
        this.backGet = true
      }
    },
    testReg (type) {
      let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      let regcard = /^[\u4E00-\u9FA5]+$/
      if (type === 'name') {
        if (!regcard.test(this.userName)) {
          this.$vux.toast.text('填写正确姓名格式', 'middle')
          return false
        }
      } else if (type === 'idCard') {
        if (!reg.test(this.userCard)) {
          this.$vux.toast.text('填写正确身份证号格式', 'middle')
          return false
        }
      }
    },
    submit () {
      if (this.userName === '') {
        this.$vux.toast.text('姓名不能为空', 'middle')
        return false
      }
      if (this.userCard === '') {
        this.$vux.toast.text('身份证号不能为空', 'middle')
        return false
      }
      if (this.frontGet === false) {
        this.$vux.toast.text('请拍摄身份证正面照片', 'middle')
        return false
      }
      if (this.backGet === false) {
        this.$vux.toast.text('请拍摄身份证背面照片', 'middle')
        return false
      }
      let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      let regcard = /^[\u4E00-\u9FA5]+$/
      if (!regcard.test(this.userName)) {
        this.$vux.toast.text('填写正确姓名格式', 'middle')
        return false
      }
      if (!reg.test(this.userCard)) {
        this.$vux.toast.text('填写正确身份证号格式', 'middle')
        return false
      }
      this.$vux.loading.show({
        text: '数据加载..'
      })
      indexApi.verifyOcrManualMessage({
        name: this.userName,
        number: this.userCard,
        idcardPicture1: this.frontPicUrl,
        idcardPicture2: this.backPicUrl
      }).then((response) => {
        console.log(response, '上传结果')
        this.$vux.loading.hide()
        let res = response.data
        if (res.code === 200) {
              // this.$vux.toast.text(res.message, 'middle')
          this.$router.push({
            path: `/authentication/identify/faceRecognition`,
            query: this.$route.query ? this.$route.query : ''
          })
        } else {
          if (res.code === 400126) {
            this.$router.push({
              path: '/authentication/status', query: this.$route.query ? this.$route.query : ''
            })
          }
          this.$vux.toast.text(res.message, 'middle')
        }
      }).catch((error) => {
        this.$vux.loading.hide()
        this.$vux.toast.text(error, 'middle')
      })
    }
  },
  beforeCreate () {
    document.getElementsByTagName('body')[0].className = 'card'
  },
  components: {
    Group,
    XButton,
    Box,
    takePhoto
  }
}
</script>

<style lang='less'>
@import url('../../style/variable');
.hand {
 background: #fff;
 .cardBox {
  width: 530px;
  height: 334px;
  margin: 20px auto;
  // box-shadow: 0px 0px 15px #f0f0f0;
  border-radius:8px;
  .con {
   position: relative;
  //  margin: 20px auto;
  }
  img {
   margin:auto;
   width: 530px;
   height: 334px;
  }
 }
 .group {
  margin: 20px auto;
  width: 530px;
 }
.infoMessage {
  .font-dpr(22px);
  position: relative;
  text-align: center;
  font-weight: 500;
  color: rgba(153, 153, 153, 1);
  padding: 15px 0 0 0;
  vertical-align: middle;
  span {
    display: inlie-block;
    margin-left: 9px;
  }
}
 .weui-cell {
  padding: 0.4rem 0.4rem !important;
  font-size: 32px;
  font-family: PingFang-SC-Medium;
  line-height: 36px;
  letter-spacing: 10;
 }
 .weui-label {
  letter-spacing: 10;
 }
.weui-cells:before{
  border-top: 1px solid #fff!important;
}
.weui-cell{
   padding:20px!important;
}
.group[data-v-d0c8d32e]{
margin:20px auto;
width:500px;
}
.marg{
  margin:0;
}
}
</style>