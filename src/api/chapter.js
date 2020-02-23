import request from '@/utils/request';

const url = '/edu/chapter/';

export default {
  getNestedChapter(id) {
    return request({
      url: url + 'nested/' + id,
      method: 'get'
    });
  },
  save(chapter) {
    return request({
      url: url,
      method: 'post',
      data: chapter
    });
  },
  getById(id) {
    return request({
      url: url + id,
      method: 'get',
    })
  },
  updateById(chapter) {
    return request({
      url: url,
      method: 'put',
      data: chapter
    });
  },
  deleteById(id) {
    return request({
      url: url + id,
      method: 'delete'
    });
  }
}
