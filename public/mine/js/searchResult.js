$(function () {
  /* 全局变量 */
  var options = {
    page: 0,
    proName: ''
  }

  // 为了判断是否还有数据，page固定
  var pageSize = 4

  // 初始化页面
  initPage()

  // 初始化下拉刷新
  mui.init({
    pullRefresh: {
      container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down: {
        height: 50, //可选,默认50.触发下拉刷新拖动距离,
        auto: false, //可选,默认false.首次加载自动下拉刷新一次
        contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
        contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
        contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
        callback() {
          //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
          // name,price,num保持不变
          // page重置为0
          options.page = 1
          getSearch(options, (data) => {
            setTimeout(() => {
              mui('#refreshContainer').pullRefresh().endPulldownToRefresh()
              initSearch(data)
            }, 1000)
            // mui('#refreshContainer').pullRefresh().endPullDown() //官网的方法不存在？？
          })
        }
      },
      up: {
        height: 50, //可选.默认50.触发上拉加载拖动距离
        auto: false, //可选,默认false.自动上拉加载一次
        contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
        contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
        callback() {
          options.page = parseInt(options.page) + 1
          getSearch(options, (data) => {
            setTimeout(() => {
              let hasNoMore = data.data.length < pageSize
              console.log(hasNoMore)
              if (hasNoMore) {
                // 回退到原页面
                mui('#refreshContainer').pullRefresh().endPullupToRefresh(true)
              } else {
                mui('#refreshContainer').pullRefresh().endPullupToRefresh()
              }
              let renderStr = template('search-result', data)
              $('.product-list').append($(renderStr))
            }, 1000)
          })

        } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
      }
    }
  })

  // 绑定搜索事件
  $('.search-input button').on('tap', function () {
    let $this = $(this)

    // 重置请求参数
    options = {
      proName: $this.prev().val().trim(),
      page: 1
    }

    // 若为空，提示输入关键字
    if (options.proName.length === 0) {
      mui.toast('请输入关键字')
      return
    }

    $('.waiting').removeClass('hidden')
    getSearch(options, (data) => {
      setTimeout(function () {
        $('.waiting').addClass('hidden')
        initSearch(data)
      }, 500)
    })
  })

  $('.search-input input').on('keyup', function (event) {
    if (event.keyCode === 13) {
      $('.search-input button').trigger('tap')
    }
  })

  // 绑定排序事件
  $('.orderbar>span').on('tap', function () {
    let $this = $(this)
    let $icon = $this.children('span')
    let order = $this.data('order')
    if (!$this.hasClass('selected')) {
      $this.addClass('selected').siblings().removeClass('selected')
      $('.orderbar span[class~=mui-icon]').removeClass('mui-icon-arrowup').addClass('mui-icon-arrowdown')

      options.price = 2
      options.num = 2
    } else if ($icon.hasClass('mui-icon-arrowdown')) {
      $icon.removeClass('mui-icon-arrowdown').addClass('mui-icon-arrowup')
      options[order] = 1
    } else {
      $icon.removeClass('mui-icon-arrowup').addClass('mui-icon-arrowdown')
      options[order] = 2
    }
    // 重新获取列表
    options.page = 1
    $('.waiting').removeClass('hidden')
    getSearch(options, (data) => {
      setTimeout(function () {
        $('.waiting').addClass('hidden')
        initSearch(data)
      }, 500)
    })
  })

  // 绑定购买事件
  $('.search-list').on('tap', '.button-buy', function () {
    let prodId = this.dataset.id
    location.href = '/mine/product.html?productId=' + prodId
  })

  function initPage() {
    let url = location.href
    let reg = /keyword=([^&]*)/
    let keyword = reg.exec(url)[1]
    options.proName = keyword
    options.page = 1
    $('.waiting').removeClass('hidden')
    getSearch(options, (data) => {
      setTimeout(function () {
        $('.waiting').addClass('hidden')
        initSearch(data)
      }, 500)
    })
  }

  function getSearch(optoins, callback) {
    $.ajax({
      url: '/product/queryProduct',
      data: {
        proName: options.proName || '',
        page: options.page || 1,
        pageSize: pageSize || 4,
        brandId: options.brandId || '',
        price: options.price || '',
        num: options.num || ''
      },
      success(data) {
        callback && callback(data)
      }
    })
  }

  function renderList(data) {
    let str = template('search-result', data)
    $('.product-list').html(str)
  }

  function initSearch(data) {
    if (data.data.length === 0) {
      $('.search-list').html('<div class="noData">没有找到您要的商品</div>')
      mui('#refreshContainer').pullRefresh().disablePullupToRefresh();
      return
    } else {
      $('.search-list').html('<ul class="product-list"></ul>')
      let renderStr = template('search-result', data)
      $('.product-list').append(renderStr)
      mui('#refreshContainer').pullRefresh().enablePullupToRefresh()
    }
  }
})