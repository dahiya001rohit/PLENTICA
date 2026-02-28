import React from 'react'
import LeftDashboard from './Dashboard/LeftDashBoard'
import MiddleDashBoard from './Dashboard/MiddleDashBoard'
import RightDashBoard from './Dashboard/RightDashBoard'

const DashBoard = () => {
  return (
    <div className='w-full h-screen bg-[#F0ECE3] mt-20 mb-8 flex gap-6 justify-center '>
        <LeftDashboard />
        <MiddleDashBoard />
        <RightDashBoard />
    </div>
  )
}

export default DashBoard
