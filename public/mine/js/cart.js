/* 全局变量 */
window.cartData = []
window.updateData = {}

$(function () {
  initCart()

  // 初始化区域滚动
  mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
  });

  // 删除功能
  $('body').on('tap', '.cart-delete', function () {
    let that = this
    mui.confirm('确定要删除这件商品吗', '温馨提示', ['确认', '取消'], function (e) {
      let deleteLi = that.parentNode.parentNode
      let cartIndex = deleteLi.dataset.cartIndex
      let deleteId = window.cartData[cartIndex].id
      if (e.index === 0) {
        ajaxNeedLogin({
          url: '/cart/deleteCart',
          type: 'GET',
          data: {
            id: [deleteId]
          },
          success: function () {
            deleteLi.remove()
            mui.toast('删除成功!', {
              duration: 1000
            })
          }
        })
      } else {
        setTimeout(function () {
          mui.swipeoutClose(deleteLi)
        }, 0)
      }
    })
  })

  // 编辑功能
  $('body').on('tap', '.cart-edit', function () {
    let that = this
    let editLi = that.parentNode.parentNode
    let cartIndex = editLi.dataset.cartIndex
    let editLiData = window.cartData[cartIndex]
    let editId = editLiData.id
    window.updateData = {
      id: editLiData.id,
      num: editLiData.num,
      size: editLiData.size
    }
    let renderStr = template('product-edit-template', editLiData).replace(/\n/g, ' ')
    mui.confirm(renderStr, '编辑商品', ['确定', '取消'], function (e) {
      if (e.index === 0) {
        // 提交编辑
        ajaxNeedLogin({
          url: '/cart/updateCart',
          type: 'post',
          data: window.updateData,
          success: function (data) {
            if (data.success) {
              // 修改购物车的数据（或者可以重新请求渲染购物车页面）
              $(editLi).find('.selected-size').text(window.updateData.size)
              $(editLi).find('.selected-num').text(window.updateData.num)
              setTimeout(function () {
                mui.swipeoutClose(editLi)
              }, 0)
              mui.toast('编辑成功', {
                duration: 1000
              })
            } else {
              mui.toast('服务器繁忙\n请稍后再试', {
                duration: 500
              })
            }
          },
          complete: function () {
            window.updateData = {}
          }
        })
      } else {
        window.updateData = {}
        setTimeout(function () {
          mui.swipeoutClose(editLi)
        }, 0)
      }
    })
    // 初始化数量按钮
    mui('.count-numbox').numbox()
    mui('.mui-popup-text .mui-scroll-wrapper').scroll({
      deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });
  })
  // 编辑尺码
  $('body').on('tap', '.product-choice span', function () {
    let size = parseInt($(this).text())
    $(this).addClass('chosen').siblings().removeClass('chosen')
    window.updateData.size = size
  })
  // 编辑数量
  $('body').on('change', 'input.mui-input-numbox', function () {
    let num = parseInt($(this).val())
    window.updateData.num = num
  })

  // 合计价格

  function initCart() {
    $.ajax({
      url: '/cart/queryCart',
      success: function (data) {
        if (data.error) {
          location.href = '/mine/login.html?back=' + location.href
          return
        }
        window.cartData = data
        let renderStr = template('cart-body-template', {
          data
        })
        $('.cart-list').html(renderStr)
      }
    })
  }

  function ajaxNeedLogin(options = {}) {
    $.ajax({
      url: options.url || '',
      type: options.type || 'get',
      data: options.data || {},
      success: function (data) {
        if (data.success) {
          options.success && options.success(data)
        } else {
          location.href = '/mine/cart.html?back=' + location.href
        }
      },
      error: options.error || function () {},
      complete: options.complete || function () {}
    })
  }
})