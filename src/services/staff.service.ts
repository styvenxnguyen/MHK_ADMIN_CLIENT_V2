import { axiosConfig } from '~/utils/configAxios'

const STAFF = {
  GET_ALL: '/staff/get-all'
}

const StaffService = {
  getAllStaff: () => axiosConfig.get(STAFF.GET_ALL)
}

export default StaffService
