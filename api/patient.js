import request from '@/utils/request';

//查询待检患者列表
export function loadPatientList(data){
    return request({
      url: `/inspection/req/v1/list`,
      method: 'POST',
      data
    });
}