import Request from "@/utils/request"

const url = '/edu/video/';

export default {
  saveVideo(videoInfoForm) {
    return Request({
      url: url,
      method: 'post',
      data: videoInfoForm
    })
  },
  findById(id) {
    return Request({
      url: url + id,
      method: 'get'
    });
  },
  updateById(videoInfoForm) {
    return Request({
      url: url,
      method: 'put',
      data: videoInfoForm
    })
  },
  deleteById(id) {
    return Request({
      url: url + id,
      method: 'delete'
    })
  }
}

