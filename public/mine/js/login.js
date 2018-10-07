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
    return /back=([^&]*)/.exec(location.href)[1]
  }
})