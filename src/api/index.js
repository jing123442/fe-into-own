import request from '@/utils/request'
import commonQuery from '@/utils/commonQuery'

const indexApi = {
  getIndex () { // 认证列表
    return request({
      url: 'authentication/index/status',
      method: 'post',
      data: commonQuery()
    })
  },
  saveBaseInfo ({ // 保存基本信息
    jobCompany = '',
    jobAddress = '',
    jobDetailAddress = '',
    jobContact = '',
    jobPerson = '',
    jobSalary = '',
    currentAddress = '',
    currentDetailAddress = '',
    qq = ''
  } = {}) {
    return request({
      url: 'authentication/basic',
      method: 'post',
      data: Object.assign({
        jobCompany,
        jobAddress,
        jobDetailAddress,
        jobContact,
        jobPerson,
        jobSalary,
        currentAddress,
        currentDetailAddress,
        qq
      }, commonQuery())
    })
  },
  uploadPic ({ // 上传图片
    src1 = '',
    src2 = '',
    src3 = '',
    src4 = ''
  } = {}) {
    return request({
      url: 'authentication/idphoto',
      method: 'post',
      data: Object.assign({
        src1,
        src2,
        src3,
        src4
      }, commonQuery())
    })
  },
  identify ({ // 实名认证
    name = '',
    idCard = ''
  } = {}) {
    return request({
      url: 'authentication/certification',
      method: 'post',
      data: Object.assign({
        name,
        idCard
      }, commonQuery())
    })
  },
  verifyOcrManualMessage ({ // 身份证验证-手动上传
    name = '',
    number = '',
    idcardPicture1 = '',
    idcardPicture2 = ''} = {}) {
    return request({
      url: 'authentication/verifyOcrManualMessage',
      method: 'post',
      data: Object.assign({
        name,
        number,
        idcard_picture_1: idcardPicture1,
        idcard_picture_2: idcardPicture2
      }, commonQuery())
    })
  },
  emergency ({ // 紧急联系人
    emergencyContactName = '',
    emergencyContactPhone = '',
    emergencyContactRelation = '',
    otherContactName = '',
    otherContactPhone = '',
    otherContactRelation = ''
  } = {}) {
    return request({
      url: 'authentication/emergencyContactInfo',
      method: 'post',
      data: Object.assign({
        emergencyContactName,
        emergencyContactPhone,
        emergencyContactRelation,
        otherContactName,
        otherContactPhone,
        otherContactRelation
      }, commonQuery())
    })
  }
}
export default indexApi
