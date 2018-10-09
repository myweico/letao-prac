$(function () {
  // 登录
  $('.login input[type=submit]').on('tap', function () {
    let account = $('.account').val()
    let password = $('.password').val()
    $.ajax({
      type: 'post',
      url: '/user/login',
      data: {
        username: account,
        password: password
      },
      success: function (data) {
        if (data.success) {
          location.href = getReturnUrl()
        } else {
          mui.toast(data.message)
        }
      }
    })
  })

  $('.register').on('tap', function () {
    location.href = "/mine/register.html"
  })

  function getReturnUrl () {
    let returnURl = /back=([^&]*)/.exec(location.href)
    return returnURl ? returnURl[1] : '/mine/'
  }
})