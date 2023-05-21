/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext } from 'react'

import { ConfigContext } from '../../../../../contexts/ConfigContext'
import * as actionType from '../../../../../store/actions'

const LayoutOptions = () => {
  const configContext = useContext(ConfigContext)
  if (configContext === null) {
    return null
  }
  const { rtlLayout, navFixedLayout, headerFixedLayout, boxLayout, subLayout }: any = configContext.state
  const { dispatch } = configContext

  let layoutOption = (
    <div className='form-group mb-0'>
      <div className='switch switch-primary d-inline m-r-10'>
        <input
          type='checkbox'
          id='box-layouts'
          checked={boxLayout}
          onChange={() => dispatch({ type: actionType.BOX_LAYOUT, value: '' })}
        />
        <label htmlFor='box-layouts' className='cr' />
      </div>
      <label>Box Layouts</label>
    </div>
  )

  let layoutOptionHeaderFixWithoutBox: JSX.Element = <></>
  let layoutOptionNavFixWithoutBox: JSX.Element = <></>
  if (!boxLayout) {
    layoutOptionHeaderFixWithoutBox = (
      <div className='form-group mb-0'>
        <div className='switch switch-primary d-inline m-r-10'>
          <input
            type='checkbox'
            id='header-fixed'
            checked={headerFixedLayout}
            onChange={() => dispatch({ type: actionType.HEADER_FIXED_LAYOUT})}
          />
          <label htmlFor='header-fixed' className='cr' />
        </div>
        <label>Header Fixed</label>
      </div>
    )
    layoutOptionNavFixWithoutBox = (
      <div className='form-group mb-0'>
        <div className='switch switch-primary d-inline m-r-10'>
          <input
            type='checkbox'
            id='menu-fixed'
            checked={navFixedLayout}
            onChange={() => dispatch({ type: actionType.NAV_FIXED_LAYOUT })}
          />
          <label htmlFor='menu-fixed' className='cr' />
        </div>
        <label>Menu Fixed</label>
      </div>
    )
  }

  if (subLayout !== 'layout-6' && subLayout !== 'layout-8') {
    layoutOption = (
      <div>
        <div className='form-group mb-0'>
          <div className='switch switch-primary d-inline m-r-10'>
            <input
              type='checkbox'
              id='theme-rtl'
              checked={rtlLayout}
              onChange={() => dispatch({ type: actionType.RTL_LAYOUT })}
            />
            <label htmlFor='theme-rtl' className='cr' />
          </div>
          <label>RTL</label>
        </div>
        {layoutOptionNavFixWithoutBox}
        {layoutOptionHeaderFixWithoutBox}
        {layoutOption}
      </div>
    )
  }

  return (
    <React.Fragment>
      <div className='config-scroll'>{layoutOption}</div>
    </React.Fragment>
  )
}

export default LayoutOptions
