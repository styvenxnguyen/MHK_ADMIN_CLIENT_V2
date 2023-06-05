import { axiosConfig } from '~/utils/configAxios'

const AGENCY_BRANCH = {
  GET_ALL: '/agency-branch/get-all'
}

const AgencyBranchService = {
  getAllAgencyBranch: () => axiosConfig.get(AGENCY_BRANCH.GET_ALL)
}

export default AgencyBranchService
