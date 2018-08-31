import wepy from 'wepy'

export const logMessage = msg => {
  wepy.showModal({
    title: '',
    content: String(msg),
    showCancel: false
  })
}

export const debounce = (func, delay) => {
  let inDebounce
  return function() {
    const context = this
    const args = arguments
    clearTimeout(inDebounce)
    inDebounce = setTimeout(() => func.apply(context, args), delay)
  }
}

/* 获取当前页带参数的url */
export const getCurrentPageUrlWithArgs = () => {
  // eslint-disable-next-line
  const pages = getCurrentPages() // 获取加载的页面
  const currentPage = pages[pages.length - 1] // 获取当前页面的对象
  const url = currentPage.route.split('/')[1] // 当前页面url
  const options = currentPage.options // 如果要获取url中所带的参数可以查看options

  // 拼接url的参数
  let urlWithArgs = url + '?'
  for (let key in options) {
    var value = options[key]
    urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

  return urlWithArgs
}

export const reLogin = msg => {
  wepy.clearStorageSync()
  wepy.reLaunch({
    url: getCurrentPageUrlWithArgs()
  })
}
