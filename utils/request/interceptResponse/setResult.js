/**
 * 处理响应数据
 */
const setResult = result => {
  let resultData = null;	
  if (typeof result.data === 'string') {
	  resultData  = JSON.parse(result.data);
  }else{
	  resultData  = result.data;
  }
  const { success, data, message } = resultData;
 
  if(!success) {
	  const errMsg = message || `状态码:${result.statusCode}`;
	  throw new Error(errMsg);
  }
  return data;
}

export default setResult;