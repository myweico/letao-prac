$(function () {
  /* 全局变量 */
  initPage()
})

function initPage() {
  let id = getId()
  $.ajax({
    url: '/product/queryProductDetail',
    data: {
      id
    },
    success: function (data) {
      // 渲染页面
      let renderStr = template('detail-template', data)
      $('.container').html(renderStr)

      // 初始化轮播图事件
      mui('.mui-slider').slider({});
      
      // 绑定弹出事件
      $('.selected-list').on('tap', function () {
        mui('#selected-popover').popover('toggle')
      })

      // 初始化按钮
      mui('.count-numbox').numbox()

      // 选择商品
      $('.product-choice span').on('tap', function () {
        let size = $(this).text()
        $(this).addClass('chosen').siblings().removeClass('chosen')
        $('.selected-size').text(size)
      })

      $('input.mui-input-numbox').on('change', function () {
        let num  = $(this).val()
        $('.selected-num').text(num)
      })

      $('.button-add2cart').on('tap', function() {
        let id = getId()
        let size = $('.selected-size').text()
        let num = $('.selected-num').text()
        $.ajax({
          type: 'post',
          url: '/cart/addCart',
          data: {
            productId: id,
            size: size,
            num: num
          },
          success: function (data) {
            if (data.success) {
              mui.toast('已添加至购物车')
            } else {
              location.href = "/mine/login.html?back=" + location.href
            }
          }
        })
      })

      $('.footer-cart').on('tap', function () {
        location.href = '/mine/cart.html'
      })

      $('.button-buy').on('tap', function () {
        mui.toast('未提供接口')
      })
    }
  })
}

function getId() {
  let url = location.href
  return /productId=([^&]*)/.exec(url)[1]
}