import { axiosConfig } from '~/utils/configAxios'

const TAG = {
  GET_ALL: '/tag/get-all'
}

export const TagService = {
  getListTag: () => axiosConfig.get(TAG.GET_ALL)
}
