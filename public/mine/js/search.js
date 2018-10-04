$(function () {
  /* 全局变量 */
  var options = {}
  // 为了判断是否还有数据，page固定
  var pageSize = 4

  // 初始化区域滚动
  mui('.mui-scroll-wrapper').scroll({
    scrollY: true, //是否竖向滚动
    scrollX: false, //是否横向滚动
    startX: 0, //初始化时滚动至x
    startY: 0, //初始化时滚动至y
    indicators: false, //是否显示滚动条
    deceleration: 0.001, //阻尼系数,系数越小滑动越灵敏
    bounce: true //是否启用回弹
  })

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
              mui('#refreshContainer').pullRefresh().refresh(true)
              renderList(data)
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
              let hasNoMore = options.page * pageSize > parseInt(data.count)
              if (hasNoMore) {
                // 回退有数据的页面
                options.page = options.page - 1
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

    getSearch(options, renderList)
  })

  // 绑定排序事件
  $('.orderbar>span').on('tap', function () {
    $this = $(this)
    $icon = $this.children('span')
    if (!$this.hasClass('selected')) {
      $(this).addClass('selected').siblings().removeClass('selected')
      return
    }

    if ($icon.hasClass('mui-icon-arrowdown')) {
      $icon.removeClass('mui-icon-arrowdown').addClass('mui-icon-arrowup')
      return
    }

    $icon.removeClass('mui-icon-arrowup').addClass('mui-icon-arrowdown')

  })

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
})