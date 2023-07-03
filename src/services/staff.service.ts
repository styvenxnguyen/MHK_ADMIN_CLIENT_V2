import { axiosConfig } from '~/utils/configAxios'

const STAFF = {
  GET_ALL: '/staff/get-all',
  GET_ALL_ROLE: '/role/get-all',
  GET_DETAIL: (id: string) => `/staff/get-by-id/${id}`
}

const StaffService = {
  getListStaff: () => axiosConfig.get(STAFF.GET_ALL),
  getListRole: () => axiosConfig.get(STAFF.GET_ALL_ROLE),
  getDetailStaff: (id: string) => axiosConfig.get(STAFF.GET_DETAIL(id))
}

export default StaffService
