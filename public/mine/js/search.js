$(function () {
  // 获取存储的history
  var history = JSON.parse(localStorage.getItem('history')) || []

  // 显示历史纪录
  showHistory(history)

  // 点击按钮，加入搜索历史
  addHistory(history)

  // 清空功能
  bindClearHistory()

  // 点击纪录跳转
  bindLink(history)

  // 删除单个纪录
  bindDeleteHistory(history)
})

function addHistory(history) {
  $('.search-input button').on('tap', function () {
    let keyword = $(this).prev().val().trim()

    // 1.1 若为空，则提示输入关键字
    if (keyword.length === 0) {
      mui.toast('请输入关键字')
      return
    }

    // 1.2 判断关键字是否存在，存在则删除原记录
    if (history.includes(keyword)) {
      let delIndex = history.findIndex((item) => {
        return item === keyword
      })
      history.splice(delIndex, 1)
    }

    // 1.3 加入到新的记录
    history.push(keyword)

    // 1.4 当记录超过10条的时候就覆盖最旧的历史记录
    if (history.length > 10) {
      history.splice(0, history.length - 10)
    }

    // 1.5 保存到storage中
    localStorage.setItem('history', JSON.stringify(history))

    // 1.6 跳转到搜索结果页面
    location.href = 'searchResult.html?keyword=' + keyword
  })
}

function showHistory(history) {
  let renderStr = template('historyTemp', {
    history: history
  })
  $('.history').html(renderStr)
}

function bindClearHistory(history) {
  $('.history').on('tap', '.clearHistory', function () {
    localStorage.removeItem('history')
    // 重新渲染
    let renderStr = template('historyTemp', {
      history: []
    })
    $('.history').html(renderStr)
  })
}

function bindLink(history) {
  $('.history').on('tap', '.history-list a', function () {
    let keyword = $(this).text()
    let delIndex = history.findIndex((item) => {
      return item === keyword
    })
    history.splice(delIndex, 1)
    history.push(keyword)
    localStorage.setItem('history', JSON.stringify(history))
    location.href = 'searchResult.html?keyword=' + keyword
  })
}

function bindDeleteHistory(history) {
  $('.history').on('tap', '.history-list span', function () {
    let item = $(this).prev().text()
    let delIndex = history.findIndex((value) => {
      return value === item
    })
    history.splice(delIndex, 1)
    localStorage.setItem('history', JSON.stringify(history))
    // 重新渲染
    let renderStr = template('historyTemp', {
      history
    })
    $('.history').html(renderStr)
  })
}