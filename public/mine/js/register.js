$(function () {
  $('.code button').on('tap', function () {
    let codeBtn = this
    codeBtn.innerHTML = '正在发送...'
    codeBtn.setAttribute('disabled', true)
    // 请求验证码
    $.ajax({
      url: '/user/vCode',
      success: function (data) {
        mui.alert(data.vCode, '验证码')
      }
    })
    let time = 60
    let timer = setInterval(function () {
      time = time - 1
      codeBtn.innerText = time + '秒后再获取'
      if (time === 0) {
        codeBtn.innerText = '获取验证码'
        codeBtn.removeAttribute('disabled')
        clearInterval(timer)
      }
    }, 1000)
  })

  $('.btn-register').on('tap', function () {
    let account = $('.account').val().trim()
    let mobile = $('.mobile').val().trim()
    let password = $('.password').val().trim()
    let passwordAgain = $('.password').val().trim()
    let code = $('.code input').val().trim()
    // 验证是否为空
    if (!account || !mobile || !password || !passwordAgain || !code) {
      mui.toast('要填写完毕噢~')
      return
    }
    // 验证手机号
    if (!/^1[34578]\d{9}$/.test(mobile)) {
      mui.toast('手机号添错啦~')
      return
    }

    // 验证密码
    if (password !== passwordAgain) {
      mui.toast('两次密码不一致')
      return
    }

    $.ajax({
      url: '/user/register',
      type: 'post',
      data: {
        username: account,
        mobile: mobile,
        password: password,
        vCode: code
      },
      success: function (data) {
        if (!data.error) {
          mui.toast('注册成功')
          setTimeout(() => {
            location.href = '/mine/login.html'
          }, 1000)
        } else {
          mui.toast(data.message)
        }
      }
    })
  })

})