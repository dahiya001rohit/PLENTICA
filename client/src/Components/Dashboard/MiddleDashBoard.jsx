import React from 'react'
import Top from './MiddleDashBoard/Top'
import Middle from './MiddleDashBoard/Middle'
import Bottom from './MiddleDashBoard/Bottom'

const MiddleDashBoard = ({data, landSize}) => {
  return (
    <div className='w-[50%] flex flex-col gap-4 h-full'>
        <Top data={data} />
        <Middle data={data} landSize={landSize}/>
        <Bottom data={data} />
    </div>
  )
}

export default MiddleDashBoard