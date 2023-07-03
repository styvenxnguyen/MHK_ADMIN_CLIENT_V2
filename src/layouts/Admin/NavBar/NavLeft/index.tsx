import React, { useContext, useEffect, useState } from 'react'
import { ListGroup, Dropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import useWindowSize from '~/hooks/useWindowSize'
import { ConfigContext } from '../../../../contexts/ConfigContext'
import NavSearch from './NavSearch'
import AgencyBranchService from '~/services/agencybranch.service'

const NavLeft = () => {
  const [dataBranch, setDataBranch] = useState([])

  useEffect(() => {
    AgencyBranchService.getListAgencyBranch().then((res) => {
      setDataBranch(res.data.data)
    })
  }, [])

  const windowSize = useWindowSize()
  const configContext: any = useContext(ConfigContext)

  const { rtlLayout }: any = configContext.state
  let dropdownRightAlign = false
  if (rtlLayout) {
    dropdownRightAlign = true
  }

  let navItemClass = ['nav-item']
  if (windowSize.width <= 575) {
    navItemClass = [...navItemClass, 'd-none']
  }

  return (
    <React.Fragment>
      <ListGroup as='ul' bsPrefix=' ' className='navbar-nav mr-auto'>
        <ListGroup.Item as='li' bsPrefix=' ' className={navItemClass.join(' ')}>
          <Dropdown alignRight={dropdownRightAlign}>
            <Dropdown.Toggle variant={'link'} id='dropdown-basic'>
              Tất cả chi nhánh
            </Dropdown.Toggle>
            <ul>
              <Dropdown.Menu>
                {dataBranch.map((branch: any, index) => (
                  <li key={index}>
                    <Link
                      onClick={() => alert(`Chọn chi nhánh ${branch.agency_branch_name} `)}
                      to='#'
                      className='dropdown-item hover-transparent'
                    >
                      {branch.agency_branch_name}
                    </Link>
                  </li>
                ))}
              </Dropdown.Menu>
            </ul>
          </Dropdown>
        </ListGroup.Item>
        <ListGroup.Item as='li' bsPrefix=' ' className='nav-item'>
          <NavSearch windowWidth={windowSize.width} />
        </ListGroup.Item>
      </ListGroup>
    </React.Fragment>
  )
}

export default NavLeft
