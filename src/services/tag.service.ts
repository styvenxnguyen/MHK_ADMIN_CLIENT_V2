import { axiosConfig } from '~/utils/configAxios'

const TAG = {
  GET_ALL: '/tag/get-all',
  CREATE: '/tag/create'
}

export const TagService = {
  getListTag: () => axiosConfig.get(TAG.GET_ALL),
  createTag: (data: any) => axiosConfig.post(TAG.CREATE, data)
}
