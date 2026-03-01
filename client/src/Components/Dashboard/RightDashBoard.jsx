import React from 'react'
import RightTop from './RightDashBoard/RightTop'
import RightMiddle from './RightDashBoard/RightMiddle'
import RightBottom from './RightDashBoard/RightBottom'

const RightDashBoard = ({ data }) => {
  return (
    <div className='w-[25%] h-full flex flex-col gap-4'>
        <RightTop data={data} />
        <RightMiddle data={data} />
        <RightBottom data={data} /> 
    </div>
  )
}

export default RightDashBoard
