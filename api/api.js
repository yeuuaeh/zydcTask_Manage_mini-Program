const BASE_URL = 'https://dev.ai-boy.cn/api/task-manager/1.1/'

export const myRequest = (options) => {
	console.log("options==");
	return new Promise((resolve, reject) => {
		uni.request({
			url: BASE_URL + options.url,
			method: options.method || 'GET',
			data: options.data || {},
			header: {
				"Content-Type": "application/json", // 设置Content-Type为application/json
				"token": options.token // 设置token，假设token已经定义
			},
			success: (res) => {
				console.log("ressss==", res.data.code)
				if (res.data.code == 0) {

					resolve(res)
				} else {
					resolve(res)
				}

			},
			fail: (err) => {
				console.log("err" + err);
				uni.showToast({
					title: JSON.stringify(err)
				})

				reject(err)
			}
		})
	})
}