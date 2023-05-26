/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'

import TabConfig from './TabConfig'
import Layout from './Layout'

import { ConfigContext } from '../../../contexts/ConfigContext'
import * as actionType from '../../../store/actions'

const ConfigTheme = () => {
  const [configOpen, setConfigOpen] = useState(false)
  const configContext: any = useContext(ConfigContext)

  const { navIconColor }: any = configContext.state
  const { dispatch }: any = configContext

  let configClass = ['menu-styler']
  if (configOpen) {
    configClass = [...configClass, 'open']
  }

  return (
    <React.Fragment>
      <div id='styleSelector' className={configClass.join(' ')}>
        <div className='style-toggler'>
          <Link to='#' onClick={() => setConfigOpen(!configOpen)}>
            *
          </Link>
        </div>
        <div className='style-block'>
          <h5 className='mb-2'>Cài đặt giao diện</h5>
          <hr />
          <div className='m-style-scroller'>
            <Layout />

            {/* icon colored */}
            <div style={{ marginBottom: '1.5rem', marginTop: '1.5rem' }} className='form-group'>
              <div className='switch switch-primary d-inline m-r-10'>
                <input
                  type='checkbox'
                  id='icon-colored'
                  checked={navIconColor}
                  onChange={() => dispatch({ type: actionType.NAV_ICON_COLOR })}
                />
                <label htmlFor='icon-colored' className='cr' />
              </div>
              <label>Màu sắc Icon</label>
            </div>

            <TabConfig />
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default ConfigTheme
