export default {
  methods: {
    __S4 () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    },
    $getUUID (prefix) {
      return ((prefix || '') + this.__S4() + this.__S4() + '-' + this.__S4() + '-' + this.__S4() + '-' + this.__S4() + '-' + this.__S4() + this.__S4() + this.__S4())
    },
    $timeFormat (ts, format = 'YYYY-MM-DD hh:mm:ss') {
      let nowYear = (new Date()).getFullYear()
      let time = (new Date(ts))
      let year = time.getFullYear()
      let month = time.getMonth() + 1
      month = (month < 10 ? ('0' + month) : month)
      let date = time.getDate()
      date = (date < 10 ? ('0' + date) : date)
      let hour = time.getHours()
      hour = (hour < 10 ? ('0' + hour) : hour)
      let minute = time.getMinutes()
      minute = (minute < 10 ? ('0' + minute) : minute)
      let second = time.getSeconds()
      second = (second < 10 ? ('0' + second) : second)
      let _format = format
      if (nowYear == year) {
        _format = _format.replace(/(YYYY.)/, '')
      }
      return _format.replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', date)
        .replace('hh', hour)
        .replace('mm', minute)
        .replace('ss', second)
    },
    $limitInputNumber (e) {
      /**
         * 限制输入类型  只能为 number
         */
      var et = e || window.event
      var keycode = et.charCode || et.keyCode
      if ((keycode > 57 || keycode < 48) && keycode !== 8 && keycode !== 37 && keycode !== 39 && keycode !== 9) {
        if (window.event) {
          window.event.returnValue = false
        } else {
          e.preventDefault() // for firefox
        }
      }
    }
  }
}