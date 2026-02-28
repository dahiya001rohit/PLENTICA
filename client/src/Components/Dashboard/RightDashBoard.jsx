import React from 'react'
import RightTop from './RightDashBoard/RightTop'
import RightMiddle from './RightDashBoard/RightMiddle'
import RightBottom from './RightDashBoard/RightBottom'

const RightDashBoard = () => {
  return (
    <div className='w-[25%] h-full flex flex-col gap-4'>
        <RightTop />
        <RightMiddle />
        <RightBottom /> 
    </div>
  )
}

export default RightDashBoard
