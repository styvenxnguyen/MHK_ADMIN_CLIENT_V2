/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext } from 'react'

import { ConfigContext } from '~/contexts/ConfigContext'
import * as actionType from '~/store/actions'

const LayoutOptions = () => {
  const configContext: any = useContext(ConfigContext)
  const { rtlLayout, navFixedLayout, headerFixedLayout, boxLayout, subLayout }: any = configContext.state
  const { dispatch } = configContext

  let layoutOption = (
    <div className='form-group mb-0'>
      <div className='switch switch-primary d-inline m-r-10'>
        <input
          type='checkbox'
          id='box-layouts'
          checked={boxLayout}
          onChange={() => dispatch({ type: actionType.BOX_LAYOUT })}
        />
        <label htmlFor='box-layouts' className='cr' />
      </div>
      <label>Bố cục hộp</label>
    </div>
  )

  let layoutOptionHeaderFixWithoutBox: any = ''
  let layoutOptionNavFixWithoutBox: any = ''
  if (!boxLayout) {
    layoutOptionHeaderFixWithoutBox = (
      <div className='form-group mb-0'>
        <div className='switch switch-primary d-inline m-r-10'>
          <input
            type='checkbox'
            id='header-fixed'
            checked={headerFixedLayout}
            onChange={() => dispatch({ type: actionType.HEADER_FIXED_LAYOUT })}
          />
          <label htmlFor='header-fixed' className='cr' />
        </div>
        <label>Phần đầu trang cố định</label>
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
        <label>Thanh điều hướng cố định</label>
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
          <label>Phương ngôn ngữ từ phải qua trái</label>
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
