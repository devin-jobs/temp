import dayjs from 'dayjs'
export function agentAuditValue(status: any) {
  if (status == 1) {
    return '启用中'
  } else if (status == 2) {
    return '停用'
  }
}
// 团队状态
export function teamStatus(status: any) {
  if (status == 1) {
    return '启用中'
  } else if (status == 0) {
    return '停用'
  }
}
export function hiddenPhone(phone: any) {
  return phone === null || phone === undefined ? '' : phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}
export function getCityName(citys: any) {
  return (
    citys &&
    citys
      .map((item: any) => {
        return item.cityName
      })
      .join(',')
  )
}
export function dateFormat(value: any, format = 'YYYY-MM-DD HH:MM:ss') {
  if (value) {
    return dayjs(Number(value)).format(format)
  } else {
    return ''
  }
}
// 使用dayjs根据生日的时间戳计算年龄
export function getAgeByBirthday(birthday: any) {
  if (birthday) {
    // const age = dayjs().diff(dayjs(birthday), 'year')
    const age = Number(dayjs().format('YYYY')) - Number(dayjs(birthday).format('YYYY'))
    return age
  } else {
    return '未知'
  }
}
export function conversionTime(time: string) {
  var approvedates = time.replace(/[年月]/g, '-')
  var approvedate = approvedates.replace(/[日]/, '')
  return new Date(approvedate).getTime()
}
// 根据身份证号码计算年龄  这个算法会根据生日
export function getAgeByIdCard(idCard: any) {
  var birthday = ''
  if (idCard != null && idCard != '') {
    if (idCard.length == 15) {
      birthday = '19' + idCard.substring(6, 12)
      return dayjs().diff(dayjs(birthday), 'year')
    } else if (idCard.length == 18) {
      birthday = idCard.substring(6, 14)
      return dayjs().diff(dayjs(birthday), 'year')
    }
  }
}
export function userStatus(val: any) {
  return val === null || val === undefined ? '' : val ? '启用' : '已停用'
}
export function seatStatus(val: any) {
  // 状态 ：1：启用中、2：冻结中、3: 已离职、4: 已辞退
  let obj = <any>{
    text: '',
    type: '',
  }
  if (val === 1) {
    obj.text = '启用中'
    obj.type = 'success'
  } else if (val === 2) {
    obj.text = '冻结中'
    obj.type = 'warning'
  } else if (val === 3) {
    obj.text = '已离职'
    obj.type = 'info'
  } else if (val === 4) {
    obj.text = '已辞退'
    obj.type = 'danger'
  } else {
    obj.text = '停用'
    obj.type = 'info'
  }
  return obj
}
export function gender(val: any) {
  if (val === null || val === undefined) {
    return ''
  } else if (val === 1) {
    return '男'
  } else if (val === 2) {
    return '女'
  } else {
    return '未知'
  }
}
// type=》角色
export function getUserTypeRole(type: any) {
  let kv = [
    { key: 1, value: '平台管理员' },
    { key: 2, value: '员工 ' },
    { key: 3, value: '团队管理员 ' },
    { key: 4, value: '坐席 ' },
  ]
  return kv.find((item) => item.key === type)?.value
}
