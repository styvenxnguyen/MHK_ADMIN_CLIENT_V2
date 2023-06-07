import React from 'react'

interface TitleProps {
  label: string
  subTitle?: string
}

const Title: React.FC<TitleProps> = ({ label, subTitle }) => {
  return (
    <div className='px-7 py-2.5 border-b border-gray-300'>
      <h4 className='text-[17px] font-semibold mt-2'>{label}</h4>
      {subTitle && <p className='mt-3 text-black'>{subTitle}</p>}
    </div>
  )
}

export default Title
