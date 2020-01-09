import request from '@/utils/request'

const url = '/edu/teacher/';

export default {
  getPageList(num, size, queryInfo) {
    return request({
      url: url + 'findPageBy/' + num + '/' + size,
      method: 'post',
      data: queryInfo
    });
  },
  deleteById(id) {
    return request({
      url: url + id,
      method: 'delete'
    })
  },
  saveTeacher(teacher) {
    return request({
      url: url + 'addTeacher',
      method: 'post',
      data: teacher
    })
  },
  getById(id) {
    return request({
      url: url + id,
      method: 'get'
    })
  },
  update(teacher) {
    return request({
      url: url + 'updateById',
      method: 'put',
      data: teacher
    })
  },
  getByName(name) {
    return request({
      url: url + 'getByName/' + name,
      method: 'get',
    })
  },
}
