import { AgencyBranch } from '~/types/AgencyBranch.type'
import { axiosConfig } from '~/utils/configAxios'

const AGENCY_BRANCH = {
  GET_ALL: '/agency-branch/get-all',
  CREATE: '/agency-branch/create',
  UPDATE: (id: string) => `/agency-branch/update-by-id/${id}`
}

const AgencyBranchService = {
  getListAgencyBranch: () => axiosConfig.get(AGENCY_BRANCH.GET_ALL),
  createAgencyBranch: (data: AgencyBranch) => axiosConfig.post(AGENCY_BRANCH.CREATE, data),
  updateAgencyBranch: (id: string, data: AgencyBranch) => axiosConfig.patch(AGENCY_BRANCH.UPDATE(id), data)
}

export default AgencyBranchService
