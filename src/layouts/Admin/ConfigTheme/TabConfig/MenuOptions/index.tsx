/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { titleColors, activeColors } from './listColors'

import { ConfigContext } from '../../../../../contexts/ConfigContext'
import * as actionType from '../../../../../store/actions'

const MenuOptions = () => {
  const configContext: any = useContext(ConfigContext)
  const { layout, navDropdownIcon, navListIcon, navActiveListColor, navListTitleColor, navListTitleHide }: any =
    configContext.state
  const { dispatch } = configContext

  const onChangeNavListTitleColor = (color: any) => {
    dispatch({ type: actionType.NAV_LIST_TITLE_COLOR, navListTitleColor: color })
  }

  const onChangeNavDropDownIcon = (icon: any) => {
    dispatch({ type: actionType.NAV_DROPDOWN_ICON, navDropdownIcon: icon })
  }

  const onChangeNavListIcon = (icon: any) => {
    dispatch({ type: actionType.NAV_LIST_ICON, navListIcon: icon })
  }

  const onChangeNavActiveListColor = (color: any) => {
    dispatch({ type: actionType.NAV_ACTIVE_LIST_COLOR, navActiveListColor: color })
  }

  let menuOptions: any = ''
  if (layout !== 'horizontal') {
    menuOptions = (
      <div>
        <h6>Màu sắc tiêu đề menu</h6>
        <div className='theme-color title-color small'>
          {titleColors.map((titleColor, index) => (
            <Link
              key={`titleColor_${index}`}
              to='#'
              onClick={() => onChangeNavListTitleColor(titleColor)}
              className={navListTitleColor === titleColor ? 'active' : ''}
              data-value={titleColor}
            >
              <span />
              <span />
            </Link>
          ))}
        </div>
        <div className='form-group mb-0'>
          <div className='switch switch-primary d-inline m-r-10'>
            <input
              type='checkbox'
              id='caption-hide'
              checked={navListTitleHide}
              onChange={() => dispatch({ type: actionType.NAV_LIST_TITLE_HIDE })}
            />
            <label htmlFor='caption-hide' className='cr' />
          </div>
          <label>Ẩn tiêu đề menu</label>
        </div>
      </div>
    )
  }

  return (
    <React.Fragment>
      <div className='config-scroll'>
        <h6>Icon menu thả xuống</h6>
        <div className='theme-color'>
          <div className='form-group d-inline'>
            <div className='radio radio-primary d-inline'>
              <input
                type='radio'
                name='radio-in-1'
                id='drpicon-1'
                checked={navDropdownIcon === 'style1'}
                onChange={() => onChangeNavDropDownIcon('style1')}
              />
              <label htmlFor='drpicon-1' className='cr'>
                <i className='feather icon-chevron-right' />
              </label>
            </div>
          </div>
          <div className='form-group d-inline'>
            <div className='radio radio-primary d-inline'>
              <input
                type='radio'
                name='radio-in-1'
                id='drpicon-2'
                checked={navDropdownIcon === 'style2'}
                onChange={() => onChangeNavDropDownIcon('style2')}
              />
              <label htmlFor='drpicon-2' className='cr'>
                <i className='feather icon-chevrons-right' />
              </label>
            </div>
          </div>
          <div className='form-group d-inline'>
            <div className='radio radio-primary d-inline'>
              <input
                type='radio'
                name='radio-in-1'
                id='drpicon-3'
                checked={navDropdownIcon === 'style3'}
                onChange={() => onChangeNavDropDownIcon('style3')}
              />
              <label htmlFor='drpicon-3' className='cr'>
                <i className='feather icon-plus' />
              </label>
            </div>
          </div>
        </div>
        <h6>Icon danh sách menu</h6>
        <div className='theme-color'>
          <div className='form-group d-inline'>
            <div className='radio radio-primary d-inline'>
              <input
                type='radio'
                name='radio-in'
                id='subitem-1'
                checked={navListIcon === 'style1'}
                onChange={() => onChangeNavListIcon('style1')}
              />
              <label htmlFor='subitem-1' className='cr'>
                <i className=' ' />
              </label>
            </div>
          </div>
          <div className='form-group d-inline'>
            <div className='radio radio-primary d-inline'>
              <input
                type='radio'
                name='radio-in'
                id='subitem-2'
                checked={navListIcon === 'style2'}
                onChange={() => onChangeNavListIcon('style2')}
              />
              <label htmlFor='subitem-2' className='cr'>
                <i className='feather icon-minus' />
              </label>
            </div>
          </div>
          <div className='form-group d-inline'>
            <div className='radio radio-primary d-inline'>
              <input
                type='radio'
                name='radio-in'
                id='subitem-3'
                checked={navListIcon === 'style3'}
                onChange={() => onChangeNavListIcon('style3')}
              />
              <label htmlFor='subitem-3' className='cr'>
                <i className='feather icon-check' />
              </label>
            </div>
          </div>
          <div className='form-group d-inline'>
            <div className='radio radio-primary d-inline'>
              <input
                type='radio'
                name='radio-in'
                id='subitem-4'
                checked={navListIcon === 'style4'}
                onChange={() => onChangeNavListIcon('style4')}
              />
              <label htmlFor='subitem-4' className='cr'>
                <i className='icon feather icon-corner-down-right' />
              </label>
            </div>
          </div>
          <div className='form-group d-inline'>
            <div className='radio radio-primary d-inline'>
              <input
                type='radio'
                name='radio-in'
                id='subitem-5'
                checked={navListIcon === 'style5'}
                onChange={() => onChangeNavListIcon('style5')}
              />
              <label htmlFor='subitem-5' className='cr'>
                <i className='icon feather icon-chevrons-right' />
              </label>
            </div>
          </div>
          <div className='form-group d-inline'>
            <div className='radio radio-primary d-inline'>
              <input
                type='radio'
                name='radio-in'
                id='subitem-6'
                checked={navListIcon === 'style6'}
                onChange={() => onChangeNavListIcon('style6')}
              />
              <label htmlFor='subitem-6' className='cr'>
                <i className='icon feather icon-chevron-right' />
              </label>
            </div>
          </div>
        </div>
        <h6>Màu sắc menu được chọn</h6>
        <div className='theme-color active-color small'>
          {activeColors.map((activeColor, index) => (
            <Link
              key={`activeColor_${index}`}
              to='#'
              onClick={() => onChangeNavActiveListColor(activeColor)}
              className={navActiveListColor === activeColor ? 'active' : ''}
              data-value={activeColor}
            >
              <span />
              <span />
            </Link>
          ))}
        </div>
        {menuOptions}
      </div>
    </React.Fragment>
  )
}

export default MenuOptions
