$(function () {
  initProfile()
  
  // 绑定登出操作
  $('.loginout').on('tap', function () {
    mui.confirm('退出登录？', '', ['确定', '取消'], function (e) {
      if (e.index === 0) {
        $.ajax({
          url: '/user/logout',
          success: function (data) {
            if (data.success) {
              location.href = '/mine/'
            } else {
              mui.toast('服务器繁忙，请稍后再试')
            }
          }
        })
      }
    })
  })
  
  /* 封装函数 */
  function initProfile () {
    ajaxNeedLogin({
      url: '/user/queryUserMessage',
      success: function (data) {
        let renderStr = template('profile-template', data)
        $('.info-li').html(renderStr)
      }
    })
  }
})