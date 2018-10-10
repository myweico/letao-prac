$(function () {
  // 验证码
  $('.code button').on('tap', function () {
    let codeBtn = this
    codeBtn.innerHTML = '正在发送...'
    codeBtn.setAttribute('disabled', true)
    // 请求验证码
    ajaxNeedLogin({
      url: '/user/vCodeForUpdatePassword',
      success: function (data) {
        console.log(data.vCode)
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
})