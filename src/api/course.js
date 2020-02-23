import request from '@/utils/request';

const url = '/edu/course/';

export default {
  saveCourseInfo(course) {
    return request({
      url: url,
      method: 'post',
      data: course
    });
  },
  getById(id) {
    return request({
      url: url + 'info/' + id,
      method: 'get',
    });
  },
  updateById(course) {
    return request({
      url: url + 'info',
      method: 'put',
      data: course
    })
  },
  getPageBy(num, size, course) {
    return request({
      url: url + 'findPageBy/' + num + '/' + size,
      method: 'post',
      data: course
    })
  },
  getPublishInfo(id) {
    return request({
      url: url + 'publish/' + id,
      method: 'get'
    })
  },
  publish(id) {
    return request({
      url: url + 'publish/' + id,
      method: 'put'
    })
  },
  deleteById(id) {
    return request({
      url: url + id,
      method: 'delete'
    })
  }
}
