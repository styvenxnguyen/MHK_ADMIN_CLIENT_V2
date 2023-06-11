/* eslint-daxiosConfigsisable @typescript-eslint/no-empty-function */
import { useEffect, useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import Select from 'react-select'
import { axiosConfig } from '~/utils/configAxios'
import { Link } from 'react-router-dom'
import Error from '~/views/Errors'
import PageLoader from '~/components/Loader/PageLoader'

const Positions = ({ positions, setPositions }: any) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isFetched, setIsFetched] = useState(false)
  const [usedBranchValues, setUsedBranchValues]: any = useState([])
  const [usedRoleValues, setUsedRoleValues]: any = useState([])
  const [optionsBranch, setOptionsBranch] = useState([])
  const [optionsRole, setOptionsRole] = useState([])

  useEffect(() => {
    axiosConfig
      .get('/agency-branch/get-all')
      .then((res) => {
        const result = res.data.data
        const options = result.map((branch: any) => ({
          label: branch.agency_branch_name,
          value: branch.id
        }))
        setOptionsBranch(options)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  useEffect(() => {
    axiosConfig
      .get('/role/get-all')
      .then((res) => {
        const result = res.data.data
        const options = result.map((role: any) => ({
          label: role.role_title,
          value: role.id
        }))
        setOptionsRole(options)
        setIsLoading(false)
        setIsFetched(true)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [])

  const handleAddRole = () => {
    setPositions([...positions, { role: availableRoleOptions[0], branches: [] }])
  }

  const handleRoleChange = (role: any, index: any) => {
    const newRole = [...positions.slice(0, index), { ...positions[index], role }, ...positions.slice(index + 1)]
    setPositions(newRole)
  }

  const handleBranchChange = (selectedOptions: any, index: any) => {
    const newBranch = [...positions]
    newBranch[index].branches = selectedOptions
    setPositions(newBranch)
  }

  useEffect(() => {
    const selectedRoleValues = positions.map((item: any) => item.role.value)
    setUsedRoleValues(selectedRoleValues)

    const selectedBranchValues = positions.flatMap((item: any) => item.branches.map((branch: any) => branch.value))
    setUsedBranchValues(selectedBranchValues)
  }, [positions])

  const availableRoleOptions = optionsRole.filter((option: any) => !usedRoleValues.includes(option.value))
  const availableBranchOptions = optionsBranch.filter((option: any) => !usedBranchValues.includes(option.value))

  const handleRemoveRole = (index: any) => {
    setPositions([...positions.slice(0, index), ...positions.slice(index + 1)])
  }

  // const formatOptionLabel = ({ value, label }) => (
  //   <div>
  //     <span>{label}</span>
  //     {optionsBranch.some((option) => option.value === value) && (
  //       <span className="badge badge-pill badge-primary ml-2">Đang hoạt động</span>
  //     )}
  //   </div>
  // );

  if (isLoading) return <PageLoader option='25vh' />

  if (!isFetched) {
    return <Error errorCode='500' />
  }
  return (
    <>
      {positions.map((position: any, index: any) => (
        <Row key={index} className='align-items-center'>
          <Col lg={5}>
            <Form.Group>
              <Form.Label>
                Vai trò <span className='text-c-red'>*</span>
              </Form.Label>
              <Select
                name={`role-${index}`}
                defaultValue={position.role}
                onChange={(role) => handleRoleChange(role, index)}
                placeholder='Chọn vai trò'
                options={availableRoleOptions}
                noOptionsMessage={() => 'Đã chọn hết vai trò'}
              ></Select>
            </Form.Group>
          </Col>
          <Col lg={5}>
            <Form.Group controlId={`branch-${index}`}>
              <Form.Label>
                Chi nhánh <span className='text-c-red'>*</span>
              </Form.Label>
              <Select
                placeholder='Chọn chi nhánh'
                onChange={(selectedOptions) => handleBranchChange(selectedOptions, index)}
                options={availableBranchOptions}
                isMulti
                defaultValue={position.branches}
                noOptionsMessage={() => 'Đã chọn hết chi nhánh'}
              ></Select>
            </Form.Group>
          </Col>
          <Col lg={2}>
            {index === 0 && (
              <Link to='#' className='ml-5 mr-5' href='#'>
                Xem chi tiết
              </Link>
            )}
            {index > 0 && (
              <span>
                <Link to='#' className='ml-5 mr-5' onClick={(e) => e.preventDefault()}>
                  Xem chi tiết
                </Link>
                <Link
                  to='#'
                  onClick={(e) => {
                    handleRemoveRole(index)
                    e.preventDefault()
                  }}
                >
                  Xoá
                </Link>
              </span>
            )}
          </Col>
        </Row>
      ))}

      <Row className='mt-2'>
        {availableBranchOptions.length === 0 || availableRoleOptions.length === 0 ? null : (
          <Col sm={12} lg={12}>
            <Button onClick={handleAddRole}>Thêm vai trò</Button>
          </Col>
        )}
      </Row>
    </>
  )
}

export default Positions
