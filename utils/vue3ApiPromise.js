/**
 * 在 Vue 2 项目中， 使用 Vue 3 项目 API Promise 化 返回格式
 * https://uniapp.dcloud.io/api/README?id=promise-%e5%b0%81%e8%a3%85
 * 可以在项目中使用  Async/Await 方式调用
 */
// 在 main.js 中写入以下代码即可
function isPromise (obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'
}

uni.addInterceptor({
  returnValue (res) {
    if (!isPromise(res)) {
      return res;
    }
    return new Promise((resolve, reject) => {
      res.then(res => {
        if (res[0]) {
          reject(res[0]);
        } else {
          resolve(res[1]);
        }
      });
    });
  }
});