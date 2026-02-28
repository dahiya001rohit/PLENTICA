import React from 'react'

const RightBottom = () => {
  return (
    <div className='w-full h-[10%]'>
      <div className='w-full h-full bg-linear-to-r from-green-700 to-green-900 rounded-xl p-4 flex items-center justify-between'>
        <div className='flex flex-col'>
          <span className='text-[10px] font-semibold text-green-300 uppercase tracking-wide'>Local Weather</span>
          <span className='text-2xl font-bold text-white'>24°C</span>
          <span className='text-xs text-green-200'>Partly Cloudy</span>
        </div>
        <div className='text-4xl'>☁️</div>
      </div>
    </div>
  )
}

export default RightBottom
