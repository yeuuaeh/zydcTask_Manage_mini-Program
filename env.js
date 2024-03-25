// 测试地址
// const devApi = 'http://10.10.10.66:8090'; // 个人测试环境
const devApi = 'https://rybigdata.com'; // 预发布环境
const devImgSrc = devApi;
const devPdfViewUrl = `${devImgSrc}/pdf/web/#/PreviewPdf`;

//生成环境
const proApi    = 'https://rybigdata.com';
const proImgSrc =  proApi;
const proPdfViewUrl = `${proApi}/pdf/web/#/PreviewPdf`;

let baseUrl,imgSrc,pdfViewUrl;
const apiVersionCode = '1';
//在HBuilderX 中，点击“运行”编译出来的代码是开发环境，点击“发行”编译出来的代码是生产环境
// cli模式下，是通行的编译环境处理方式。
if (process.env.NODE_ENV === 'development') {
	console.log('开发环境');
	baseUrl  = devApi + '/dev-api';
	imgSrc       = devImgSrc;
	pdfViewUrl  = devPdfViewUrl;
} else {
	console.log('生产环境');
	baseUrl = proApi + '/dev-api';
	imgSrc      = proImgSrc;
	pdfViewUrl  = proPdfViewUrl;
}

export {
	baseUrl,
	apiVersionCode,
	imgSrc,
	pdfViewUrl
}
