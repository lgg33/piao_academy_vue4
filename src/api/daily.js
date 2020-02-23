import request from '@/utils/request';

const url = '/admin/statistics/daily/';

export default {
  createStatistics(day) {
    return request({
      url: url + day,
      method: 'post'
    })
  },
  showChart(searchObj) {
    return request({
      url: url + searchObj.begin + '/' + searchObj.end + '/' + searchObj.type,
      method: 'get'
    })
  }
}
