import React, { useContext } from 'react'
import { Link } from 'react-router-dom'

import { ConfigContext } from '../../../../../contexts/ConfigContext'
import * as actionType from '../../../../../store/actions'

import {
  brandColor,
  navBgImages,
  hexBgColors,
  backImages,
  patternImages,
  navbarColors,
  headerColors
} from './listColors'

const ColorOptions = () => {
  const configContext = useContext(ConfigContext)
  if (configContext === null) {
    return null
  }
  const { layout, subLayout, headerBackColor, navBrandColor, navBackImage, layout6Background, navBackColor }: any =
    configContext.state
  const { dispatch } = configContext

  let colorOptions: JSX.Element = <></>
  let colorOptionsWithoutHorizontal: JSX.Element = <></>

  const onChangeNavBrandColor = (brand: any) => {
    dispatch({ type: actionType.NAV_BRAND_COLOR, value: brand })
  }

  const onChangeNavBackImage = (image: any) => {
    dispatch({ type: actionType.NAV_BACK_IMAGE, value: image })
  }

  const onChangeLayout6Background = (backgound: any) => {
    dispatch({ type: actionType.LAYOUT6_BACKGROUND, value: backgound })
  }

  const onChangeHeaderBackColor = (backgound: any) => {
    dispatch({ type: actionType.HEADER_BACK_COLOR, value: backgound })
  }

  const onChangeNavBackColor = (backgound: any) => {
    dispatch({ type: actionType.NAV_BACK_COLOR, value: backgound })
  }

  if (subLayout !== 'layout-6' && layout !== 'horizontal') {
    colorOptionsWithoutHorizontal = (
      <div>
        <h6>Menu Brand Color</h6>
        <div className='theme-color brand-color'>
          {brandColor.map((brand: any, index: any) => (
            <Link
              key={`brand_${index}`}
              to='#'
              onClick={() => onChangeNavBrandColor(brand)}
              className={navBrandColor === 'brand-default' ? 'active' : ''}
              data-value={brand}
            >
              <span />
              <span />
            </Link>
          ))}
        </div>
        <h6>Navbar Image</h6>
        <div className='theme-color navbar-images'>
          {navBgImages.map((image: any, index) => (
            <Link
              key={`navImages_${index}`}
              to='#'
              onClick={() => onChangeNavBackImage(image.name)}
              className={navBackImage === image.name ? 'active' : ''}
              style={{ backgroundImage: `url(${image.image})` }}
              data-value={image.name}
            >
              <span />
              <span />
            </Link>
          ))}
        </div>
      </div>
    )
  }

  if (subLayout === 'layout-6') {
    colorOptions = (
      <div>
        <h6>Background Color</h6>
        <div className='theme-color laybg-color small'>
          {hexBgColors.map((hexColor, index) => (
            <Link
              key={`hexBgColor_${index}`}
              to='#'
              onClick={() =>
                onChangeLayout6Background(`linear-gradient(to right, ${hexColor.color1} 0%, ${hexColor.color2} 100%)`)
              }
              className={
                layout6Background === `linear-gradient(to right, ${hexColor.color1} 0%, ${hexColor.color2} 100%)`
                  ? 'active'
                  : ''
              }
              data-value={`linear-gradient(to right, ${hexColor.color1} 0%, ${hexColor.color2} 100%)`}
              style={{ background: `linear-gradient(to right, ${hexColor.color1} 0%, ${hexColor.color2} 100%)` }}
            >
              <span />
            </Link>
          ))}
        </div>
        <h6>Background Image</h6>
        <hr />
        <div className='theme-color bg-images'>
          {backImages.map((bgImage, index) => (
            <Link
              key={`bgImage_${index}`}
              to='#'
              onClick={() => onChangeLayout6Background(`url(${bgImage}), 'cover`)}
              className={layout6Background === `url(${bgImage})` ? 'active' : ''}
              style={{ backgroundImage: `url(${bgImage})` }}
            >
              <span />
            </Link>
          ))}
        </div>
        <h6>Background Pattern</h6>
        <hr />
        <div className='theme-color bg-images pattern'>
          {patternImages.map((pattern, index) => (
            <Link
              key={`patternImage_${index}`}
              to='#'
              onClick={() => onChangeLayout6Background(`url(${pattern}), 'auto'`)}
              className={layout6Background === `url(${pattern})` ? 'active' : ''}
              style={{ backgroundImage: `url(${pattern})` }}
            >
              <span />
            </Link>
          ))}
        </div>
      </div>
    )
  } else {
    colorOptions = (
      <div>
        <h6>header background</h6>
        <div className='theme-color header-color'>
          {headerColors.map((headerColor, index) => (
            <Link
              key={`headerColor_${index}`}
              to='#'
              onClick={() => onChangeHeaderBackColor(headerColor)}
              className={headerBackColor === headerColor ? 'active' : ''}
              data-value={headerColor}
            >
              <span />
              <span />
            </Link>
          ))}
        </div>
        <h6>Menu background</h6>
        <div className='theme-color navbar-color'>
          {navbarColors.map((navbarColor, index) => (
            <Link
              key={`navbarColor_${index}`}
              to='#'
              onClick={() => onChangeNavBackColor(navbarColor)}
              className={navBackColor === navbarColor ? 'active' : ''}
              data-value={navbarColor}
            >
              <span />
              <span />
            </Link>
          ))}
        </div>
        {colorOptionsWithoutHorizontal}
      </div>
    )
  }

  return (
    <React.Fragment>
      <div className='config-scroll'>{colorOptions}</div>
    </React.Fragment>
  )
}

export default ColorOptions
