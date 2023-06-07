import React from 'react'

interface TitleProps {
  label: string
  subTitle?: string
}

const Title: React.FC<TitleProps> = ({ label, subTitle }) => {
  return (
    <div style={{ padding: '10px 28px', borderBottom: '1px solid #e5e5e5' }}>
      <h4 style={{ fontSize: '16px', fontWeight: '600', marginTop: '8px' }}>{label}</h4>
      {subTitle && <p style={{ marginTop: '12px', color: 'black', fontSize: '14px' }}>{subTitle}</p>}
    </div>
  )
}

export default Title
