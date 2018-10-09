function ajaxNeedLogin(options = {}) {
  $.ajax({
    url: options.url || '',
    type: options.type || 'get',
    data: options.data || {},
    success: function (data) {
      if (!data.error) {
        options.success && options.success(data)
      } else {
        location.href = '/mine/login.html?back=' + location.href
      }
    },
    error: options.error || function () {},
    complete: options.complete || function () {}
  })
}