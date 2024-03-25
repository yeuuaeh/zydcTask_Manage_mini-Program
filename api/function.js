const globalMethods = {
	  // 定义时间格式化函数
	  formatDateTime: function(timeString) {
	    const date = new Date(timeString);
	    const year = date.getFullYear();
	    const month = date.getMonth() + 1;
	    const day = date.getDate();
	    const hours = date.getHours();
	    const minutes = date.getMinutes();
	    const seconds = date.getSeconds();
	
	    // 格式化时间字符串为 "YYYY-MM-DD HH:mm:ss" 格式
	    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	
	    return formattedDateTime;
	  },
	// 添加前导零的辅助函数
	 addLeadingZero(value) {
	  return value < 10 ? '0' + value : value;
	},
  install(Vue, options) {
	  //toast弹窗的方法
    Vue.prototype.$showToast = function(msg) {
      uni.showToast({
        title: msg,
        icon: 'none'
      });
    }
	
	// 封装弹窗函数并挂载到Vue原型上
	Vue.prototype.$showCustomModal = function(title, content, confirmText, cancelText, confirmCallback, cancelCallback) {
	  uni.showModal({
	    title: title,
	    content: content,
	    confirmText: confirmText || '确认',
	    cancelText: cancelText || '取消',
		showCancel: cancelText ? true : false, // 根据是否传入取消按钮来决定是否显示取消按钮
	    success: function (res) {
	      if (res.confirm) {
	        if (confirmCallback && typeof confirmCallback === 'function') {
	          confirmCallback();
	        }
	      } else if (res.cancel) {
	        if (cancelCallback && typeof cancelCallback === 'function') {
	          cancelCallback();
	        }
	      }
	    }
	  });

	};
  }
}

export default globalMethods;
