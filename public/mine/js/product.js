$(function () {
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

      // 选中样式的事件
      $('.product-choice span').on('tap', function () {
        $(this).addClass('chosen').siblings().removeClass('chosen')
      })
    }
  })
}

function getId() {
  let url = location.href
  return /productId=([^&]*)/.exec(url)[1]
}