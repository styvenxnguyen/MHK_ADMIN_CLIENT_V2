import { axiosConfig } from '~/utils/configAxios'

const DEBT = {
  GET_ALL_CHANGE_LOGS: (id: string) => `/debt/get-change-logs/${id}`,
  GET_TOTAL: (id: string) => `/debt/${id}`
}

const DebtService = {
  getAllChangeLogs: (id: string) => axiosConfig.get(DEBT.GET_ALL_CHANGE_LOGS(id)),
  getTotal: (id: string) => axiosConfig.get(DEBT.GET_TOTAL(id))
}

export default DebtService
