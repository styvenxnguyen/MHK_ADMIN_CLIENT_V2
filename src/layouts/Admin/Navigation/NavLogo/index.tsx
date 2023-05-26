import React, { useContext } from 'react'
import { Link } from 'react-router-dom'

import { ConfigContext } from '~/contexts/ConfigContext'
import * as actionType from '~/store/actions'

const NavLogo = () => {
  const configContext: any = useContext(ConfigContext)
  const { collapseMenu } = configContext.state
  const { dispatch } = configContext

  let toggleClass = ['mobile-menu']
  if (collapseMenu) {
    toggleClass = [...toggleClass, 'on']
  }

  return (
    <React.Fragment>
      <div className='navbar-brand header-logo'>
        <Link to='/' className='b-brand'>
          <div className='b-bg'>
            <i className='feather icon-trending-up' />
          </div>
          <span className='b-title'>MHK TECH</span>
        </Link>
        <Link
          to='#'
          className={toggleClass.join(' ')}
          id='mobile-collapse'
          onClick={() => dispatch({ type: actionType.COLLAPSE_MENU })}
        >
          <span />
        </Link>
      </div>
    </React.Fragment>
  )
}

export default NavLogo
