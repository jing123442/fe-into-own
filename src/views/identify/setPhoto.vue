<template>
  <div class='setPhoto'>
    <div class="dangercenter">
      必须使用本人身份证，身份证将联网公安部门认证
    </div>
    <div class="cardFront cardBox" >
      <img :src="frontPicUrl" @click="openOcr('front')" :class='imgFrontChange?"normalImg":"samllImg"'/>
    </div>
    <div class="cardBack cardBox">
      <img :src="backPicUrl" @click="openOcr('back')" :class='showSubmitButton?"normalImg":"samllImg"' />
    </div>
    <group class='group' v-show='showNameAndId'>
      <x-input title="真实姓名" placeholder="请输入姓名" v-model="userName" :show-clear="false" text-align="left"></x-input>
      <x-input title="身份证号"  v-model="userCard"  text-align="left" :disabled='true' ></x-input>
    </group>
    <box class="marg" v-show='showSubmitButton&&showNameAndId'>
      <x-button type="primary" @click.native="submit(userName)" class='group'>下一步</x-button>
    </box>
    <footer :class="showSubmitButton?'infoMessageSmall':'infoMessageNormal'">
      <i class='blueicon'></i><span>信息仅用于身份验证</span>
    </footer>
  </div>
</template>
<script>
import {Group, XButton, Box} from 'vux'
export default {
  data () {
    return {
      frontPicUrl: require(`@/asset/card_front.png`),
      backPicUrl: require(`@/asset/card_back.png`),
      userName: '',
      userCard: '',
      showNameAndId: false,
      showSubmitButton: false,
      imgFrontChange: false
    }
  },
  watch: {
    frontPicUrl () {
      this.imgFrontChange = true
    },
    backPicUrl () {
      if ((this.imgFrontChange === true) && (this.$route.query.ocrType === 1)) {
        try {
          if (this.$route.query.platform === 'ios') {
            window.webkit.messageHandlers.submitCertificationInfo.postMessage()
          } else {
            this.$vux.loading.show({text: '数据加载..'}) // android在h5端调用加载————在android直接关闭
            window.javaObj.submitCertificationInfo()
          }
        } catch (error) {
          console.log(error)
        }
      }
      this.showSubmitButton = true
    }
  },
  methods: {
    setFrontPic (picUrl) { // 共用
      this.frontPicUrl = picUrl
    },
    setBackPic (picUrl) { // 共用
      this.backPicUrl = picUrl
    },
    openOcr (idType) { // 共用
      if (this.$route.query.ocrType === 1) { // 从实名认证页面跳转
        try {
          if (this.$route.query.platform === 'ios') {
            window.webkit.messageHandlers.openOcr.postMessage({cardType: idType, type: 'certification'})
          } else {
            window.javaObj.openOcr(idType, 'certification')
          }
        } catch (error) {
          console.log(error)
        }
      } else if (this.$route.query.ocrType === 2) { // 从身份证验证页面跳转
        try {
          if (this.$route.query.platform === 'ios') {
            window.webkit.messageHandlers.openOcr.postMessage({cardType: idType, type: 'identity'})
          } else {
            window.javaObj.openOcr(idType, 'identity')
          }
        } catch (error) {
          console.log(error)
        }
      }
    },
    identifyOcrFail (str) { // 身份证认证-跳转到手动认证页面（实名认证失败app端调用navigoback，前端不做操作），
      this.$router.push({path: `/authentication/identify/verifyOcrManual`, query: this.$route.query ? this.$route.query : ''})
    },
    setNameAndId (strName, strID) { // 身份证验证-图片扫描结束完成后调用
      this.userName = strName
      this.userCard = strID
      this.showNameAndId = true
    },
    uploadFinish (strName, strID) { // 实名认证-图片扫描成功调用
      this.$router.push({path: `/authentication/identify/user/${strName}/card/${strID}`, query: this.$route.query ? this.$route.query : ''})
      // this.$router.push({path: `/authentication/identify/user/${strName}/card/${strName}`, query: this.$route.query ? Object.assign({}, this.$route.query, {user: strName + '', card: '' + strID}) : ''})
    },
    identifyUploadFinish () { // 身份证验证-后台图片上传成功，可以跳页面
      this.$router.push({path: `/authentication/identify/faceRecognition`, query: this.$route.query ? this.$route.query : ''})
    },
    submit (name) { // 身份证验证页面提交不跳转，触发后台方法，后台图片上传成功后，才可以跳转
      if (this.userName === '') {
        this.$vux.toast.text('姓名不能为空', 'middle')
        return false
      }
      let regcard = /^[\u4E00-\u9FA5]+$/
      if (!regcard.test(this.userName)) {
        this.$vux.toast.text('填写正确姓名格式', 'middle')
        return false
      }
      try {
        if (this.$route.query.platform === 'ios') {
          window.webkit.messageHandlers.submitIdentityInfo.postMessage(name)
        } else {
          this.$vux.loading.show({text: '数据加载..'})  // android在h5端调用加载————在android直接关闭
          window.javaObj.submitIdentityInfo(name)
        }
      } catch (error) {
        console.log(error)
      }
    },
    testReg (type) {
      let regcard = /^[\u4E00-\u9FA5]+$/
      if (type === 'name') {
        if (!regcard.test(this.userName)) {
          this.$vux.toast.text('填写正确姓名格式', 'middle')
          return false
        }
      }
    },
    loadingShow () {
      this.$vux.loading.show({
        text: '数据加载..'
      })
    },
    loadingHide () {
      this.$vux.loading.hide()
    }
  },
  mounted () {
    window.setFrontPic = this.setFrontPic.bind(this)
    window.setBackPic = this.setBackPic.bind(this)
    window.setNameAndId = this.setNameAndId.bind(this)
    window.identifyOcrFail = this.identifyOcrFail.bind(this)
    window.uploadFinish = this.uploadFinish.bind(this)
    window.identifyUploadFinish = this.identifyUploadFinish
    window.loadingShow = this.loadingShow
    window.loadingHide = this.loadingHide
  },
  beforeCreate () {
    document.getElementsByTagName('body')[0].className = 'card'
  },
  components: {
    Group,
    XButton,
    Box
  }
}
</script>
<style lang="less" scoped>
@import url('../../style/variable.less');
.setPhoto{
.cardBox {
  width: 530px;
  height: 334px;
  margin: 24px auto;
  background: #edf6fd;
  border: 1px solid #f0f0f0;
  box-shadow: 0px 0px 15px #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius:5px;
  .samllImg {
    width: 400px;
    border-radius:4px;
  }
  .normalImg{
  
  width:530px;
  height:334px;
 }
}
 .group {
    margin: 50px auto;
    width: 600px;
  }
.infoMessageNormal {
  .font-dpr(22px);
  position: relative;
  text-align: center;
  font-weight: 500;
  color: rgba(153, 153, 153, 1);
  padding: 150px 0 0 0;
  vertical-align: middle;
  span {
    display: inlie-block;
    margin-left: 9px;
  }
}
.infoMessageSmall{
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

