const routesList = [
  { path: 'status', title: '完善资料', compath: 'index', children: false },
  { path: 'baseinfo', title: '基本信息', compath: 'baseinfo/index', children: false },
  { path: 'upload', title: '证件照片', compath: 'upload/index', children: false },
  { path: 'emergency', title: '紧急联系人', compath: 'emergency/index', children: false },
  { path: 'identify', title: '实名认证', compath: 'identify/index', children: false },
  { path: 'identify/setPhoto', title: '身份证验证', compath: 'identify/setPhoto', children: true },
  { path: 'identify/user/:user/card/:card', title: '实名认证', compath: 'identify/index', children: false },
  { path: 'identify/verifyOcrManual', title: '身份证验证', compath: 'identify/verifyOcrManual', children: false },
  { path: 'identify/faceRecognition', title: '人脸识别', compath: 'identify/faceRecognition', children: false }

]
export const routePath = 'authentication'
export default {
  routesList,
  routePath
}
