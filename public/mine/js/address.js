$(function () {
  initAddress()

  var picker = initPicker()

  // 编辑地址
  $('body').on('tap', '.addressLi', function () {
    let editData = {}
    let editId = this.dataset.id
    ajaxNeedLogin({
      url: '/address/queryAddress',
      success: function (data) {
        editData = data.find(function (li) {
          return parseInt(li.id) === parseInt(editId)
        })
        editStr = template('add-template', {
          editId: editId,
          address: editData.address,
          addressDetail: editData.addressDetail,
          recipients: editData.recipients,
          postCode: editData.postCode
        })
        $('.container').html(editStr)
      }
    })
  })

  // 添加新地址
  $('body').on('tap', '.btn-add', function () {
    let addAddressStr = template('add-template', {})
    $('.container').html(addAddressStr)
  })

  // 保存新添的或者编辑的地址
  $('body').on('tap', '.save', function () {
    let editId = $('.save').data('editId')
    let address = $('.address').val().trim() + ' '
    let addressDetail = $('.addressDetail').val().trim()
    let recipients = $('.recipients').val().trim()
    let postcode = $('.mobile').val().trim()
    let data = {
      id: editId,
      address,
      addressDetail,
      recipients,
      postcode
    }
    if (!address || !addressDetail || !recipients || !postcode) {
      mui.toast('信息不够完整哦~')
      return
    }

    if (!checkPhone(postcode)) {
      mui.toast('手机号码填错了~')
      return
    }
    if (editId) {
      editAddress(data, function () {
        initAddress()
      })
    } else {
      // addAddress()
      addAddress(data, function () {
        initAddress()
      })
    }
  })

  // 取消编辑或者添加
  $('body').on('tap', '.cancel', function () {
    initAddress()
  })

  // 点击编辑省市区
  $('body').on('tap', '.address', function () {
    // 获取当前的省市区
    let address = $(this).val() || '北京市 警备师 哈哈哈'
    setSelectedIndex(address, picker, cities)
    picker.show()
  })

  // 选择框确定
  $('body').on('tap', '.mui-poppicker-btn-ok', function () {
    console.dir(picker.getSelectedItems())
    let addressObj = picker.getSelectedItems()
    let address = ''
    for (let i = 0; i <= 2; i++) {
      address += addressObj[i].text ? addressObj[i].text + ' ' : ' '
    }

    $('.address').val(address)
    picker.hide()
  })

  // 删除收货地址
  $('body').on('tap', '.deleteAddress', function () {
    let deleteLi = $(this).parents('.addressLi')
    let deleteId = deleteLi.data('id')
    deleteAddress(deleteId, function () {
      deleteLi.remove()
      initAddress()
    })
  })

  /* 封装函数 */
  function initAddress() {
    ajaxNeedLogin({
      url: '/address/queryAddress',
      success: function (data) {
        let renderStr = template('address-template', {
          address: data
        })
        $('.container').html(renderStr)

        // 初始化区域滚动
        mui('.mui-scroll-wrapper').scroll({
          scrollY: true, //是否竖向滚动
          scrollX: false, //是否横向滚动
          startX: 0, //初始化时滚动至x
          startY: 0, //初始化时滚动至y
          indicators: false, //是否显示滚动条
          deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏
          bounce: false //是否启用回弹
        })
      }
    })
  }

  function initPicker() {
    let picker = new mui.PopPicker({
      layer: 3,
      button: ['cancel', 'ok']
    })

    picker.setData(cities)
    return picker
  }

  function addAddress(data, callback) {
    ajaxNeedLogin({
      url: '/address/addAddress',
      type: 'post',
      data: data,
      success: function () {
        callback && callback()
      }
    })
  }

  function deleteAddress(id, callback) {
    ajaxNeedLogin({
      url: '/address/deleteAddress',
      type: 'post',
      data: {
        id
      },
      success: function (data) {
        callback && callback()
      }
    })
  }

  function editAddress(data, callback) {
    ajaxNeedLogin({
      url: '/address/updateAddress',
      type: 'post',
      data: data,
      success: function () {
        callback && callback()
      }
    })
  }

  // 检查手机号码
  function checkPhone(phone) {
    return /^1[34578]\d{9}$/.test(phone)
  }

  function setSelectedIndex(address, picker, cities = {}) {
    let defaultText = address.split(' ')
    let defaultIndex = []
    console.log(defaultText)
    let parentData = cities
    for (let i = 0; i < 3; i++) {
      defaultIndex[i] = parentData.findIndex(function (item) {
        return item.text === defaultText[i]
      })
      console.log(defaultIndex[i])
      if (defaultIndex[i] < 0) {
        // 没有找到匹配值，默认值为第一个
        defaultIndex[i] = 0
        parentData = []
      } else {
        // 若找到匹配值，更新父数据
        parentData = parentData[defaultIndex[i]].children || []
      }
      
    }
    console.log(defaultIndex)
    // defaultIndex[0] = cities.findIndex(function (province) {
    //   return province.text === defaultText[0]
    // })
    // defaultIndex[1] = cities[defaultIndex[0]].children.findIndex(function (city) {
    //   return city.text === defaultText[1]
    // })
    // defaultIndex[2] = cities[defaultIndex[0]].children[defaultIndex[1]].children.findIndex(function (district) {
    //   return district.text === defaultText[2]
    // })

    picker.pickers[0].setSelectedIndex(defaultIndex[0], 0, function () {
      picker.pickers[1].setSelectedIndex(defaultIndex[1], 0, function () {
        picker.pickers[2].setSelectedIndex(defaultIndex[2], 0)
      })
    })
  }
})