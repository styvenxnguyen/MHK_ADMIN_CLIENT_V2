import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const NavSearch = (props: any) => {
  const { windowWidth } = props
  const [isOpen, setIsOpen] = useState(windowWidth < 600)
  const [searchString, setSearchString]: any = useState(windowWidth < 600 ? '100px' : '')
  const navbarRight = document.querySelector('#navbar-right')

  const searchOnHandler = () => {
    if (windowWidth < 600 && navbarRight) {
      navbarRight.classList.add('d-none')
    }
    setIsOpen(true)
    setSearchString('300px')
  }

  const searchOffHandler = () => {
    setIsOpen(false)
    setSearchString(0)
    setTimeout(() => {
      if (windowWidth < 600 && navbarRight) {
        navbarRight.classList.remove('d-none')
      }
    }, 500)
  }

  let searchClass = ['main-search']
  if (isOpen) {
    searchClass = [...searchClass, 'open']
  }

  return (
    <React.Fragment>
      <div id='main-search' className={searchClass.join(' ')}>
        <div className='input-group'>
          <input
            type='text'
            id='m-search'
            className='form-control'
            placeholder='Tìm kiếm...'
            style={{ width: searchString }}
          />
          <Link to='#' className='input-group-append search-close mr-2' onClick={searchOffHandler}>
            <i className='feather icon-x input-group-text' />
          </Link>
          <Button className='input-group-append search-btn btn btn-primary' onClick={searchOnHandler}>
            <i className='feather icon-search input-group-text' />
          </Button>
        </div>
      </div>
    </React.Fragment>
  )
}

export default NavSearch
