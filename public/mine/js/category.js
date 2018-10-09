$(function () {

  // 初始化区域滚动
  mui('.mui-scroll-wrapper').scroll({
    bounce: false,
    indicators: false
  });

  // 初始化页面
  initCate()

  // 绑定点击页面事件
  $('body').on('tap', '.category-tab li', function () {
    $(this).addClass('selected').siblings().removeClass('selected')
    // 渲染页面
    $.ajax({
      url: '/category/querySecondCategory',
      data: {
        id: this.dataset.id
      },
      success: function (data) {
        let listStr = template('category-list-tmpl', data)
        $('.category-list .mui-scroll').html(listStr)
      }
    })

  })
  /* 封装函数 */
  function initCate() {
    $.ajax({
      url: '/category/queryTopCategory',
      success: function (data) {
        let tabStr = template('category-tab-tmpl', data)
        $('.category-tab .mui-scroll').html(tabStr)

        // 渲染第一个列表
        $.ajax({
          url: '/category/querySecondCategory',
          data: {
            id: data.rows[0].id
          },
          success: function (data) {
            let listStr = template('category-list-tmpl', data)
            $('.category-list .mui-scroll').html(listStr)
          }
        })
      }
    })
  }
})