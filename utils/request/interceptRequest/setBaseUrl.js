/**
 * 拼接Url
 */
import { baseUrl } from '@/env.js';

const  setBaseUrl = options => {
	//console.log('setBaseUrl===>');
	if (!options.url.startsWith('http')) {
		const separator = (options.url && options.url.startsWith('/')) ? '' : '/';
		options.url =  baseUrl + separator + options.url;
	}
};
export default setBaseUrl;