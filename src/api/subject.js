import request from '@/utils/request'

const url = '/edu/subject/';

export default {
  getList() {
    return request({
      url: url,
      method: 'get'
    });
  },
  deleteById(id) {
    return request({
      url: url + id,
      method: 'delete'
    });
  },
  save(subject) {
    return request({
      url: url + 'addSubjectFirst',
      method: 'post',
      data: subject
    });
  },
  saveTwo(subject) {
    return request({
      url: url + 'addSubjectSecond',
      method: 'post',
      data: subject
    });
  }
}
