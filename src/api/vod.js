import Request from "@/utils/request"

const url = '/admin/vod/video/';

export default {
  deleteVideoById(id) {
    return Request({
      url: url + id,
      method: 'delete'
    })
  }
}
