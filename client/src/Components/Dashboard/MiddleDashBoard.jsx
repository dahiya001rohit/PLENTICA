import React from 'react'
import Top from './MiddleDashBoard/Top'
import Middle from './MiddleDashBoard/Middle'
import Bottom from './MiddleDashBoard/Bottom'

const MiddleDashBoard = () => {
  return (
    <div className='w-[50%] flex flex-col gap-4 h-full'>
        <Top />
        <Middle />
        <Bottom />
    </div>
  )
}

export default MiddleDashBoard